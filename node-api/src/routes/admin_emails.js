import express from "express";
import { emailTemplateModel } from "../schemas/emailTemplate.schema";
import { adminAuth } from "../middleware/auth";

const router = express.Router();

router.use(adminAuth);

/**
 * Listagem de templates de e-mail
 */
router.get("/", async (req, res) => {
  try {
    const templates = await emailTemplateModel.find({}).sort({ created_at: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: "ERRO_AO_LISTAR_TEMPLATES" });
  }
});

/**
 * Criar novo template
 */
router.post("/", async (req, res) => {
  try {
    const { name, subject, content, type } = req.body;
    const template = await emailTemplateModel.create({ name, subject, content, type });
    res.json({ success: true, template });
  } catch (error) {
    res.status(500).json({ error: "ERRO_AO_CRIAR_TEMPLATE" });
  }
});

/**
 * Atualizar template
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subject, content, type, active } = req.body;
    
    const template = await emailTemplateModel.findByIdAndUpdate(id, { 
      name, subject, content, type, active, updated_at: new Date() 
    }, { new: true });
    
    res.json({ success: true, template });
  } catch (error) {
    res.status(500).json({ error: "ERRO_AO_ATUALIZAR_TEMPLATE" });
  }
});

/**
 * Histórico de envios (Logs vindos do App principal)
 */
router.get("/logs", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const logs = await db.collection("mail_logs").find({}).sort({ timestamp: -1 }).limit(100).toArray();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "ERRO_AO_BUSCAR_LOGS_EMAIL" });
  }
});

export default router;
