import { PrismaClient } from "@prisma/client";

import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getProdukHukumPengunjung = async (req, res) => {
  try {
    // Ambil data dari tabel ProdukHukum
    const produkHukump = await prisma.produkHukum.findMany({
      include: {
        createdBy: {
          select: {
            name: true, // Hanya mengambil field 'name' dari relasi 'createdBy'
          },
        },
      },
    });

    // Cek jika tidak ada data
    if (produkHukump.length === 0) {
      return res.status(200).json({ produkHukum: [] });
    }

    // Kirimkan data produk hukum
    res.status(200).json({ produkHukump });
  } catch (error) {
    console.error("Error saat mengambil data produk hukum untuk admin:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const downloadFile = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../uploads/produk_hukum", filename); // Path file

  res.download(filePath, (err) => {
    if (err) {
      res.status(500).send({
        message: "File tidak dapat diunduh.",
        error: err.message,
      });
    }
  });
};

export const getProdukHukumAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    // Cek keberadaan refresh token
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    // Temukan administrator berdasarkan refresh token
    const administrator = await prisma.administrator.findUnique({
      where: {
        refresh_token: refreshToken,
      },
    });

    // Cek apakah administrator ditemukan
    if (!administrator) {
      return res.status(401).json({ msg: "Pengguna tidak ditemukan" });
    }

    // Cek peran administrator
    if (administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Ambil data dari tabel ProdukHukum
    const produkHukum = await prisma.produkHukum.findMany({
      include: {
        createdBy: {
          select: {
            name: true, // Hanya mengambil field 'name' dari relasi 'createdBy'
          },
        },
      },
    });

    // Cek jika tidak ada data
    if (produkHukum.length === 0) {
      return res.status(200).json({ produkHukum: [] });
    }

    // Kirimkan data produk hukum
    res.status(200).json({ produkHukum });
  } catch (error) {
    console.error("Error saat mengambil data produk hukum untuk admin:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const createProdukHukum = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, deskripsi, waktu } = req.body;
  const file = req.file;
  try {
    // Validasi format waktu
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Format YYYY-MM-DD
    if (!dateRegex.test(waktu)) {
      return res.status(400).json({
        msg: "Format waktu tidak valid. Harus dalam format YYYY-MM-DD",
      });
    }

    const parsedWaktu = new Date(waktu);
    if (isNaN(parsedWaktu.getTime())) {
      return res.status(400).json({ msg: "Format waktu tidak valid" });
    }

    // Simpan dalam format Date
    const formattedDate = new Date(parsedWaktu.toISOString().split("T")[0]);

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const administrator = await prisma.administrator.findUnique({
      where: { id: decoded.administratorId },
    });

    if (!administrator || administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Cek apakah kombinasi nama dan waktu sudah ada
    const existingProdukHukum = await prisma.produkHukum.findFirst({
      where: {
        name,
        waktu: formattedDate,
      },
    });

    if (existingProdukHukum) {
      return res.status(400).json({
        msg: "Nama dan Tanggal SK sudah ada, tidak bisa membuat data baru",
      });
    }

    const newProdukHukum = await prisma.produkHukum.create({
      data: {
        name,
        deskripsi,
        waktu: formattedDate, // Simpan sebagai objek Date
        file_url: file ? `/uploads/produk_hukum/${file.filename}` : null,
        createdbyId: administrator.id,
      },
    });

    return res.status(201).json({
      msg: "Produk hukum dibuat dengan sukses",
      produkHukum: newProdukHukum,
    });
  } catch (error) {
    console.error("Error saat membuat produk hukum:", error);
    return res.status(500).json({
      msg: "Terjadi kesalahan pada server",
    });
  }
};

export const updateProdukHukum = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { uuid } = req.params; // Mengambil UUID dari URL params
  const { name, deskripsi, waktu } = req.body;
  const file = req.file;

  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const administrator = await prisma.administrator.findUnique({
      where: { id: decoded.administratorId },
    });

    if (!administrator || administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const existingProdukHukum = await prisma.produkHukum.findUnique({
      where: { uuid },
    });

    if (!existingProdukHukum) {
      return res.status(404).json({ msg: "Produk hukum tidak ditemukan" });
    }

    // Cek apakah ada produk hukum lain dengan nama dan waktu yang sama
    const duplicateProdukHukum = await prisma.produkHukum.findFirst({
      where: {
        name,
        waktu: new Date(waktu),
        NOT: { uuid }, // Mengecualikan produk hukum yang sedang di-update
      },
    });

    if (duplicateProdukHukum) {
      return res.status(400).json({
        msg: "Nama dan waktu sudah ada pada produk hukum lain, tidak bisa memperbarui data",
      });
    }

    // Jika ada file baru dan file sebelumnya ada, maka kita akan menghapus file lama
    let filePathToDelete = null;
    if (file && existingProdukHukum.file_url) {
      filePathToDelete = path.join(
        __dirname,
        "..",
        "uploads/produk_hukum",
        path.basename(existingProdukHukum.file_url)
      );
    }

    // Update produk hukum dengan data baru
    const updatedProdukHukum = await prisma.produkHukum.update({
      where: { uuid },
      data: {
        name,
        deskripsi,
        waktu: new Date(waktu),
        file_url: file
          ? `/uploads/produk_hukum/${file.filename}` // File URL baru jika ada file baru
          : existingProdukHukum.file_url, // Tetap menggunakan file URL lama jika tidak ada file baru
        updated_at: new Date(),
        createdbyId: administrator.id, // Perbarui id pembuat data
      },
    });

    // Hapus file lama jika ada
    if (filePathToDelete && fs.existsSync(filePathToDelete)) {
      fs.unlinkSync(filePathToDelete);
      console.log(`Successfully deleted old file: ${filePathToDelete}`);
    }

    return res.status(200).json({
      msg: "Produk hukum diperbarui dengan sukses",
      produkHukum: updatedProdukHukum,
    });
  } catch (error) {
    console.error("Error saat memperbarui produk hukum:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const deleteProdukHukum = async (req, res) => {
  const { uuid } = req.params; // Menggunakan uuid

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const administrator = await prisma.administrator.findUnique({
      where: { id: decoded.administratorId },
    });

    if (!administrator || administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const existingProdukHukum = await prisma.produkHukum.findUnique({
      where: { uuid }, // Mencari berdasarkan uuid
    });

    if (!existingProdukHukum) {
      return res.status(404).json({ msg: "Produk hukum tidak ditemukan" });
    }

    // Delete file if it exists
    const filePathToDelete = path.join(
      __dirname,
      "..",
      "uploads/produk_hukum",
      path.basename(existingProdukHukum.file_url)
    );

    if (fs.existsSync(filePathToDelete)) {
      fs.unlinkSync(filePathToDelete);
      console.log(`Successfully deleted file: ${filePathToDelete}`);
    }

    // Delete product hukum record
    await prisma.produkHukum.delete({
      where: { uuid }, // Mencari berdasarkan uuid
    });

    return res.status(200).json({ msg: "Produk hukum dihapus dengan sukses" });
  } catch (error) {
    console.error("Error saat menghapus produk hukum:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Helper function to handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

// Middleware to check refresh token and administrator role
const verifyAdmin = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ msg: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const administrator = await prisma.administrator.findUnique({
      where: { id: decoded.administratorId },
    });

    if (!administrator || administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Menyimpan UUID administrator ke dalam req untuk digunakan di controller
    req.administratorId = administrator.uuid;
    next(); // Jika semua validasi berhasil, lanjutkan ke handler berikutnya
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(403).json({ msg: "Token tidak valid" });
  }
};

// Keuangan CRUD
export const createKeuangan = [
  verifyAdmin, // Menambahkan middleware
  body("name").notEmpty().withMessage("Name is required"),
  async (req, res) => {
    handleValidationErrors(req, res);

    const { name } = req.body;
    const createdById = req.administratorId; // Mengambil UUID dari administrator yang terverifikasi

    try {
      const keuangan = await prisma.keuangan.create({
        data: {
          name,
          createdById, // Gunakan UUID yang didapat dari req.administratorId
        },
      });
      res.status(201).json(keuangan);
    } catch (error) {
      console.error("Error creating Keuangan:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

// Fungsi lainnya mengikuti pola yang sama
export const getAllKeuangan = [
  verifyAdmin,
  async (req, res) => {
    try {
      const keuangans = await prisma.keuangan.findMany();
      res.status(200).json(keuangans);
    } catch (error) {
      console.error("Error fetching Keuangan:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const updateKeuangan = [
  verifyAdmin,
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  async (req, res) => {
    handleValidationErrors(req, res);
    const { uuid } = req.params;
    const { name } = req.body;
    try {
      const updatedKeuangan = await prisma.keuangan.update({
        where: { uuid },
        data: {
          name,
          updated_at: new Date(),
        },
      });
      res.status(200).json(updatedKeuangan);
    } catch (error) {
      console.error("Error updating Keuangan:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const deleteKeuangan = [
  verifyAdmin,
  async (req, res) => {
    const { uuid } = req.params;
    try {
      await prisma.keuangan.delete({
        where: { uuid },
      });
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting Keuangan:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

// Kategori CRUD
export const createKategori = [
  verifyAdmin,
  body("name").notEmpty().withMessage("Name is required"),
  body("keuanganId").isUUID().withMessage("KeuanganId must be a valid UUID"),
  async (req, res) => {
    handleValidationErrors(req, res);
    const createdById = req.administratorId;
    const { name, keuanganId } = req.body;

    try {
      // Hitung jumlah kategori yang ada dengan keuanganId yang sama
      const count = await prisma.kategori.count({
        where: { keuanganId: keuanganId },
      });

      // Tentukan nilai number berdasarkan jumlah kategori yang ada + 1
      const number = (count + 1).toString();

      // Buat kategori baru dengan number yang otomatis di-generate
      const kategori = await prisma.kategori.create({
        data: {
          name,
          number,
          keuanganId,
          createdById,
        },
      });

      res.status(201).json(kategori);
    } catch (error) {
      console.error("Error creating Kategori:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const getAllKategori = [
  verifyAdmin,
  async (req, res) => {
    try {
      const kategoris = await prisma.kategori.findMany({
        include: { subkategori: true },
      });
      res.status(200).json(kategoris);
    } catch (error) {
      console.error("Error fetching Kategori:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const updateKategori = [
  verifyAdmin,
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("number")
    .optional()
    .isNumeric()
    .withMessage("Number must be a numeric value"),
  async (req, res) => {
    handleValidationErrors(req, res);
    const { uuid } = req.params;
    const { name, number } = req.body;
    try {
      const updatedKategori = await prisma.kategori.update({
        where: { uuid },
        data: {
          name,
          number,
          updated_at: new Date(),
        },
      });
      res.status(200).json(updatedKategori);
    } catch (error) {
      console.error("Error updating Kategori:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const deleteKategori = [
  verifyAdmin,
  async (req, res) => {
    const { uuid } = req.params;
    try {
      await prisma.kategori.delete({
        where: { uuid },
      });
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting Kategori:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

// Subkategori CRUD
export const createSubkategori = [
  verifyAdmin,
  body("name").notEmpty().withMessage("Name is required"),
  body("number").isNumeric().withMessage("Number must be a numeric value"),
  body("kategoriId").isUUID().withMessage("KategoriId must be a valid UUID"),
  body("createdById").isUUID().withMessage("CreatedById must be a valid UUID"),
  async (req, res) => {
    handleValidationErrors(req, res);
    const { name, number, kategoriId, createdById } = req.body;
    try {
      const subkategori = await prisma.subkategori.create({
        data: {
          name,
          number,
          kategoriId,
          createdById,
        },
      });
      res.status(201).json(subkategori);
    } catch (error) {
      console.error("Error creating Subkategori:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const getAllSubkategori = [
  verifyAdmin,
  async (req, res) => {
    try {
      const subkategoris = await prisma.subkategori.findMany({
        include: { budgetItems: true },
      });
      res.status(200).json(subkategoris);
    } catch (error) {
      console.error("Error fetching Subkategori:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const updateSubkategori = [
  verifyAdmin,
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("number")
    .optional()
    .isNumeric()
    .withMessage("Number must be a numeric value"),
  async (req, res) => {
    handleValidationErrors(req, res);
    const { uuid } = req.params;
    const { name, number } = req.body;
    try {
      const updatedSubkategori = await prisma.subkategori.update({
        where: { uuid },
        data: {
          name,
          number,
          updated_at: new Date(),
        },
      });
      res.status(200).json(updatedSubkategori);
    } catch (error) {
      console.error("Error updating Subkategori:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const deleteSubkategori = [
  verifyAdmin,
  async (req, res) => {
    const { uuid } = req.params;
    try {
      await prisma.subkategori.delete({
        where: { uuid },
      });
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting Subkategori:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

// BudgetItem CRUD
export const createBudgetItem = [
  verifyAdmin,
  body("budget").isNumeric().withMessage("Budget must be a numeric value"),
  body("realization")
    .isNumeric()
    .withMessage("Realization must be a numeric value"),
  body("subkategoriId")
    .isUUID()
    .withMessage("SubkategoriId must be a valid UUID"),
  body("createdById").isUUID().withMessage("CreatedById must be a valid UUID"),
  body("year").isNumeric().withMessage("Year must be a numeric value"),
  async (req, res) => {
    handleValidationErrors(req, res);
    const { budget, realization, subkategoriId, createdById, year } = req.body;
    try {
      const budgetItem = await prisma.budgetItem.create({
        data: {
          budget,
          realization,
          remaining: budget - realization,
          subkategoriId,
          createdById,
          year,
        },
      });
      res.status(201).json(budgetItem);
    } catch (error) {
      console.error("Error creating BudgetItem:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const getAllBudgetItems = [
  verifyAdmin,
  async (req, res) => {
    try {
      const budgetItems = await prisma.budgetItem.findMany({
        include: { subkategori: true },
      });
      res.status(200).json(budgetItems);
    } catch (error) {
      console.error("Error fetching BudgetItems:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const updateBudgetItem = [
  verifyAdmin,
  body("budget")
    .optional()
    .isNumeric()
    .withMessage("Budget must be a numeric value"),
  body("realization")
    .optional()
    .isNumeric()
    .withMessage("Realization must be a numeric value"),
  async (req, res) => {
    handleValidationErrors(req, res);
    const { uuid } = req.params;
    const { budget, realization } = req.body;

    try {
      await prisma.$transaction(async (tx) => {
        const currentBudgetItem = await tx.budgetItem.findUnique({
          where: { uuid },
        });

        const updatedBudgetItem = await tx.budgetItem.update({
          where: { uuid },
          data: {
            budget,
            realization,
            remaining: budget - realization,
            updated_at: new Date(),
          },
        });

        await recalculateSubkategoriBudget(currentBudgetItem.subkategoriId, tx);
      });

      res.status(200).json({ msg: "Budget item updated successfully" });
    } catch (error) {
      console.error("Error updating budget item:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const deleteBudgetItem = [
  verifyAdmin,
  async (req, res) => {
    const { uuid } = req.params;
    try {
      await prisma.budgetItem.delete({
        where: { uuid },
      });
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting BudgetItem:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

// Helper function to recalculate Subkategori budget
async function recalculateSubkategoriBudget(subkategoriId, tx) {
  const budgetItems = await tx.budgetItem.findMany({
    where: { subkategoriId },
  });

  let totalBudget = 0;
  let totalRealization = 0;

  budgetItems.forEach((item) => {
    totalBudget += item.budget;
    totalRealization += item.realization;
  });

  await tx.subkategori.update({
    where: { id: subkategoriId },
    data: {
      totalBudget,
      totalRealization,
      remaining: totalBudget - totalRealization,
    },
  });
}
