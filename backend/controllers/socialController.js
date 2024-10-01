import { PrismaClient } from "@prisma/client";

import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

//pengunjung
export const getAgendaPengunjung = async (req, res) => {
  try {
    // Ambil data dari tabel Agenda
    const agenda = await prisma.agenda.findMany({
      include: {
        createdBy: true, // Jika Anda ingin menyertakan informasi tentang administrator yang membuat entri
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
        createdBy: true, // Jika Anda ingin menyertakan informasi tentang administrator yang membuat entri
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
  const { nama_agenda, deskripsi, tempat_pelaksanaan, tanggal_agenda } =
    req.body;

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
    const newAgenda = await prisma.agenda.create({
      data: {
        nama_agenda,
        deskripsi,
        tempat_pelaksanaan,
        tanggal_agenda: agendaDate, // Mengonversi string tanggal menjadi objek Date
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
  const { nama_agenda, deskripsi, tempat_pelaksanaan, tanggal_agenda } =
    req.body;

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
