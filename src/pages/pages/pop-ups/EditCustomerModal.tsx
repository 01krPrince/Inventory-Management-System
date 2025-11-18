import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Search, ChevronDown, Edit3, Check, Loader2 } from "lucide-react";
import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  Auth,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  Firestore,
  setLogLevel,
} from "firebase/firestore";

setLogLevel("error");

// --- Global Variables (Provided by Canvas Environment) ---
const appId =
  typeof __app_id !== "undefined" ? __app_id : "default-rate-list-app";
const firebaseConfig =
  typeof __firebase_config !== "undefined" ? JSON.parse(__firebase_config) : {};
const initialAuthToken =
  typeof __initial_auth_token !== "undefined" ? __initial_auth_token : null;
// const apiKey = ""; // Not used directly in the frontend fetch calls for Canvas

// --- TYPE DEFINITIONS ---

interface RateEntry {
  id: number;
  rateListName: string;
  effectiveFrom: string;
  [key: string]: string | number | undefined; // For dynamic property access
}

interface SalesRateEntry extends RateEntry {
  rate: number;
  dealerRate: number;
  wholesaleRate: number;
  mrp: number;
}

interface PurchaseRateEntry extends RateEntry {
  rate: number;
  mrp: number;
  minPrice: number;
  discount: string;
}

interface ItemOption {
  label: string;
  value: string;
}

interface HeaderMap {
  label: string;
  key: keyof (SalesRateEntry | PurchaseRateEntry);
  editable: boolean;
  isPrice: boolean;
}

interface RateListTableProps {
  title: string;
  headersMap: HeaderMap[];
  data: RateEntry[];
  isEditing: boolean;
  onRateChange: (rowIndex: number, key: string, value: number) => void;
}

// --- Static Data for Initial Seeding and Item Selection ---
const initialSalesData: SalesRateEntry[] = [
  {
    id: 1,
    rateListName: "Standard Sales Rate",
    effectiveFrom: "2024-01-01",
    rate: 150.0,
    dealerRate: 140.0,
    wholesaleRate: 130.0,
    mrp: 180.0,
  },
  {
    id: 2,
    rateListName: "Q3 Promotional Rate",
    effectiveFrom: "2024-07-01",
    rate: 145.0,
    dealerRate: 135.0,
    wholesaleRate: 125.0,
    mrp: 175.0,
  },
];

const initialPurchaseData: PurchaseRateEntry[] = [
  {
    id: 1,
    rateListName: "Standard Purchase Rate",
    effectiveFrom: "2023-12-01",
    rate: 100.0,
    mrp: 120.0,
    minPrice: 95.0,
    discount: "5%",
  },
  {
    id: 2,
    rateListName: "Bulk Vendor Rate A",
    effectiveFrom: "2024-06-01",
    rate: 98.0,
    mrp: 118.0,
    minPrice: 93.0,
    discount: "7%",
  },
];

const availableItems: ItemOption[] = [
  { label: "Product A - SKU101", value: "sku101" },
  { label: "Product B - SKU102", value: "sku102" },
  { label: "Product C - SKU103", value: "sku103" },
];

// Define headers and their corresponding data keys
const salesHeadersMap: HeaderMap[] = [
  { label: "SNo", key: "id", editable: false, isPrice: false },
  {
    label: "Rate List Name",
    key: "rateListName",
    editable: false,
    isPrice: false,
  },
  {
    label: "Effective From",
    key: "effectiveFrom",
    editable: false,
    isPrice: false,
  },
  { label: "Rate", key: "rate", editable: true, isPrice: true },
  { label: "Dealer Rate", key: "dealerRate", editable: true, isPrice: true },
  {
    label: "Wholesale Rate",
    key: "wholesaleRate",
    editable: true,
    isPrice: true,
  },
  { label: "MRP", key: "mrp", editable: true, isPrice: true },
];

const purchaseHeadersMap: HeaderMap[] = [
  { label: "SNo", key: "id", editable: false, isPrice: false },
  {
    label: "Rate List Name",
    key: "rateListName",
    editable: false,
    isPrice: false,
  },
  {
    label: "Effective From",
    key: "effectiveFrom",
    editable: false,
    isPrice: false,
  },
  { label: "Rate", key: "rate", editable: true, isPrice: true },
  { label: "MRP", key: "mrp", editable: true, isPrice: true },
  { label: "Min. Price", key: "minPrice", editable: true, isPrice: true },
  { label: "Discount", key: "discount", editable: false, isPrice: false },
];

