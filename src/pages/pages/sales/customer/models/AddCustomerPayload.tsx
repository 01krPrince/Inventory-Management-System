// 1. Interface Definition (was in ../models/AddCustomerPayload)
export interface CustomerPayload {
  gst_no: string;
  cust_name: string;
  print_name: string;
  identification: string;
  code: string;
  under_ledger: string;
  cust_comman: boolean;
  is_sub_customer: boolean;
  under_customer: boolean | string;
  profile_photo: string | null;

  // Statutory
  gst: string;
  registration_date: string;
  cin: string;
  pan: string;
  goods_service: string;
  gst_category: string;
  gst_suspend: boolean;
  distance: number;
  tds_on_gst_applicable: boolean;

  // Billing Address
  address: string;
  country: string;
  state: string;
  city: string;
  pin_code: string;
  phone: string;
  email: string;
  longitude: string;
  latitude: string;
  route_map: string;

  // Shipping Address
  address_ship: string;
  country_ship: string;
  state_ship: string;
  city_ship: string;
  pin_code_ship: string;
  phone_ship: string;
  email_ship: string;
  longitude_ship: string;
  latitude_ship: string;
  route_map_ship: string;

  // Social
  website: string;
  facebook: string;
  skype: string;
  twitter: string;
  linkedin: string;

  // Defaults
  payment_term: string;
  price_category: string;
  batch_rate_category: string;
  sales_executive: string;
  transporter: string;
  credit_limit: string;
  max_credit_days: string;
  interest_rate_yearly: string;
  customer_on_watch: string;
  firm_status: string;
  territory: string;
  customer_category: string;
  contact_person: string;

  // Bank
  ifsc_code: string;
  account_number: string;
  bank_name: string;
  branch: string;

  attachment: string | null;
}
