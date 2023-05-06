let VueCookies = require("vue-cookies");
let GeneralDataService = require("@/services/GeneralDataServices").default;
let cookieData = require("@/modules/enums").cookieData;

/**
 * * Get new uuid from the server and save it to the browser cookie
 */
exports.init = () => {
  GeneralDataService.uuidRequest().then((result) => {
    if (!VueCookies.isKey(cookieData.uuid))
      VueCookies.set(cookieData.uuid, result.data);
  });
};

/**
 * * Replace current uuid with new one
 */
exports.refresh = () => {
  GeneralDataService.uuidRequest().then((result) =>
    VueCookies.set(cookieData.uuid, result.data)
  );
};
