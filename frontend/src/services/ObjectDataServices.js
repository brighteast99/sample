import http from "./http-common.js";
const base = "/objects";

class objectDataService {
  // Create a new object
  create(data) {
    return http.post(base, data);
  }

  // Retrieve all objects
  getAll() {
    return http.get(base);
  }

  /**
   * * Check if an object with specific name exists
   *
   * @param name name to check existance
   */
  async exists(name) {
    let result = false;
    await http
      .get(`${base}/?name=${name}`, name)
      .then((response) => (result = response.data.length > 0))
      .catch((err) => console.error(err));

    return result;
  }

  /**
   * * Delete an object with specific _id
   *
   * @param _id _id of the object to delete
   */
  delete(_id) {
    return http.delete(`${base}/${_id}`);
  }
}

export default new objectDataService();
