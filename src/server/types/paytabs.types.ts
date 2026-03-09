export interface PayTabsItemInput {
  productId: string;
  quantity: number;
  price: number;
  selectedColor: string;
  selectedSize: string;
}

export interface PayTabsCustomerDetails {
  email: string;
  city: string;
  country: string;
}

export interface PayTabsPayload {
  profile_id: number;
  tran_type: string;
  tran_class: string;
  cart_id: string;
  cart_description: string;
  cart_currency: string;
  cart_amount: number;
  callback: string;
  return: string;
  customer_details?: PayTabsCustomerDetails;
}

export interface PayTabsResponse {
  tran_ref?: string;
  redirect_url?: string;
  message?: string;
}

export interface PayTabsCallbackData {
  cartId: string;
  tranRef: string;
  respStatus: string;
  respMessage: string;
  customerEmail?: string;
  signature?: string;
  token?: string;
}
