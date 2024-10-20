import express from "express";
import uploadPengumuman from "../middleware/fileUploadPengumuman.js";
import {
  getAgendaPengunjung,
  getAgendaAdmin,
  createAgenda,
  updateAgenda,
  deleteAgenda,
  getPengumumanPengunjung,
  getPengumumanAdmin,
  createPengumuman,
  updatePengumuman,
  deletePengumuman,
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

//pengunjung
router.get("/pengumumanpengunjung", getPengumumanPengunjung);

// Admin
router.get("/pengumuman", verifyToken, superOnly, getPengumumanAdmin);
router.post(
  "/cpengumuman",
  verifyToken,
  superOnly,
  uploadPengumuman.single("file"),
  createPengumuman
);
router.patch(
  "/pengumuman/:uuid",
  verifyToken,
  superOnly,
  uploadPengumuman.single("file"),
  updatePengumuman
);
router.delete("/pengumuman/:uuid", verifyToken, superOnly, deletePengumuman);

export default router;
