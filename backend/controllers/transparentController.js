import { PrismaClient } from "@prisma/client";

import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
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
        createdBy: true, // Jika Anda ingin menyertakan informasi tentang administrator yang membuat entri
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
        createdBy: true, // Jika Anda ingin menyertakan informasi tentang administrator yang membuat entri
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
