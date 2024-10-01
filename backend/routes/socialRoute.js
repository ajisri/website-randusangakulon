import express from "express";
import {
  getAgendaPengunjung,
  getAgendaAdmin,
  createAgenda,
  updateAgenda,
  deleteAgenda,
} from "../controllers/socialController.js"; // Pastikan untuk menyesuaikan path ini dengan lokasi controller Anda
import { verifyToken, superOnly } from "../middleware/verifyToken.js";

const router = express.Router();

//pengunjung
router.get("/agendapengunjung", getAgendaPengunjung);

// Admin
router.get("/agenda", verifyToken, superOnly, getAgendaAdmin);
router.post("/cagenda", verifyToken, superOnly, createAgenda);
router.patch("/agenda/:uuid", verifyToken, superOnly, updateAgenda);
router.delete("/agenda/:uuid", verifyToken, superOnly, deleteAgenda);

export default router;
