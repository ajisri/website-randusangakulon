import express from "express";
import uploadProdukHukum from "../middleware/fileUploadProdukHukum.js";

import {
  getProdukHukumPengunjung,
  downloadFile,
  getProdukHukumAdmin,
  createProdukHukum,
  updateProdukHukum,
  deleteProdukHukum,
} from "../controllers/transparentController.js";
import { verifyToken, superOnly } from "../middleware/verifyToken.js";

const router = express.Router();

//pengunjung
router.get("/produk_hukump", getProdukHukumPengunjung);
router.get("/download/:filename", downloadFile);

//admin
router.get("/produk_hukum", verifyToken, superOnly, getProdukHukumAdmin);
router.post(
  "/cprodukhukum",
  verifyToken,
  superOnly,
  uploadProdukHukum.single("file"),
  createProdukHukum
);
router.patch(
  "/produk_hukum/:uuid",
  verifyToken,
  superOnly,
  uploadProdukHukum.single("file"),
  updateProdukHukum
);
router.delete("/produk_hukum/:uuid", verifyToken, superOnly, deleteProdukHukum);

export default router;
