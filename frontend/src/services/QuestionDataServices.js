import http from "./http-common.js";
const base = "/questions";

class questionDataService {
  // Create a new question
  create(data) {
    return http.post(base, data);
  }

  // Retrieve all questions
  getAll() {
    return http.get(base);
  }

  /**
   * * Retrieve a question with specific _id
   *
   * @param _id _id of the question to retrieve
   */
  get(_id) {
    const queryString = `/?_id=${_id ?? ""}`;
    return http.get(base + queryString);
  }

  /**
   * * Delete a question with specific _id
   *
   * @param _id _id of the question to delete
   */
  delete(_id) {
    return http.delete(`${base}/${_id}`);
  }
}

export default new questionDataService();
