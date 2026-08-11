// Replaced by environment.prod.ts on a production build (angular.json -> fileReplacements).
// Both files point at the live API on purpose, so no build path can ship a localhost URL.

export const environment = {
  production: true,
  // The API is hosted on the .shop domain; .com serves the Angular storefront.
  // Swap these two lines to work against a local API — don't commit it that way.
  apiURL: 'https://shlokaayurveda.shop/api/',
  // apiURL: 'http://localhost:7892/api/',
  recaptcha: {
    siteKey: '6LdfMCQhAAAAAB8W9xcG3yI-LgiXnDVWITsGJ2aa'
  },
  // Online payment (Razorpay) is temporarily switched off — checkout shows COD only.
  // Flip this back to true to bring the "Pay Online" option back.
  paymentEnabled: false,
};
