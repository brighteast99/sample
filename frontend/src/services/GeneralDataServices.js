import http from "./http-common.js";

class generalDataService {
  uuidRequest() {
    return http.get("/uuid");
  }
}

export default new generalDataService();
