import ApiAdapter from "../../../shared/api/ApiAdapter";
import { BASE_URL } from "../../../shared/config/config";

const adapter = new ApiAdapter(BASE_URL);

const authApi = {
  async logout() {
    return await adapter.post("/auth/token/logout/", {});
  },

  async login(username: string, password: string) {
    return await adapter.post("/auth/token/login/", { username, password });
  },
};

export default authApi;
