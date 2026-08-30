// Replaced by environment.prod.ts on a production build (angular.json -> fileReplacements).
// Both files point at the live API on purpose, so no build path can ship a localhost URL.

export const environment = {
  production: true,
  // The API is hosted on the .shop domain; .com serves the Angular storefront.
  // LOCAL DEV (active): point at the local API via IIS Express (VS F5).
  // apiURL: 'http://localhost:7892/api/',
  // Live API (commented out for local dev — restore before committing/deploying):
  apiURL: 'https://shlokaayurveda.shop/api/',
  recaptcha: {
    siteKey: '6LdfMCQhAAAAAB8W9xcG3yI-LgiXnDVWITsGJ2aa'
  },
  // Online payment (Razorpay) is temporarily switched off — checkout shows COD only.
  // Flip this back to true to bring the "Pay Online" option back.
  paymentEnabled: true,
};
