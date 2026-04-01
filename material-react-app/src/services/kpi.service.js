import httpService from "services/htttp.service";

class KPIService {
  getRegistrationFunnel = async () => {
    return await httpService.get("kpi/funnel/registration");
  };

  getPaymentFunnel = async () => {
    return await httpService.get("kpi/funnel/payment");
  };

  getCreditROI = async () => {
    return await httpService.get("kpi/roi/credits");
  };

  getMarketInterests = async () => {
    return await httpService.get("kpi/market/interests");
  };

  getRevenueMRR = async () => {
    return await httpService.get("kpi/revenue/mrr");
  };
}

export default new KPIService();
