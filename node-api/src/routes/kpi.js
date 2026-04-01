import express from "express";
import KPIOrchestrator from "../services/KPIOrchestrator";
import passport from "passport";

const router = express.Router();

/**
 * [SECURITY_GATE] Todos os endpoints de KPI exigem autenticação administrativa.
 */
router.use(passport.authenticate("jwt", { session: false }));

router.get("/funnel/registration", async (req, res) => {
  try {
    const data = await KPIOrchestrator.getRegistrationFunnel();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "FALHA_AO_RODAR_FUNIL_CADASTRO" });
  }
});

router.get("/funnel/payment", async (req, res) => {
  try {
    const data = await KPIOrchestrator.getPaymentFunnel();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "FALHA_AO_RODAR_FUNIL_PAGAMENTO" });
  }
});

router.get("/roi/credits", async (req, res) => {
  try {
    const data = await KPIOrchestrator.getCreditROI();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "FALHA_AO_RODAR_ROI_CREDITOS" });
  }
});

router.get("/market/interests", async (req, res) => {
  try {
    const data = await KPIOrchestrator.getMarketInterests();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "FALHA_AO_RODAR_INTERESSES_MERCADO" });
  }
});

router.get("/revenue/mrr", async (req, res) => {
  try {
    const data = await KPIOrchestrator.getRevenueStats();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "FALHA_AO_RODAR_ESTATISTICAS_RECEITA" });
  }
});

export default router;
