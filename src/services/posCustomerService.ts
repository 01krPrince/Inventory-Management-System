import api from "./api";

export interface PosCustomer {
  _id: string;
  cust_name: string;
  print_name: string;
  code: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  email: string;
  pin: string;
  gst_category: string;
  firm_status: string;
  isactive: boolean;
  createdAt: string;
}

export interface CustomerResponse {
  success: boolean;
  total: number;
  data: PosCustomer[];
}

class PosCustomerService {
  static async getAllCustomers(): Promise<CustomerResponse> {
    const response = await api.get<CustomerResponse>(
      "/poscustomermaster/getall"
    );
    return response.data;
  }
}

export default PosCustomerService;
