// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  //apiURL: 'http://localhost:7892/api/',
  apiURL: 'https://shlokayurveda.xyz/api/',
  //fileURL:'http://localhost:7892/',
  recaptcha: {
    siteKey: '6LdfMCQhAAAAAB8W9xcG3yI-LgiXnDVWITsGJ2aa'
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
