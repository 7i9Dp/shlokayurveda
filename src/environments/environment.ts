// Replaced by environment.prod.ts on a production build (angular.json -> fileReplacements).
// Both files point at the LIVE API so no build path can accidentally ship a localhost URL.

export const environment = {
  production: true,
  // The API is hosted on the .shop domain; .com serves the Angular storefront.
  apiURL: 'https://api.shlokayurveda.com/api/',
  // Local API (swap the comment markers to test against a locally running API):
  // apiURL: 'http://localhost:7892/api/',
  recaptcha: {
    siteKey: '6LdfMCQhAAAAAB8W9xcG3yI-LgiXnDVWITsGJ2aa'
  },
  // Online payment (Razorpay) is LIVE. Set to false to fall back to COD-only
  // checkout without a code change — the fastest rollback if the gateway misbehaves.
  paymentEnabled: true,
};
