import React, {
  useState,
  createContext,
  useContext,
  useMemo,
  ReactNode,
} from "react";

/** * ==================================================================================
 * 1. CONFIGURATION: THE PERMISSION MATRIX (STATIC DATA)
 * ==================================================================================
 * This is your source of truth. Add modules here, and the UI will auto-generate.
 */
interface PermissionNode {
  id: string;
  label: string;
  description?: string;
  children?: PermissionNode[];
}

const PERMISSION_TREE: PermissionNode[] = [
  {
    id: "module.sales",
    label: "Sales Module",
    children: [
      { id: "sales.view", label: "View Sales Dashboard" },
      { id: "sales.create", label: "Create Invoice" },
      {
        id: "sales.actions",
        label: "Invoice Actions",
        children: [
          { id: "sales.edit", label: "Edit Invoice" },
          { id: "sales.delete", label: "Delete Invoice" },
          { id: "sales.approve", label: "Approve Invoice" },
        ],
      },
    ],
  },
  {
    id: "module.inventory",
    label: "Inventory Module",
    children: [
      { id: "inv.view", label: "View Stock Grid" },
      { id: "inv.price.view", label: "View Buying Price" },
      {
        id: "inv.item",
        label: "Item Management",
        children: [
          { id: "inv.item.create", label: "Create Item" },
          { id: "inv.item.edit", label: "Edit Item Details" },
          { id: "inv.item.stock", label: "Manual Stock Adjustment" },
        ],
      },
    ],
  },
  {
    id: "module.admin",
    label: "System Admin",
    children: [
      { id: "admin.users", label: "Manage Users" },
      { id: "admin.roles", label: "Manage Roles" },
    ],
  },
];

// Mock Roles Data
const INITIAL_ROLES = [
  {
    id: "role_admin",
    name: "Super Admin",
    permissions: [
      "module.sales",
      "sales.view",
      "sales.create",
      "sales.actions",
      "sales.edit",
      "sales.delete",
      "sales.approve",
      "module.inventory",
      "inv.view",
      "inv.price.view",
      "inv.item",
      "inv.item.create",
      "inv.item.edit",
      "inv.item.stock",
      "module.admin",
      "admin.users",
      "admin.roles",
    ],
  },
  {
    id: "role_manager",
    name: "Store Manager",
    permissions: [
      "module.sales",
      "sales.view",
      "sales.create",
      "sales.actions",
      "sales.edit",
      "sales.approve",
      "module.inventory",
      "inv.view",
      "inv.price.view",
      "inv.item",
      "inv.item.edit",
      "inv.item.stock",
    ],
  },
  {
    id: "role_cashier",
    name: "Cashier",
    permissions: [
      "module.sales",
      "sales.view",
      "sales.create",
      "module.inventory",
      "inv.view",
    ],
  },
];

/** * ==================================================================================
 * 2. CORE LOGIC ENGINE (CONTEXT API)
 * ==================================================================================
 */

