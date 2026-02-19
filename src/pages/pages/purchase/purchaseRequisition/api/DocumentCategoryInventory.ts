import api from "../../../../../services/api";

// ==========================================
// 1. Interfaces
// ==========================================

// The object as it comes FROM the database (MongoDB usually sends _id)
export interface DocumentCategoryInventory {
  _id: string; 
  name: string;
  inactive: boolean;
  specificToDocument: string; 
  defaultLocation: string;    
  code: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// The object we send TO the database
export interface DocumentCategoryInventoryInput {
  name: string;
  inactive: boolean;
  specificToDocument: string;
  defaultLocation: string;
  code: string; 
}

export interface GetDocumentCategoryInventoryResponse {
  success: boolean;
  data: DocumentCategoryInventory[];
}

export interface CreateDocumentCategoryInventoryResponse {
  success: boolean;
  message: string;
  data: DocumentCategoryInventory;
}

// ==========================================
// 2. API Functions
// ==========================================

/**
 * Fetch all Document Category Inventory items
 */
export const fetchDocumentCategoryInventory = async (): Promise<DocumentCategoryInventory[]> => {
  try {
    const response = await api.get<GetDocumentCategoryInventoryResponse>(''); // /documentcategoryinventory/getall
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching Document Category Inventory:", error);
    return [];
  }
};

/**
 * Create a new Document Category Inventory item
 */
export const createDocumentCategoryInventory = async (
  formData: DocumentCategoryInventoryInput
): Promise<CreateDocumentCategoryInventoryResponse | null> => {
  try {
    const response = await api.post<CreateDocumentCategoryInventoryResponse>(
      '', // /documentcategoryinventory/create
      formData
    );
    
    if (response.data?.message) {
        console.log("Success:", response.data.message);
    }
    
    return response.data;
  } catch (error) {
    console.error("Error creating Document Category Inventory:", error);
    throw error;
  }
};

/**
 * Update an existing Document Category Inventory item by ID
 * Method: PUT
 * URL Example: /documentcategoryinventory/updatebyid/693686227c2128eec96c8a62
 */
export const updateDocumentCategoryInventory = async (
  id: string,
  formData: Partial<DocumentCategoryInventoryInput>
): Promise<CreateDocumentCategoryInventoryResponse | null> => {
  try {
    const response = await api.put<CreateDocumentCategoryInventoryResponse>(
      `/${id}`, // /documentcategoryinventory/updatebyid/${id}
      formData
    );
    
    if (response.data?.message) {
        console.log("Success:", response.data.message);
    }

    return response.data;
  } catch (error) {
    console.error(`Error updating Document Category Inventory (ID: ${id}):`, error);
    throw error;
  }
};

/**
 * Delete Document Category Inventory item
 */
export const deleteDocumentCategoryInventory = async (id: string): Promise<boolean> => {
    try {
        await api.delete(`/${id}`); // /documentcategoryinventory/deletebyid/${id}
        return true;
    } catch (error) {
        console.error("Error deleting item:", error);
        throw error;
    }
};


