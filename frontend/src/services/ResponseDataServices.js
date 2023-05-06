import http from "./http-common.js";
const base = "/responses";

class responseDataService {
  // Create a new resonse
  create(data) {
    return http.post(base, data);
  }

  /**
   * * Retrieve all responses to certain type (Survey / Test)
   *
   * @param responseTo response type (Survey / Test)
   */
  getAllOf(responseTo) {
    const queryString = `/?responseTo=${responseTo}`;
    return http.get(base + queryString);
  }

  /**
   * * Retrieve all response with specific uuid
   *
   * @param uuid uuid of the responses to retrieve
   */
  getByUUID(uuid) {
    const queryString = `/?uuid=${uuid}`;
    return http.get(base + queryString);
  }

  /**
   * * Check if user with specific uuid have responded survey or test
   *
   * @param {*} uuid uuid of the user to check response
   */
  async responded(uuid) {
    const response = await http.get(`${base}/?uuid=${uuid}`);
    return response.data.length > 0;
  }

  /**
   * * Delete a response with specific _id
   *
   * @param _id _id of the response to delete
   */
  delete(_id) {
    return http.delete(`${base}/${_id}`);
  }
}

export default new responseDataService();
