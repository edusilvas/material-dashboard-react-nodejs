import express from "express";
import mongoose from "mongoose";
import { adminAuth } from "../middleware/auth";

const router = express.Router();

router.use(adminAuth);

/**
 * Listagem de todos os provedores Nexus
 */
router.get("/", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const providers = await db.collection("nexus_providers").find({}).toArray();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: "ERRO_AO_LISTAR_PROVEDORES" });
  }
});

/**
 * Ativar/Desativar provedor
 */
router.patch("/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    
    const db = mongoose.connection.db;
    await db.collection("nexus_providers").updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { active, updatedAt: new Date().toISOString() } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "ERRO_AO_ALTERAR_ESTADO_PROVEDOR" });
  }
});

/**
 * Buscar saldos em tempo real dos provedores (CapSolver, ScrapingDog, etc)
 */
router.get("/balances", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const balances = await db.collection("system_settings").find({ type: "provider_credits" }).toArray();
    res.json(balances);
  } catch (error) {
    res.status(500).json({ error: "ERRO_AO_BUSCAR_SALDOS" });
  }
});

export default router;
