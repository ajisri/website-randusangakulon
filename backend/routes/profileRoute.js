import express from "express";

import upload from "../middleware/fileUpload.js";
import uploadDemografi from "../middleware/fileUploadDemografi.js";
import { body, validationResult } from "express-validator";

import {
  getTentangpengunjung,
  getTentang,
  createTentang,
  getSejarahpengunjung,
  getSejarah,
  createSejarah,
  getVisimisipengunjung,
  getVisimisi,
  createVisimisi,
  getStrukturorganisasipengunjung,
  getStrukturorganisasi,
  createStrukturorganisasi,
  getLembagapengunjung,
  getLembaga,
  createLembaga,
  getDemografipengunjung,
  getDemografiadmin,
  createDemografi,
  updateDemografi,
  deleteDemografi,
  getEducationOptions,
  getAgama,
} from "../controllers/profileController.js";
import { verifyToken, superOnly } from "../middleware/verifyToken.js";

const router = express.Router();
// Mendapatkan opsi pendidikan
router.get("/education-options", getEducationOptions);

// Mendapatkan opsi agama
router.get("/agama", getAgama);

router.get("/tentangpengunjung", getTentangpengunjung);
router.get("/tentang", verifyToken, superOnly, getTentang);
router.post(
  "/ctentang",
  verifyToken,
  superOnly,
  upload.single("file"),
  createTentang
);
router.get("/sejarahpengunjung", getSejarahpengunjung);
router.get("/sejarah", verifyToken, superOnly, getSejarah);
router.post(
  "/csejarah",
  verifyToken,
  superOnly,
  upload.single("file"),
  createSejarah
);
router.get("/visimisipengunjung", getVisimisipengunjung);
router.get("/visimisi", verifyToken, superOnly, getVisimisi);
router.post(
  "/cvisimisi",
  verifyToken,
  superOnly,
  upload.single("file"),
  createVisimisi
);
router.get("/strukturorganisasipengunjung", getStrukturorganisasipengunjung);
router.get(
  "/strukturorganisasi",
  verifyToken,
  superOnly,
  getStrukturorganisasi
);
router.post(
  "/cstrukturorganisasi",
  verifyToken,
  superOnly,
  upload.single("file"),
  createStrukturorganisasi
);
router.get("/lembagapengunjung", getLembagapengunjung);
router.get("/lembaga", verifyToken, superOnly, getLembaga);
router.post(
  "/clembaga",
  verifyToken,
  superOnly,
  upload.single("file"),
  createLembaga
);
router.get("/demografipengunjung", getDemografipengunjung);
router.get("/demografi", verifyToken, superOnly, getDemografiadmin);
const demographicValidationRules = [
  body("nik")
    .isLength({ min: 16, max: 16 })
    .withMessage("NIK harus 16 karakter"),
  body("name").notEmpty().withMessage("Nama harus diisi"),
  body("gender")
    .isIn(["male", "female"])
    .withMessage("Gender harus 'male' atau 'female'"),
  body("birth_date")
    .isISO8601()
    .withMessage("Tanggal lahir harus dalam format YYYY-MM-DD"),
  body("marital_status")
    .isIn(["single", "married"])
    .withMessage("Status pernikahan harus 'single' atau 'married'"),
  body("education_id").isInt().withMessage("ID pendidikan harus berupa angka"),
  body("job").optional().isString().withMessage("Pekerjaan harus berupa teks"),
  body("rt").optional().isInt().withMessage("RT harus berupa angka"),
  body("rw").optional().isInt().withMessage("RW harus berupa angka"),
  body("hamlet").optional().isString().withMessage("Dusun harus berupa teks"),
  body("religion_id").isInt().withMessage("ID agama harus berupa angka"),
];

// Middleware for validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "fail",
      errors: errors.array(),
    });
  }
  next();
};

// POST route for creating demographic data
router.post(
  "/cdemografi",
  verifyToken,
  superOnly,
  uploadDemografi.single("file"),
  demographicValidationRules,
  handleValidationErrors,
  createDemografi
);

// PUT route for updating demographic data
router.put(
  "/demografi/:nik",
  verifyToken,
  superOnly,
  uploadDemografi.single("file"),
  demographicValidationRules,
  handleValidationErrors,
  updateDemografi
);

// Route to delete a demographic record

router.delete("/demografi/:nik", verifyToken, superOnly, deleteDemografi);

export default router;
