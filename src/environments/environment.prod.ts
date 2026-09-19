// The file a production build compiles against.

export const environment = {
  production: true,
  // The API is hosted on the .shop domain; .com serves the Angular storefront.
  apiURL: 'https://api.shlokayurveda.com/api/',
  recaptcha: {
    siteKey: '6LdfMCQhAAAAAB8W9xcG3yI-LgiXnDVWITsGJ2aa'
  },
  // Online payment (Razorpay) is LIVE. Set to false to fall back to COD-only
  // checkout without a code change — the fastest rollback if the gateway misbehaves.
  paymentEnabled: true,
};