interface RBACContextType {
  roleName: string;
  permissions: Set<string>;
  check: (requiredPerm: string) => boolean;
  switchRole: (roleId: string) => void;
  updateRolePermissions: (roleId: string, newPerms: string[]) => void;
  roles: typeof INITIAL_ROLES;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

// Helper to flatten tree for lookups
const getAllIds = (nodes: PermissionNode[]): string[] => {
  let ids: string[] = [];
  nodes.forEach((n) => {
    ids.push(n.id);
    if (n.children) ids = [...ids, ...getAllIds(n.children)];
  });
  return ids;
};

/** * ==================================================================================
 * 3. COMPONENT: PERMISSION GATE (THE GUARD)
 * ==================================================================================
 * Usage 1 (Hide): <PermissionGate allow="sales.edit"><Button>Edit</Button></PermissionGate>
 * Usage 2 (Disable): <PermissionGate allow="sales.edit" renderDisabled>{(allowed) => <Button disabled={!allowed}>Edit</Button>}</PermissionGate>
 */
interface GateProps {
  allow: string;
  children: ReactNode | ((allowed: boolean) => ReactNode);
  fallback?: ReactNode; // What to show if access denied (default null)
  renderDisabled?: boolean; // If true, renders children but passes 'false' to callback
}

const PermissionGate: React.FC<GateProps> = ({
  allow,
  children,
  fallback = null,
  renderDisabled = false,
}) => {
  const { check } = useContext(RBACContext)!;
  const isAllowed = check(allow);

  if (renderDisabled && typeof children === "function") {
    return <>{children(isAllowed)}</>;
  }

  if (isAllowed) {
    return <>{typeof children === "function" ? children(true) : children}</>;
  }

  return <>{fallback}</>;
};

/** * ==================================================================================
 * 4. UI COMPONENT: RECURSIVE CHECKBOX TREE (FOR ROLE EDITOR)
 * ==================================================================================
 */
const PermissionTreeItem: React.FC<{
  node: PermissionNode;
  selected: Set<string>;
  onToggle: (ids: string[], added: boolean) => void;
  depth?: number;
}> = ({ node, selected, onToggle, depth = 0 }) => {
  const childIds = useMemo(
    () => (node.children ? getAllIds(node.children) : []),
    [node]
  );
  const allRelatedIds = [node.id, ...childIds];

  const isChecked = selected.has(node.id);
  const isIndeterminate = !isChecked && childIds.some((id) => selected.has(id));

  return (
    <div
      className={`select-none ${
        depth > 0 ? "ml-6 border-l border-gray-200 pl-3" : "mb-2"
      }`}
    >
      <div
        className={`flex items-center group py-1 rounded cursor-pointer ${
          isChecked ? "bg-blue-50" : "hover:bg-gray-50"
        }`}
        onClick={() => onToggle(allRelatedIds, !isChecked)}
      >
        <div
          className={`relative flex items-center justify-center w-4 h-4 mr-2 border rounded ${
            isChecked
              ? "bg-blue-600 border-blue-600"
              : "border-gray-400 bg-white"
          }`}
        >
          {isChecked && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          {isIndeterminate && (
            <div className="w-2 h-2 bg-blue-600 rounded-sm" />
          )}
        </div>
        <div>
          <span
            className={`text-sm ${
              isChecked ? "font-semibold text-blue-800" : "text-gray-700"
            }`}
          >
            {node.label}
          </span>
          <span className="ml-2 text-[10px] text-gray-400 font-mono hidden group-hover:inline">
            {node.id}
          </span>
        </div>
      </div>
      {node.children && (
        <div className="mt-1">
          {node.children.map((child) => (
            <PermissionTreeItem
              key={child.id}
              node={child}
              selected={selected}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/** * ==================================================================================
 * 5. COMPLEX NESTED UI DEMO (THE ERP APP)
 * ==================================================================================
 */

// Level 3: The Deepest Popup (Stock Adjustment)
const StockAdjustModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-80 border-2 border-blue-600">
        <h4 className="font-bold text-lg mb-2 text-blue-800">Adjust Stock</h4>
        <p className="text-xs text-gray-500 mb-4">
          Update physical inventory count.
        </p>

        <div className="space-y-3">
          <input
            type="number"
            placeholder="New Quantity"
            className="w-full border p-2 rounded text-sm"
          />
          <textarea
            placeholder="Reason for adjustment"
            className="w-full border p-2 rounded text-sm h-20"
          ></textarea>

          <PermissionGate
            allow="inv.item.stock"
            fallback={
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 py-2 rounded text-sm cursor-not-allowed"
              >
                Permission Denied
              </button>
            }
          >
            <button
              onClick={() => {
                alert("Stock Adjusted!");
                onClose();
              }}
              className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
            >
              Confirm Adjustment
            </button>
          </PermissionGate>
        </div>
        <button
          onClick={onClose}
          className="mt-3 text-xs text-gray-500 hover:text-red-500 w-full text-center"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Level 2: Item Detail Modal
const ItemDetailModal = ({ onClose }: { onClose: () => void }) => {
  const [showStockAdjust, setShowStockAdjust] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-[500px] overflow-hidden">
        <div className="bg-gray-100 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Edit Item: INV-001</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Granular Field Control: Name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">
              Item Name
            </label>
            <PermissionGate allow="inv.item.edit" renderDisabled>
              {(allowed) => (
                <input
                  defaultValue="Wireless Mechanical Keyboard"
                  disabled={!allowed}
                  className={`w-full border rounded p-2 text-sm ${
                    !allowed ? "bg-gray-100 text-gray-400" : "bg-white"
                  }`}
                />
              )}
            </PermissionGate>
          </div>

          {/* Granular Field Control: Buying Price (Sensitive) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                Selling Price
              </label>
              <input
                defaultValue="$120.00"
                className="w-full border rounded p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                Buying Price (Restricted)
              </label>
              <PermissionGate
                allow="inv.price.view"
                fallback={
                  <div className="w-full bg-stripes-gray border rounded p-2 text-sm text-gray-400 italic">
                    Hidden
                  </div>
                }
              >
                <input
                  defaultValue="$85.00"
                  className="w-full border rounded p-2 text-sm bg-yellow-50 text-yellow-800 border-yellow-200"
                />
              </PermissionGate>
            </div>
          </div>

          {/* Action Bar */}
          <div className="border-t pt-4 mt-2 flex justify-between items-center">
            {/* Button that triggers Level 3 Popup */}
            <PermissionGate
              allow="inv.item.stock"
              fallback={
                <span className="text-xs text-red-400 flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>{" "}
                  Stock Adjust Locked
                </span>
              }
            >
              <button
                onClick={() => setShowStockAdjust(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                Adjust Stock Level
              </button>
            </PermissionGate>

            <PermissionGate allow="inv.item.edit">
              <button className="px-4 py-2 bg-black text-white rounded text-sm hover:bg-gray-800">
                Save Changes
              </button>
            </PermissionGate>
          </div>
        </div>
      </div>

      {showStockAdjust && (
        <StockAdjustModal onClose={() => setShowStockAdjust(false)} />
      )}
    </div>
  );
};

// Level 1: The Dashboard Grid
const ERPDashboard = () => {
  const [showItemModal, setShowItemModal] = useState(false);

  return (
    <div className="flex-1 bg-gray-50 p-8 overflow-hidden flex flex-col relative">
      <PermissionGate
        allow="inv.view"
        fallback={
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p>You do not have permission to view Inventory.</p>
          </div>
        }
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Inventory Management
          </h1>
          <PermissionGate
            allow="inv.item.create"
            fallback={
              <button
                disabled
                className="opacity-50 cursor-not-allowed bg-gray-300 text-white px-4 py-2 rounded"
              >
                Create Disabled
              </button>
            }
          >
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-lg transition-transform active:scale-95">
              + Create New Item
            </button>
          </PermissionGate>
        </div>

        {/* Data Grid */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 border-b">
              <tr>
                <th className="p-4">Item Name</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-blue-50/50 group">
                <td className="p-4 font-medium">
                  Wireless Mechanical Keyboard
                </td>
                <td className="p-4 text-gray-500">INV-001</td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    In Stock (45)
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setShowItemModal(true)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 bg-blue-50 px-3 py-1 rounded"
                  >
                    Manage
                  </button>
                </td>
              </tr>
              {/* Fake rows */}
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b hover:bg-gray-50 text-gray-400">
                  <td className="p-4">Demo Item #{i}</td>
                  <td className="p-4">---</td>
                  <td className="p-4">---</td>
                  <td className="p-4 text-right">
                    <span className="text-xs">View Only</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Floating Helper for Demo */}
        <div className="absolute bottom-6 right-6 max-w-sm bg-yellow-50 border border-yellow-200 p-4 rounded text-xs text-yellow-800 shadow-lg">
          <strong>Try this:</strong>
          <ul className="list-disc pl-4 mt-1 space-y-1">
            <li>
              Uncheck <code>inv.view</code> on left → Whole page vanishes.
            </li>
            <li>
              Uncheck <code>inv.price.view</code> → "Buying Price" inside modal
              becomes hidden.
            </li>
            <li>
              Uncheck <code>inv.item.stock</code> → "Adjust Stock" button locks.
            </li>
          </ul>
        </div>
      </PermissionGate>

      {showItemModal && (
        <ItemDetailModal onClose={() => setShowItemModal(false)} />
      )}
    </div>
  );
};

/** * ==================================================================================
 * 6. MAIN LAYOUT & CONTROLLER
 * ==================================================================================
 */
const MainAccess = () => {
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [currentRoleId, setCurrentRoleId] = useState("role_admin");

  const activeRole = roles.find((r) => r.id === currentRoleId)!;
  const activePermissions = new Set(activeRole.permissions);

  const updateRolePermissions = (roleId: string, newPerms: string[]) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, permissions: newPerms } : r))
    );
  };

  const handleTogglePermission = (ids: string[], added: boolean) => {
    const current = new Set(activeRole.permissions);
    ids.forEach((id) => (added ? current.add(id) : current.delete(id)));
    updateRolePermissions(currentRoleId, Array.from(current));
  };

  const contextValue: RBACContextType = {
    roleName: activeRole.name,
    permissions: activePermissions,
    check: (id) => activePermissions.has(id),
    switchRole: setCurrentRoleId,
    updateRolePermissions,
    roles,
  };

  return (
    <RBACContext.Provider value={contextValue}>
      <div className="flex h-screen w-full bg-white font-sans text-gray-900 overflow-hidden">
        {/* LEFT SIDEBAR: ROLE CONFIGURATOR */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col z-20 shadow-xl">
          <div className="p-5 bg-gray-900 text-white">
            <h2 className="text-lg font-bold flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Role Manager
            </h2>
            <div className="mt-4">
              <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                Select Role to Edit
              </label>
              <select
                value={currentRoleId}
                onChange={(e) => setCurrentRoleId(e.target.value)}
                className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:ring-2 focus:ring-blue-500"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase">
                Permissions
              </span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {activePermissions.size} Active
              </span>
            </div>

            {PERMISSION_TREE.map((node) => (
              <PermissionTreeItem
                key={node.id}
                node={node}
                selected={activePermissions}
                onToggle={handleTogglePermission}
              />
            ))}
          </div>

          <div className="p-4 border-t bg-gray-50 text-xs text-gray-500">
            Current ID:{" "}
            <span className="font-mono text-gray-800">{currentRoleId}</span>
          </div>
        </div>

        {/* RIGHT AREA: THE APPLICATION */}
        <ERPDashboard />
      </div>

      {/* CSS for Stripes (Optional Helper) */}
      <style>{`
        .bg-stripes-gray {
          background-image: linear-gradient(135deg, #f3f4f6 25%, #e5e7eb 25%, #e5e7eb 50%, #f3f4f6 50%, #f3f4f6 75%, #e5e7eb 75%, #e5e7eb 100%);
          background-size: 20px 20px;
        }
      `}</style>
    </RBACContext.Provider>
  );
};

export default MainAccess;
