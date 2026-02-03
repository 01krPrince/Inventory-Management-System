import api from '../../../../../services/api';

// --- Interfaces ---

export interface ItemBalance {
  code: string;
  name: string;
  barcode: string;
  balance: number;
  last_sales_rate: number;
  group: string;
  brand: string;
  category: string;
  hsn_code: string;
  unit: string;
}

export interface ItemBalanceResponse {
  success: boolean;
  total: number;
  data: ItemBalance[];
}

const itemBalanceService = {
  
  getBalanceByStore: async (storeCode: string): Promise<ItemBalanceResponse> => {
    const response = await api.get<ItemBalanceResponse>(
      '/itembalance/balance-by-store',
      {
        params: { storeCode }, 
      }
    );
    return response.data;
  },
};

export default itemBalanceService;