const RateListTable: React.FC<RateListTableProps> = ({
  title,
  headersMap,
  data,
  isEditing,
  onRateChange,
}) => {
  const tableColor = "bg-[#0c5888]";
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerCaseSearch = searchTerm.toLowerCase();

    return data.filter((row) => {
      return Object.values(row).some((value) => {
        if (typeof value === "string" || typeof value === "number") {
          return String(value).toLowerCase().includes(lowerCaseSearch);
        }
        return false;
      });
    });
  }, [data, searchTerm]);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2 border-gray-300 dark:border-gray-700">
        {title}
      </h3>
      <div className="mb-4 flex justify-end">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search rates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 text-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto shadow-xl rounded-lg border dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={tableColor}>
            <tr>
              {headersMap.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((row, index) => {
                const originalIndex = data.findIndex((d) => d.id === row.id);

                return (
                  <tr
                    key={row.id || index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-100"
                  >
                    {headersMap.map((header, colIndex) => {
                      const key = header.key as keyof RateEntry;
                      const value = row[key];
                      const isEditable = isEditing && header.editable;

                      const displayValue = header.isPrice
                        ? typeof value === "number"
                          ? value.toFixed(2)
                          : value
                        : value;

                      return (
                        <td
                          key={colIndex}
                          className={`px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300 ${
                            header.isPrice
                              ? "text-right"
                              : "text-left text-gray-900 dark:text-gray-200"
                          }`}
                        >
                          {isEditable ? (
                            <input
                              type="number"
                              step="0.01"
                              value={
                                typeof value === "number"
                                  ? value
                                  : value === ""
                                  ? ""
                                  : parseFloat(String(value)) || "" // Handle non-numeric strings
                              }
                              onChange={(e) => {
                                const numValue = parseFloat(e.target.value);
                                const rawValue = e.target.value;

                                if (originalIndex !== -1) {
                                  // Pass raw value if it's an empty string, otherwise pass the number
                                  onRateChange(
                                    originalIndex,
                                    key,
                                    rawValue === "" ? 0 : numValue
                                  );
                                }
                              }}
                              className="w-24 p-1 border rounded-md text-right bg-blue-50 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <span
                              className={`${
                                header.isPrice ? "font-mono w-full block" : ""
                              }`}
                            >
                              {header.isPrice && typeof value === "number"
                                ? `$${value.toFixed(2)}`
                                : value}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={headersMap.length}
                  className="text-center py-12 text-lg text-gray-500 dark:text-gray-400"
                >
                  {searchTerm
                    ? `No results found for "${searchTerm}".`
                    : "No rate list data found for the selected item."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const UpdateListForEachItems: React.FC = () => {
  const [db, setDb] = useState<Firestore | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>(
    availableItems[0]?.value || ""
  );
  const [salesRates, setSalesRates] =
    useState<SalesRateEntry[]>(initialSalesData);
  const [purchaseRates, setPurchaseRates] =
    useState<PurchaseRateEntry[]>(initialPurchaseData);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [isDbInitialized, setIsDbInitialized] = useState<boolean>(false);

  const actionButtonColor = "bg-[#0c5888]";

  // 1. Firebase Initialization and Authentication
  useEffect(() => {
    try {
      const app: FirebaseApp = initializeApp(firebaseConfig);
      const auth: Auth = getAuth(app);
      const firestore: Firestore = getFirestore(app);
      setDb(firestore);
      setIsDbInitialized(true);

      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          try {
            if (initialAuthToken) {
              await signInWithCustomToken(auth, initialAuthToken);
            } else {
              await signInAnonymously(auth);
            }
          } catch (e) {
            console.error("Authentication Error:", e);
          }
        }
        setUserId(auth.currentUser?.uid || crypto.randomUUID());
        setIsAuthReady(true);
      });
    } catch (e) {
      console.error("Error initializing Firebase:", e);
      setIsDbInitialized(false);
      setIsAuthReady(true);
      setIsLoading(false);
      setMessage({
        text: "Firebase initialization failed. Cannot save changes.",
        type: "error",
      });
    }
  }, []);

  // 2. Seeding Logic (Used when a document doesn't exist)
  const seedItemData = useCallback(
    async (firestore: Firestore, currentUserId: string, itemSku: string) => {
      if (!firestore || !currentUserId || !itemSku || !isDbInitialized) return;
      const docRef = doc(
        firestore,
        "artifacts",
        appId,
        "users",
        currentUserId,
        "rateLists",
        itemSku
      );

      try {
        await setDoc(
          docRef,
          {
            salesRates: initialSalesData,
            purchaseRates: initialPurchaseData,
            lastUpdated: new Date().toISOString(),
          },
          { merge: true }
        );
        console.log(`Data seeded for ${itemSku}`);
        return true;
      } catch (e) {
        console.error("Error seeding data:", e);
        return false;
      }
    },
    [isDbInitialized]
  );

  // 3. Firestore Data Subscription (onSnapshot)
  useEffect(() => {
    if (!db || !isAuthReady || !userId || !selectedItem || !isDbInitialized) {
      if (isAuthReady && !isDbInitialized) setIsLoading(false);
      return;
    }

    const docRef = doc(
      db,
      "artifacts",
      appId,
      "users",
      userId,
      "rateLists",
      selectedItem
    );

    setIsLoading(true);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSalesRates(
            (data.salesRates as SalesRateEntry[]) || initialSalesData
          );
          setPurchaseRates(
            (data.purchaseRates as PurchaseRateEntry[]) || initialPurchaseData
          );
          setMessage({
            text: `Rates loaded for ${selectedItem}.`,
            type: "info",
          });
        } else {
          // If document doesn't exist, create it with initial data
          seedItemData(db, userId, selectedItem);
          setSalesRates(initialSalesData);
          setPurchaseRates(initialPurchaseData);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Firestore onSnapshot error:", error);
        setIsLoading(false);
        setMessage({
          text: "Failed to load rates. Check console for details.",
          type: "error",
        });
      }
    );

    return () => unsubscribe();
  }, [db, isAuthReady, userId, selectedItem, seedItemData, isDbInitialized]);

  // 4. Rate Change Handler
  const handleRateChange = useCallback(
    (
      rateType: "sales" | "purchase",
      rowIndex: number,
      key: string,
      value: number
    ) => {
      const setState = rateType === "sales" ? setSalesRates : setPurchaseRates;

      setState((prevRates: any) => {
        // Find the rate entry corresponding to the row index
        const newRates = [...prevRates];
        // Note: rowIndex here is the index in the *current* state array,
        // which matches the index passed from the table (since we don't paginate/sort here).
        if (newRates[rowIndex]) {
          newRates[rowIndex] = { ...newRates[rowIndex], [key]: value };
        }
        return newRates;
      });
    },
    []
  );

  const handleSalesRateChange = useCallback(
    (rowIndex: number, key: string, value: number) => {
      handleRateChange("sales", rowIndex, key, value);
    },
    [handleRateChange]
  );

  const handlePurchaseRateChange = useCallback(
    (rowIndex: number, key: string, value: number) => {
      handleRateChange("purchase", rowIndex, key, value);
    },
    [handleRateChange]
  );

  // 5. Save Button Handler
  const handleSaveRates = async () => {
    if (!db || !userId || !selectedItem || !isDbInitialized) {
      setMessage({
        text: "Database not connected. Changes cannot be saved.",
        type: "error",
      });
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setMessage({ text: "Saving changes...", type: "info" });

    const docRef = doc(
      db,
      "artifacts",
      appId,
      "users",
      userId,
      "rateLists",
      selectedItem
    );

    try {
      await setDoc(
        docRef,
        {
          salesRates: salesRates,
          purchaseRates: purchaseRates,
          lastUpdated: new Date().toISOString(),
        },
        { merge: true }
      );

      setIsEditing(false);
      setMessage({ text: "Rates updated successfully!", type: "success" });
    } catch (e) {
      console.error("Error saving rates:", e);
      setMessage({ text: "Failed to save rates.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return <></>;
};

export default UpdateListForEachItems;
