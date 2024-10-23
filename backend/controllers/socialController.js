import { PrismaClient } from "@prisma/client";

import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//pengunjung
export const getAgendaPengunjung = async (req, res) => {
  try {
    // Ambil data dari tabel Agenda
    const agenda = await prisma.agenda.findMany({
      include: {
        createdBy: {
          select: {
            name: true, // Hanya mengambil field 'name' dari relasi 'createdBy'
          },
        },
      },
    });

    // Cek jika tidak ada data
    if (agenda.length === 0) {
      return res.status(200).json({ agenda: [] });
    }

    // Kirimkan data agenda
    res.status(200).json({ agenda });
  } catch (error) {
    console.error("Error saat mengambil data agenda untuk pengunjung:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//admin
//Agenda
export const getAgendaAdmin = async (req, res) => {
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

    // Ambil data dari tabel Agenda
    const agenda = await prisma.agenda.findMany({
      include: {
        createdBy: {
          select: {
            name: true, // Hanya mengambil field 'name' dari relasi 'createdBy'
          },
        },
      },
    });

    // Cek jika tidak ada data
    if (agenda.length === 0) {
      return res.status(200).json({ agenda: [] });
    }

    // Kirimkan data agenda
    res.status(200).json({ agenda });
  } catch (error) {
    console.error("Error saat mengambil data agenda untuk admin:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const createAgenda = async (req, res) => {
  const {
    nama_agenda,
    deskripsi,
    tempat_pelaksanaan,
    tanggal_agenda,
    tanggal_akhir_agenda,
  } = req.body;

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

    const agendaDate = new Date(tanggal_agenda);
    const agendaakhirDate = new Date(tanggal_akhir_agenda);
    const newAgenda = await prisma.agenda.create({
      data: {
        nama_agenda,
        deskripsi,
        tempat_pelaksanaan,
        tanggal_agenda: agendaDate, // Mengonversi string tanggal menjadi objek Date
        tanggal_akhir_agenda: agendaakhirDate, // Mengonversi string tanggal menjadi objek Date
        createdbyId: administrator.id,
      },
    });

    return res.status(201).json({
      msg: "Agenda dibuat dengan sukses",
      agenda: newAgenda,
    });
  } catch (error) {
    console.error("Error saat membuat agenda:", error);
    return res.status(500).json({
      msg: "Terjadi kesalahan pada server",
    });
  }
};

export const updateAgenda = async (req, res) => {
  const { uuid } = req.params; // Mengambil UUID dari URL params
  const {
    nama_agenda,
    deskripsi,
    tempat_pelaksanaan,
    tanggal_agenda,
    tanggal_akhir_agenda,
  } = req.body;

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

    const existingAgenda = await prisma.agenda.findUnique({
      where: { uuid },
    });

    if (!existingAgenda) {
      return res.status(404).json({ msg: "Agenda tidak ditemukan" });
    }

    const updatedAgenda = await prisma.agenda.update({
      where: { uuid },
      data: {
        nama_agenda,
        deskripsi,
        tempat_pelaksanaan,
        tanggal_agenda: new Date(tanggal_agenda), // Mengonversi string tanggal menjadi objek Date
        tanggal_akhir_agenda: new Date(tanggal_akhir_agenda),
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({
      msg: "Agenda diperbarui dengan sukses",
      agenda: updatedAgenda,
    });
  } catch (error) {
    console.error("Error saat memperbarui agenda:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const deleteAgenda = async (req, res) => {
  const { uuid } = req.params; // Menggunakan uuid

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

    const existingAgenda = await prisma.agenda.findUnique({
      where: { uuid },
    });

    if (!existingAgenda) {
      return res.status(404).json({ msg: "Agenda tidak ditemukan" });
    }

    await prisma.agenda.delete({
      where: { uuid },
    });

    return res.status(200).json({ msg: "Agenda dihapus dengan sukses" });
  } catch (error) {
    console.error("Error saat menghapus agenda:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//Pengumuman
//pengumuman pengunjung
export const getPengumumanPengunjung = async (req, res) => {
  try {
    // Ambil data dari tabel Agenda
    const pengumumans = await prisma.pengumuman.findMany({
      include: {
        createdBy: {
          select: {
            name: true, // Hanya mengambil field 'name' dari relasi 'createdBy'
          },
        },
      },
    });

    // Cek jika tidak ada data
    if (pengumumans.length === 0) {
      return res.status(200).json({ pengumuman: [] });
    }

    // Kirimkan data pengumuman
    res.status(200).json({ pengumumans });
  } catch (error) {
    console.error(
      "Error saat mengambil data pengumuman untuk pengunjung:",
      error
    );
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//pengumuman admin
export const getPengumumanAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const administrator = await prisma.administrator.findUnique({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!administrator) {
      return res.status(401).json({ msg: "Pengguna tidak ditemukan" });
    }

    if (administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const pengumumans = await prisma.pengumuman.findMany({
      include: {
        createdBy: {
          select: {
            uuid: true,
            name: true, // Hanya mengambil field 'name' dari relasi 'createdBy'
          },
        },
      },
    });

    if (pengumumans.length === 0) {
      return res.status(200).json({ pengumumans: [] });
    }

    res.status(200).json({ pengumumans });
  } catch (error) {
    console.error("Error saat mengambil data pengumuman untuk admin:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const createPengumuman = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, status } = req.body;

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

    const newPengumuman = await prisma.pengumuman.create({
      data: {
        title,
        content,
        status,
        file_url: file ? `/uploads/demografi/${file.filename}` : null,
        createdbyId: administrator.uuid,
      },
    });

    return res.status(201).json({
      msg: "pengumuman created successfully",
      pengumuman: newPengumuman,
    });
  } catch (error) {
    console.error("Error creating pengumuman:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const updatePengumuman = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { uuid, title, content, status } = req.body;
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

    const existingPengumuman = await prisma.pengumuman.findUnique({
      where: { uuid },
    });
    if (!existingPengumuman) {
      return res.status(404).json({ msg: "Demografi tidak ditemukan" });
    }

    let filePathToDelete = null;
    if (file && existingPengumuman.file_url) {
      filePathToDelete = path.join(
        __dirname,
        "..",
        "uploads/pengumuman",
        path.basename(existingPengumuman.file_url)
      );
    }

    const updatedPengumuman = await prisma.pengumuman.update({
      where: { uuid },
      data: {
        title,
        content,
        status,
        file_url: file
          ? `/uploads/pengumuman/${file.filename}`
          : existingPengumuman.file_url,
        updated_at: new Date(),
      },
    });

    if (filePathToDelete && fs.existsSync(filePathToDelete)) {
      fs.unlinkSync(filePathToDelete);
      console.log(`Berhasil menghapus file lama: ${filePathToDelete}`);
    }

    return res.status(200).json({
      msg: "Pengumuman berhasil diperbarui",
      demographic: updatedPengumuman,
    });
  } catch (error) {
    console.error("Error memperbarui Pengumuman:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const deletePengumuman = async (req, res) => {
  const { uuid } = req.params;

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

    const existingPengumuman = await prisma.pengumuman.findUnique({
      where: { uuid },
    });
    if (!existingPengumuman) {
      return res.status(404).json({ msg: "Pengumuman not found" });
    }

    // Delete file if it exists
    const filePathToDelete = path.join(
      __dirname,
      "..",
      "uploads/pengumuman",
      path.basename(existingPengumuman.file_url)
    );

    if (fs.existsSync(filePathToDelete)) {
      fs.unlinkSync(filePathToDelete);
      console.log(`Successfully deleted file: ${filePathToDelete}`);
    }

    // Delete pengumuman record
    await prisma.pengumuman.delete({
      where: { uuid },
    });

    return res.status(200).json({ msg: "Pengumuman deleted successfully" });
  } catch (error) {
    console.error("Error deleting pengumuman:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};
