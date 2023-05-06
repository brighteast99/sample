import http from "./http-common.js";
const base = "/problems";

class problemDataService {
  // Create a new problem
  create(data) {
    return http.post(base, data);
  }

  // Retrieve all problems
  getAll() {
    return http.get(base);
  }

  /**
   * * Retrieve a problem with specific _id
   *
   * @param _id _id of the problem to retrieve
   */
  get(_id) {
    const queryString = `/?_id=${_id ?? ""}`;
    return http.get(base + queryString);
  }

  /**
   * * Sample some number of problems from the entire problem set
   *
   * @param count sample size
   */
  sample(count) {
    const queryString = `/?count=${count ?? ""}`;
    return http.get(base + queryString);
  }

  /**
   * * Delete a problem with specific _id
   *
   * @param _id _id of the problem to delete
   */
  delete(_id) {
    return http.delete(`${base}/${_id}`);
  }
}

export default new problemDataService();
