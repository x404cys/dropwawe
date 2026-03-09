import dotenv from 'dotenv';
dotenv.config();

export const PAYTABS_SERVER_KEY = 'SRJ9DJHRHK-JM2BWN9BZ2-ZHN9G2WRHJ'; // Note: from hardcoded implementation
export const PAYTABS_PROFILE_ID = 169218;
export const PAYTABS_ENDPOINT = 'https://secure-iraq.paytabs.com/payment/request';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.matager.store';
export const MATAGER_DASHBOARD_URL = 'https://dashboard.matager.store';

export const PAYTABS_CURRENCY = 'IQD';
