import httpService from "services/htttp.service";

class AdminService {
  // Users
  getUsers = async () => {
    return await httpService.get("admin/users");
  };

  banUser = async (id, isBanned) => {
    return await httpService.patch(`admin/users/${id}/ban`, { isBanned });
  };

  updateCredits = async (id, credits) => {
    return await httpService.patch(`admin/users/${id}/credits`, { credits });
  };

  // Providers
  getProviders = async () => {
    return await httpService.get("admin/providers");
  };

  toggleProvider = async (id, active) => {
    return await httpService.patch(`admin/providers/${id}/toggle`, { active });
  };

  getBalances = async () => {
    return await httpService.get("admin/providers/balances");
  };

  // Emails
  getEmailTemplates = async () => {
    return await httpService.get("admin/emails");
  };

  saveEmailTemplate = async (id, data) => {
    if (id) return await httpService.put(`admin/emails/${id}`, data);
    return await httpService.post("admin/emails", data);
  };
}

export default new AdminService();
