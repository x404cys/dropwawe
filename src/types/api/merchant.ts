export interface MerchantLoginResponse {
  status: boolean;
  data?: {
    token: string;
  };
  msg?: string;
}
