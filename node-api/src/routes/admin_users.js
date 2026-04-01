import express from "express";
import { userModel } from "../schemas/user.schema";
import { adminAuth } from "../middleware/auth";

const router = express.Router();

router.use(adminAuth);

/**
 * Listagem de todos os usuários com filtros básicos
 */
router.get("/", async (req, res) => {
  try {
    const users = await userModel.find({}).sort({ created_at: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "ERRO_AO_LISTAR_USUARIOS" });
  }
});

/**
 * Banir/Desbanir usuário
 */
router.patch("/:id/ban", async (req, res) => {
  try {
    const { id } = req.params;
    const { isBanned } = req.body;
    
    const user = await userModel.findByIdAndUpdate(id, { isBanned }, { new: true });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: "ERRO_AO_BANIR_USUARIO" });
  }
});

/**
 * Atualizar créditos do usuário
 */
router.patch("/:id/credits", async (req, res) => {
  try {
    const { id } = req.params;
    const { credits } = req.body;
    
    const user = await userModel.findByIdAndUpdate(id, { credits }, { new: true });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: "ERRO_AO_ATUALIZAR_CREDITOS" });
  }
});

export default router;
