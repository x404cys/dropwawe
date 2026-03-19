import dotenv from 'dotenv';
dotenv.config();

export const PAYTABS_SERVER_KEY = 'S2J9R66GMT-JJ6GGGG62G-KKJ6KRBKDB';

export const PAYTABS_PROFILE_ID = 144504;

// export const PAYTABS_SERVER_KEY = 'SRJ9DJHRHK-JM2BWN9BZ2-ZHN9G2WRHJ';
// export const PAYTABS_PROFILE_ID = 169218;
export const PAYTABS_ENDPOINT = 'https://secure-iraq.paytabs.com/payment/request';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.matager.store';
export const MATAGER_DASHBOARD_URL = 'https://dashboard.matager.store';

export const PAYTABS_CURRENCY = 'IQD';
