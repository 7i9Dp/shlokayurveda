// The file a production build compiles against.

export const environment = {
  production: false,
  // The API is hosted on the .shop domain; .com serves the Angular storefront.
  apiURL: 'https://shlokaayurveda.shop/api/',
  recaptcha: {
    siteKey: '6LdfMCQhAAAAAB8W9xcG3yI-LgiXnDVWITsGJ2aa'
  },
  // Online payment (Razorpay) is temporarily switched off — checkout shows COD only.
  // Flip this back to true to bring the "Pay Online" option back.
  paymentEnabled: false,
};
