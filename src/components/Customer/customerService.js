import axios from "axios";
import * as mod from "../../utils/url";

const getUsers = async () => {
  const response = await axios.get(`${mod.api_url}user/all-users`);

  return response.data;
};

const customerService = {
  getUsers,
};

export default customerService;
