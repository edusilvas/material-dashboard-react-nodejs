import mongoose from "mongoose";

/**
 * KPI ORCHESTRATOR v2.0 - JOBFLOW COMMAND HUB
 * Responsável por agregar dados brutos em KPIs estratégicos (ROI, Churn, Funis).
 */
class KPIOrchestrator {
  
  /**
   * Retorna os dados do funil de cadastro
   * Calculado por: Auth Callbacks (telemetry) vs Perfis Criados (users)
   */
  async getRegistrationFunnel() {
    const db = mongoose.connection.db;
    const telemetry = db.collection("telemetry_v2");
    const users = db.collection("users");

    const authStarts = await telemetry.countDocuments({ 
      message: { $regex: /Auth Callback/i } 
    });
    
    const completedProfiles = await users.countDocuments({});

    return {
      started: authStarts,
      completed: completedProfiles,
      abandoned: Math.max(0, authStarts - completedProfiles),
      rate: authStarts > 0 ? ((completedProfiles / authStarts) * 100).toFixed(1) : 0
    };
  }

  /**
   * Retorna os dados do funil de pagamento
   * Calculado por: Audit Logs (payment_intent) vs Sucesso (status)
   */
  async getPaymentFunnel() {
    const db = mongoose.connection.db;
    const auditLogs = db.collection("audit_logs");

    const intents = await auditLogs.countDocuments({ type: "payment_intent" });
    const successful = await auditLogs.countDocuments({ 
      type: "payment_intent", 
      status: "SUCCESS" 
    });

    return {
      intents,
      successful,
      abandoned: intents - successful,
      conversionRate: intents > 0 ? ((successful / intents) * 100).toFixed(1) : 0
    };
  }

  /**
   * Calcula o ROI de Créditos
   * Custo estimado vs Candidaturas realizadas
   */
  async getCreditROI() {
    const db = mongoose.connection.db;
    const applications = db.collection("applications_v2");
    const settings = db.collection("system_settings");

    const totalApplied = await applications.countDocuments({ 
      status: { $in: ["CANDIDATADA", "APLICADA", "SUCCESS"] } 
    });

    const providerCredits = await settings.find({ type: "provider_credits" }).toArray();
    
    // Estimativa de custo baseada em 1000 créditos = $1 (simplificado)
    const estimatedCost = providerCredits.reduce((acc, curr) => acc + (curr.credits || 0), 0) / 1000;

    return {
      totalApplied,
      costEstimate: estimatedCost,
      costPerApplication: totalApplied > 0 ? (estimatedCost / totalApplied).toFixed(4) : 0
    };
  }

  /**
   * Nuvem de interesses (Top Job Titles)
   */
  async getMarketInterests() {
    const db = mongoose.connection.db;
    const applications = db.collection("applications_v2");

    const topTitles = await applications.aggregate([
      { $group: { _id: "$title", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();

    return topTitles.map(t => ({ title: t._id, count: t.count }));
  }

  /**
   * MRR Estimado (Pagar por mês)
   */
  async getRevenueStats() {
    const db = mongoose.connection.db;
    const users = db.collection("users");

    const premiumUsers = await users.countDocuments({ profileType: "PREMIUM" });
    const avgPrice = 49.90; // Valor fixo do plano JobFlow

    return {
      mrr: (premiumUsers * avgPrice).toFixed(2),
      premiumCount: premiumUsers,
      totalUsers: await users.countDocuments({})
    };
  }
}

export default new KPIOrchestrator();
