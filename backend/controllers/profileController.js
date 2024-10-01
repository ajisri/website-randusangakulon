import { PrismaClient } from "@prisma/client";

import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//get agama dan education
export const getEducationOptions = async (req, res) => {
  try {
    const educationOptions = await prisma.education.findMany();
    res.status(200).json(educationOptions);
  } catch (error) {
    console.error("Error fetching education options:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const getAgama = async (req, res) => {
  try {
    const agamaOptions = await prisma.religion.findMany();
    res.status(200).json(agamaOptions);
  } catch (error) {
    console.error("Error fetching agama options:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//tentang admin
export const getTentang = async (req, res) => {
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

    // Mengambil data profil dengan pname 'tentang'
    const profiles = await prisma.profile.findMany({
      where: {
        pname: "tentang",
      },
    });

    // Jika tidak ada data, kirimkan data kosong
    if (profiles.length === 0) {
      return res.status(200).json({
        profile: {
          uuid: "",
          title: "Judul Tentang",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "tentang",
        },
      });
    }

    // Kirimkan data dengan menggunakan map untuk memastikan struktur data
    const profileData = profiles.map((profile) => ({
      uuid: profile.uuid || "",
      title: profile.title || "Judul Tentang",
      content: profile.content || "",
      file_url: profile.file_url || "",
      status: profile.status || "DRAFT",
      pname: profile.pname || "tentang",
    }))[0]; // Mengambil elemen pertama jika data array

    res.status(200).json({ profile: profileData });
  } catch (error) {
    console.error("Error saat mengambil data visi-misi:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const createTentang = async (req, res) => {
  console.log("Uploaded File:", req.file);
  const { title, visionContent, status, pname } = req.body;
  const file = req.file;

  try {
    if (!["DRAFT", "PUBLISH"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Invalid status. Must be DRAFT or PUBLISH." });
    }

    // Cek administrator dari token
    const refreshToken = req.cookies.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const administrator = await prisma.administrator.findUnique({
      where: { id: decoded.administratorId },
    });

    if (!administrator || administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Cek apakah profile dengan pname sudah ada
      const existingProfile = await tx.profile.findFirst({
        where: { pname: pname },
      });

      if (existingProfile) {
        let filePathToDelete = null;

        // Jika ada file baru, tentukan path file lama untuk dihapus
        if (file) {
          if (existingProfile.file_url) {
            filePathToDelete = path.join(
              __dirname,
              "..",
              "uploads",
              path.basename(existingProfile.file_url)
            );
          }
        }

        // Update profile jika sudah ada
        const updatedProfile = await tx.profile.update({
          where: { uuid: existingProfile.uuid },
          data: {
            title,
            content: visionContent,
            file_url: file
              ? `/uploads/${file.filename}`
              : existingProfile.file_url, // Update file URL jika ada file baru
            status,
            updated_at: new Date(), // Update waktu
          },
        });

        // Hapus file lama jika ada file baru dan file lama ditemukan
        if (filePathToDelete && fs.existsSync(filePathToDelete)) {
          fs.unlinkSync(filePathToDelete);
          console.log(`Successfully deleted old file: ${filePathToDelete}`);
        }

        return { type: "update", profile: updatedProfile };
      } else {
        // Create profile jika belum ada
        const newProfile = await tx.profile.create({
          data: {
            title,
            content: visionContent,
            file_url: file ? `/uploads/${file.filename}` : null, // Simpan URL file dengan path yang benar
            pname: pname,
            status,
            createdbyId: administrator.id,
          },
        });
        return { type: "create", profile: newProfile };
      }
    });

    // Mengirimkan response sesuai hasil transaksi
    if (result.type === "update") {
      res
        .status(200)
        .json({ msg: "Profile updated successfully", profile: result.profile });
    } else {
      res
        .status(201)
        .json({ msg: "Profile created successfully", profile: result.profile });
    }
  } catch (error) {
    console.error("Error:", error.message); // Log error untuk debugging
    res.status(500).json({ msg: error.message });
  }
};

//tentang pengunjung
export const getTentangpengunjung = async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        pname: "tentang",
        status: "PUBLISH",
      },
    });

    if (profiles.length === 0) {
      return res.status(200).json({
        profile: {
          uuid: "",
          title: "Judul Tentang",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "tentang",
        },
      });
    }

    const profileData = profiles[0]; // Ambil elemen pertama dari array jika data ada

    res.status(200).json({ profile: profileData });
  } catch (error) {
    console.error("Error saat mengambil data tentang:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//sejarah admin
export const getSejarah = async (req, res) => {
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

    // Mengambil data profil dengan pname 'tentang'
    const profiles = await prisma.profile.findMany({
      where: {
        pname: "sejarah",
      },
    });

    // Jika tidak ada data, kirimkan data kosong
    if (profiles.length === 0) {
      return res.status(200).json({
        profile: {
          uuid: "",
          title: "Judul Sejarah",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "sejarah",
        },
      });
    }

    // Kirimkan data dengan menggunakan map untuk memastikan struktur data
    const profileData = profiles.map((profile) => ({
      uuid: profile.uuid || "",
      title: profile.title || "Judul Sejarah",
      content: profile.content || "",
      file_url: profile.file_url || "",
      status: profile.status || "DRAFT",
      pname: profile.pname || "sejarah",
    }))[0]; // Mengambil elemen pertama jika data array

    res.status(200).json({ profile: profileData });
  } catch (error) {
    console.error("Error saat mengambil data sejarah:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const createSejarah = async (req, res) => {
  console.log("Uploaded File:", req.file);
  const { title, visionContent, status, pname } = req.body;
  const file = req.file;

  try {
    if (!["DRAFT", "PUBLISH"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Invalid status. Must be DRAFT or PUBLISH." });
    }

    // Cek administrator dari token
    const refreshToken = req.cookies.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const administrator = await prisma.administrator.findUnique({
      where: { id: decoded.administratorId },
    });

    if (!administrator || administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Cek apakah profile dengan pname sudah ada
      const existingProfile = await tx.profile.findFirst({
        where: { pname: pname },
      });

      if (existingProfile) {
        let filePathToDelete = null;

        // Jika ada file baru, tentukan path file lama untuk dihapus
        if (file) {
          if (existingProfile.file_url) {
            filePathToDelete = path.join(
              __dirname,
              "..",
              "uploads",
              path.basename(existingProfile.file_url)
            );
          }
        }

        // Update profile jika sudah ada
        const updatedProfile = await tx.profile.update({
          where: { uuid: existingProfile.uuid },
          data: {
            title,
            content: visionContent,
            file_url: file
              ? `/uploads/${file.filename}`
              : existingProfile.file_url, // Update file URL jika ada file baru
            status,
            updated_at: new Date(), // Update waktu
          },
        });

        // Hapus file lama jika ada file baru dan file lama ditemukan
        if (filePathToDelete && fs.existsSync(filePathToDelete)) {
          fs.unlinkSync(filePathToDelete);
          console.log(`Successfully deleted old file: ${filePathToDelete}`);
        }

        return { type: "update", profile: updatedProfile };
      } else {
        // Create profile jika belum ada
        const newProfile = await tx.profile.create({
          data: {
            title,
            content: visionContent,
            file_url: file ? `/uploads/${file.filename}` : null, // Simpan URL file dengan path yang benar
            pname: pname,
            status,
            createdbyId: administrator.id,
          },
        });
        return { type: "create", profile: newProfile };
      }
    });

    // Mengirimkan response sesuai hasil transaksi
    if (result.type === "update") {
      res
        .status(200)
        .json({ msg: "Profile updated successfully", profile: result.profile });
    } else {
      res
        .status(201)
        .json({ msg: "Profile created successfully", profile: result.profile });
    }
  } catch (error) {
    console.error("Error:", error.message); // Log error untuk debugging
    res.status(500).json({ msg: error.message });
  }
};

//sejarah pengunjung
export const getSejarahpengunjung = async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        pname: "sejarah",
        status: "PUBLISH",
      },
    });

    if (profiles.length === 0) {
      return res.status(200).json({
        profile: {
          uuid: "",
          title: "Judul Sejarah",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "sejarah",
        },
      });
    }

    const profileData = profiles[0]; // Ambil elemen pertama dari array jika data ada

    res.status(200).json({ profile: profileData });
  } catch (error) {
    console.error("Error saat mengambil data tentang:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//visi misi pengunjung
export const getVisimisipengunjung = async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        pname: "visimisi",
        status: "PUBLISH",
      },
    });

    if (profiles.length === 0) {
      return res.status(200).json({
        profile: {
          uuid: "",
          title: "Judul Visi dan Misi",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "visimisi",
        },
      });
    }

    const profileData = profiles[0]; // Ambil elemen pertama dari array jika data ada

    res.status(200).json({ profile: profileData });
  } catch (error) {
    console.error("Error saat mengambil data visi-misi:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//visi misi admin
export const getVisimisi = async (req, res) => {
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

    // Mengambil data profil dengan pname 'visimisi'
    const profiles = await prisma.profile.findMany({
      where: {
        pname: "visimisi",
      },
    });

    // Jika tidak ada data, kirimkan data kosong
    if (profiles.length === 0) {
      return res.status(200).json({
        profile: {
          uuid: "",
          title: "Judul Visi dan Misi",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "visimisi",
        },
      });
    }

    // Kirimkan data dengan menggunakan map untuk memastikan struktur data
    const profileData = profiles.map((profile) => ({
      uuid: profile.uuid || "",
      title: profile.title || "Judul Visi dan Misi",
      content: profile.content || "",
      file_url: profile.file_url || "",
      status: profile.status || "DRAFT",
      pname: profile.pname || "visimisi",
    }))[0]; // Mengambil elemen pertama jika data array

    res.status(200).json({ profile: profileData });
  } catch (error) {
    console.error("Error saat mengambil data visi-misi:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const createVisimisi = async (req, res) => {
  console.log("Uploaded File:", req.file);
  const { title, visionContent, status, pname } = req.body;
  const file = req.file;

  try {
    if (!["DRAFT", "PUBLISH"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Invalid status. Must be DRAFT or PUBLISH." });
    }

    // Cek administrator dari token
    const refreshToken = req.cookies.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const administrator = await prisma.administrator.findUnique({
      where: { id: decoded.administratorId },
    });

    if (!administrator || administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Cek apakah profile dengan pname sudah ada
      const existingProfile = await tx.profile.findFirst({
        where: { pname: pname },
      });

      if (existingProfile) {
        let filePathToDelete = null;

        // Jika ada file baru, tentukan path file lama untuk dihapus
        if (file) {
          if (existingProfile.file_url) {
            filePathToDelete = path.join(
              __dirname,
              "..",
              "uploads",
              path.basename(existingProfile.file_url)
            );
          }
        }

        // Update profile jika sudah ada
        const updatedProfile = await tx.profile.update({
          where: { uuid: existingProfile.uuid },
          data: {
            title,
            content: visionContent,
            file_url: file
              ? `/uploads/${file.filename}`
              : existingProfile.file_url, // Update file URL jika ada file baru
            status,
            updated_at: new Date(), // Update waktu
          },
        });

        // Hapus file lama jika ada file baru dan file lama ditemukan
        if (filePathToDelete && fs.existsSync(filePathToDelete)) {
          fs.unlinkSync(filePathToDelete);
          console.log(`Successfully deleted old file: ${filePathToDelete}`);
        }

        return { type: "update", profile: updatedProfile };
      } else {
        // Create profile jika belum ada
        const newProfile = await tx.profile.create({
          data: {
            title,
            content: visionContent,
            file_url: file ? `/uploads/${file.filename}` : null, // Simpan URL file dengan path yang benar
            pname: pname,
            status,
            createdbyId: administrator.id,
          },
        });
        return { type: "create", profile: newProfile };
      }
    });

    // Mengirimkan response sesuai hasil transaksi
    if (result.type === "update") {
      res
        .status(200)
        .json({ msg: "Profile updated successfully", profile: result.profile });
    } else {
      res
        .status(201)
        .json({ msg: "Profile created successfully", profile: result.profile });
    }
  } catch (error) {
    console.error("Error:", error.message); // Log error untuk debugging
    res.status(500).json({ msg: error.message });
  }
};

//strukturorganisasi pengunjung
export const getStrukturorganisasipengunjung = async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        pname: "strukturorganisasi",
        status: "PUBLISH",
      },
    });

    if (profiles.length === 0) {
      return res.status(200).json({
        profile: {
          uuid: "",
          title: "Judul Struktur Organisasi",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "strukturorganisasi",
        },
      });
    }

    const profileData = profiles[0]; // Ambil elemen pertama dari array jika data ada

    res.status(200).json({ profile: profileData });
  } catch (error) {
    console.error("Error saat mengambil data Struktur organisasi:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//strukturorganisasi misi admin
export const getStrukturorganisasi = async (req, res) => {
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

    // Mengambil data profil dengan pname 'strukturorganisasi'
    const profiles = await prisma.profile.findMany({
      where: {
        pname: "strukturorganisasi",
      },
    });

    // Jika tidak ada data, kirimkan data kosong
    if (profiles.length === 0) {
      return res.status(200).json({
        profile: {
          uuid: "",
          title: "Judul Struktur Organisasi",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "strukturorganisasi",
        },
      });
    }

    // Kirimkan data dengan menggunakan map untuk memastikan struktur data
    const profileData = profiles.map((profile) => ({
      uuid: profile.uuid || "",
      title: profile.title || "Judul Struktur Organisasi",
      content: profile.content || "",
      file_url: profile.file_url || "",
      status: profile.status || "DRAFT",
      pname: profile.pname || "strukturorganisasi",
    }))[0]; // Mengambil elemen pertama jika data array

    res.status(200).json({ profile: profileData });
  } catch (error) {
    console.error("Error saat mengambil data struktur organisasi:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const createStrukturorganisasi = async (req, res) => {
  console.log("Uploaded File:", req.file);
  const { title, visionContent, status, pname } = req.body;
  const file = req.file;

  try {
    if (!["DRAFT", "PUBLISH"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Invalid status. Must be DRAFT or PUBLISH." });
    }

    // Cek administrator dari token
    const refreshToken = req.cookies.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const administrator = await prisma.administrator.findUnique({
      where: { id: decoded.administratorId },
    });

    if (!administrator || administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Cek apakah profile dengan pname sudah ada
      const existingProfile = await tx.profile.findFirst({
        where: { pname: pname },
      });

      if (existingProfile) {
        let filePathToDelete = null;

        // Jika ada file baru, tentukan path file lama untuk dihapus
        if (file) {
          if (existingProfile.file_url) {
            filePathToDelete = path.join(
              __dirname,
              "..",
              "uploads",
              path.basename(existingProfile.file_url)
            );
          }
        }

        // Update profile jika sudah ada
        const updatedProfile = await tx.profile.update({
          where: { uuid: existingProfile.uuid },
          data: {
            title,
            content: visionContent,
            file_url: file
              ? `/uploads/${file.filename}`
              : existingProfile.file_url, // Update file URL jika ada file baru
            status,
            updated_at: new Date(), // Update waktu
          },
        });

        // Hapus file lama jika ada file baru dan file lama ditemukan
        if (filePathToDelete && fs.existsSync(filePathToDelete)) {
          fs.unlinkSync(filePathToDelete);
          console.log(`Successfully deleted old file: ${filePathToDelete}`);
        }

        return { type: "update", profile: updatedProfile };
      } else {
        // Create profile jika belum ada
        const newProfile = await tx.profile.create({
          data: {
            title,
            content: visionContent,
            file_url: file ? `/uploads/${file.filename}` : null, // Simpan URL file dengan path yang benar
            pname: pname,
            status,
            createdbyId: administrator.id,
          },
        });
        return { type: "create", profile: newProfile };
      }
    });

    // Mengirimkan response sesuai hasil transaksi
    if (result.type === "update") {
      res
        .status(200)
        .json({ msg: "Profile updated successfully", profile: result.profile });
    } else {
      res
        .status(201)
        .json({ msg: "Profile created successfully", profile: result.profile });
    }
  } catch (error) {
    console.error("Error:", error.message); // Log error untuk debugging
    res.status(500).json({ msg: error.message });
  }
};

//lembaga pengunjung
export const getLembagapengunjung = async (req, res) => {
  try {
    const lembagaList = await prisma.lembaga.findMany({
      where: {
        status: "PUBLISH", // Only fetch published lembaga
      },
      include: {
        anggota: true, // Include related anggota data
        visi_misi: true, // Include related visi_misi data
        tugas_pokok: true, // Include related tugas_pokok data
      },
    });

    // If no data, return an empty structure with default values
    if (lembagaList.length === 0) {
      return res.status(200).json({
        lembaga: {
          uuid: "",
          nama: "Nama Lembaga",
          singkatan: "",
          dasar_hukum: "",
          alamat_kantor: "",
          file_url: "",
          status: "DRAFT",
          anggota: [],
          visi_misi: [],
          tugas_pokok: [],
        },
      });
    }

    // Return the first lembaga with related data if data exists
    res.status(200).json({ lembaga: lembagaList[0] });
  } catch (error) {
    console.error("Error fetching lembaga:", error.message);
    res.status(500).json({ msg: "An error occurred on the server" });
  }
};

//lembaga admin
export const getLembaga = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Token not found" });
    }

    // Verify and decode the token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const administrator = await prisma.administrator.findUnique({
      where: { id: decoded.administratorId }, // Use decoded ID instead of searching by token
    });

    if (!administrator) {
      return res.status(401).json({ msg: "Administrator not found" });
    }

    if (administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Access denied" });
    }

    // Fetch all lembaga data with related data
    const lembagaList = await prisma.lembaga.findMany({
      include: {
        anggota: true, // Include related anggota data
        visi_misi: true, // Include related visi_misi data
        tugas_pokok: true, // Include related tugas_pokok data
      },
    });

    // Return lembaga data or empty array if none found
    res
      .status(200)
      .json({ lembaga: lembagaList.length > 0 ? lembagaList : [] });
  } catch (error) {
    console.error("Error fetching lembaga:", error.message);
    res.status(500).json({ msg: "An error occurred on the server" });
  }
};

export const createLembaga = async (req, res) => {
  console.log("Uploaded File:", req.file);
  const {
    nama,
    singkatan,
    dasar_hukum,
    alamat_kantor,
    anggota = [],
    visi_misi = [],
    tugas_pokok = [],
  } = req.body;
  const file = req.file;

  try {
    // Cek administrator dari token
    const refreshToken = req.cookies.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const administrator = await prisma.administrator.findUnique({
      where: { id: decoded.administratorId },
    });

    if (!administrator || administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Cek apakah lembaga dengan nama sudah ada
      const existingLembaga = await tx.lembaga.findFirst({
        where: { nama: nama },
      });

      if (existingLembaga) {
        let filePathToDelete = null;

        // Jika ada file baru, tentukan path file lama untuk dihapus
        if (file) {
          if (existingLembaga.file_url) {
            filePathToDelete = path.join(
              __dirname,
              "..",
              "uploads",
              path.basename(existingLembaga.file_url)
            );
          }
        }

        // Update lembaga jika sudah ada
        const updatedLembaga = await tx.lembaga.update({
          where: { uuid: existingLembaga.uuid },
          data: {
            nama,
            singkatan,
            dasar_hukum,
            alamat_kantor,
            file_url: file
              ? `/uploads/${file.filename}`
              : existingLembaga.file_url,
            updated_at: new Date(),
            anggota:
              anggota.length > 0
                ? {
                    connect: anggota.map((id) => ({ id })),
                  }
                : undefined,
            visi_misi:
              visi_misi.length > 0
                ? {
                    create: visi_misi,
                  }
                : undefined,
            tugas_pokok:
              tugas_pokok.length > 0
                ? {
                    create: tugas_pokok,
                  }
                : undefined,
          },
        });

        // Hapus file lama jika ada file baru dan file lama ditemukan
        if (filePathToDelete && fs.existsSync(filePathToDelete)) {
          fs.unlinkSync(filePathToDelete);
          console.log(`Berhasil menghapus file lama: ${filePathToDelete}`);
        }

        return { type: "update", lembaga: updatedLembaga };
      } else {
        // Create lembaga jika belum ada
        const newLembaga = await tx.lembaga.create({
          data: {
            nama,
            singkatan,
            dasar_hukum,
            alamat_kantor,
            file_url: file ? `/uploads/${file.filename}` : null,
            createdbyId: administrator.id,
            anggota:
              anggota.length > 0
                ? {
                    connect: anggota.map((id) => ({ id })),
                  }
                : undefined,
            visi_misi:
              visi_misi.length > 0
                ? {
                    create: visi_misi,
                  }
                : undefined,
            tugas_pokok:
              tugas_pokok.length > 0
                ? {
                    create: tugas_pokok,
                  }
                : undefined,
          },
        });
        return { type: "create", lembaga: newLembaga };
      }
    });

    // Mengirimkan response sesuai hasil transaksi
    if (result.type === "update") {
      res
        .status(200)
        .json({ msg: "Lembaga berhasil diperbarui", lembaga: result.lembaga });
    } else {
      res
        .status(201)
        .json({ msg: "Lembaga berhasil dibuat", lembaga: result.lembaga });
    }
  } catch (error) {
    console.error("Error:", error.message); // Log error untuk debugging
    res.status(500).json({ msg: error.message });
  }
};

//demografi pengunjung
export const getDemografipengunjung = async (req, res) => {
  try {
    const educationCounts = await prisma.demographics.groupBy({
      by: ["education_id"],
      _count: { id: true },
    });

    // Fetch related education details based on the education_ids
    const educationIds = educationCounts
      .map((count) => count.education_id)
      .filter(Boolean); // Make sure to filter out undefined values
    const educationDetails = await prisma.education.findMany({
      where: { id: { in: educationIds } },
    });

    // Combine education data with counts
    const educationCountsWithDetails = educationCounts.map((count) => ({
      education_id: count.education_id,
      count: count._count.id,
      education: educationDetails.find((edu) => edu.id === count.education_id), // Ensure you're matching on the correct property
    }));

    const jobCounts = await prisma.demographics.groupBy({
      by: ["job"],
      _count: { id: true },
    });

    const generateColors = (count) => {
      const colors = [];
      for (let i = 0; i < count; i++) {
        // Generate random RGB color
        const color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 0.6)`; // Adjust alpha as needed
        colors.push(color);
      }
      return colors;
    };

    // Pastikan data jobCounts sudah valid
    try {
      // Mengambil data jumlah berdasarkan pekerjaan
      const jobCounts = await prisma.demographics.groupBy({
        by: ["job"],
        _count: { id: true },
      });
      // Pastikan data jobCounts sudah valid
      if (!jobCounts || jobCounts.length === 0) {
        throw new Error("No job data available.");
      }

      // Mengurutkan pekerjaan berdasarkan jumlah terbesar
      const sortedJobs = jobCounts.sort((a, b) => b._count.id - a._count.id);
      // Mengambil 5 pekerjaan terbesar
      const topJobs = sortedJobs.slice(0, 5);
      // Menghitung jumlah pekerjaan yang lain selain dari top 5
      const otherJobCount = sortedJobs
        .slice(5)
        .reduce((acc, job) => acc + job._count.id, 0);
      // Menambahkan kategori "Others" jika ada pekerjaan selain dari top 5
      const labels = topJobs.map((job) => job.job || "Unknown");
      if (otherJobCount > 0) {
        labels.push("Others");
      }
      // Menyiapkan data untuk Chart
      const jobChartData = {
        labels: labels,
        datasets: [
          {
            data: [
              ...topJobs.map((job) => job._count.id),
              otherJobCount,
            ].filter(
              (count) => count > 0 // Hanya menampilkan data yang lebih dari 0
            ),
            backgroundColor: [...generateColors(topJobs.length), "grey"], // Gunakan fungsi untuk generate warna
          },
        ],
      };
    } catch (error) {
      console.error("Error processing job chart data:", error);
      // Penanganan error
    }

    const religionCounts = await prisma.demographics.groupBy({
      by: ["religion_id"],
      _count: { id: true },
    });

    const religionDetails = await prisma.religion.findMany({
      where: { id: { in: religionCounts.map((r) => r.religion_id) } },
    });

    const religionCountsWithDetails = religionCounts.map((count) => ({
      ...count,
      religion: religionDetails.find((r) => r.id === count.religion_id),
    }));

    const genderCounts = await prisma.demographics.groupBy({
      by: ["gender"],
      _count: { id: true },
    });

    const maritalStatusCounts = await prisma.demographics.groupBy({
      by: ["marital_status"],
      _count: { id: true },
    });

    // Send the response with combined data
    res.json({
      educationCounts: educationCountsWithDetails,
      jobCounts,
      religionCounts: religionCountsWithDetails,
      genderCounts,
      maritalStatusCounts,
    });
  } catch (error) {
    console.error(error);
    // Handle any errors that occur during the process
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//demografi admin
export const getDemografiadmin = async (req, res) => {
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

    const demographics = await prisma.demographics.findMany({
      include: {
        education: true,
        religion: true,
      },
    });

    if (demographics.length === 0) {
      return res.status(200).json({ demographics: [] });
    }

    res.status(200).json({ demographics });
  } catch (error) {
    console.error("Error saat mengambil data demografi untuk admin:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const createDemografi = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    nik,
    name,
    gender,
    birth_date,
    marital_status,
    education_id,
    job,
    rt,
    rw,
    hamlet,
    religion_id,
  } = req.body;

  const file = req.file;
  const parsedEducationId = parseInt(education_id, 10);
  const parsedReligionId = parseInt(religion_id, 10);

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

    // Check for existing demographic by NIK
    const existingDemographic = await prisma.demographics.findUnique({
      where: { nik: nik },
    });

    if (existingDemographic) {
      // If the record already exists, return an error
      return res.status(400).json({
        status: "fail",
        errors: [{ msg: "NIK sudah ada, tidak bisa membuat data baru" }],
      });
    } else {
      // Create new demographic if it doesn't exist
      const newDemographic = await prisma.demographics.create({
        data: {
          nik,
          name,
          gender,
          birth_date: new Date(birth_date),
          marital_status,
          education_id: parsedEducationId,
          job,
          rt,
          rw,
          hamlet,
          religion_id: parsedReligionId,
          file_url: file ? `/uploads/demografi/${file.filename}` : null,
          created_by: administrator.name,
        },
      });

      return res.status(201).json({
        msg: "Demographic created successfully",
        demographic: newDemographic,
      });
    }
  } catch (error) {
    console.error("Error creating demographic:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const updateDemografi = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    nik,
    name,
    gender,
    birth_date,
    marital_status,
    education_id,
    job,
    rt,
    rw,
    hamlet,
    religion_id,
  } = req.body;
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

    const existingDemographic = await prisma.demographics.findUnique({
      where: { nik },
    });
    if (!existingDemographic) {
      return res.status(404).json({ msg: "Demographic not found" });
    }

    let filePathToDelete = null;
    if (file && existingDemographic.file_url) {
      filePathToDelete = path.join(
        __dirname,
        "..",
        "uploads/demografi",
        path.basename(existingDemographic.file_url)
      );
    }

    const updatedDemographic = await prisma.demographics.update({
      where: { nik },
      data: {
        name,
        gender,
        birth_date: new Date(birth_date),
        marital_status,
        education_id: parseInt(education_id, 10),
        job,
        rt,
        rw,
        hamlet,
        religion_id: parseInt(religion_id, 10),
        file_url: file
          ? `/uploads/demografi/${file.filename}`
          : existingDemographic.file_url,
        updated_by: administrator.name,
        updated_at: new Date(),
      },
    });

    if (filePathToDelete && fs.existsSync(filePathToDelete)) {
      fs.unlinkSync(filePathToDelete);
      console.log(`Successfully deleted old file: ${filePathToDelete}`);
    }

    return res.status(200).json({
      msg: "Demographic updated successfully",
      demographic: updatedDemographic,
    });
  } catch (error) {
    console.error("Error creating or updating demographic:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const deleteDemografi = async (req, res) => {
  const { nik } = req.params;

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

    const existingDemographic = await prisma.demographics.findUnique({
      where: { nik },
    });
    if (!existingDemographic) {
      return res.status(404).json({ msg: "Demographic not found" });
    }

    // Delete file if it exists
    const filePathToDelete = path.join(
      __dirname,
      "..",
      "uploads/demografi",
      path.basename(existingDemographic.file_url)
    );

    if (fs.existsSync(filePathToDelete)) {
      fs.unlinkSync(filePathToDelete);
      console.log(`Successfully deleted file: ${filePathToDelete}`);
    }

    // Delete demographic record
    await prisma.demographics.delete({
      where: { nik },
    });

    return res.status(200).json({ msg: "Demographic deleted successfully" });
  } catch (error) {
    console.error("Error deleting demographic:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//batas wilayah
// Get: Ambil semua data batas wilayah (tanpa geography)
export const getBatasWilayahPengunjung = async (req, res) => {
  try {
    const batasWilayah = await prisma.batasWilayah.findMany();

    if (batasWilayah.length === 0) {
      return res.status(200).json({ batasWilayah: [] });
    }

    res.status(200).json({ batasWilayah });
  } catch (error) {
    console.error("Error saat mengambil data batas wilayah:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Admin: Ambil semua data batas wilayah dengan autentikasi
export const getBatasWilayahAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const batasWilayah = await prisma.batasWilayah.findMany();

    if (batasWilayah.length === 0) {
      return res.status(200).json({ batasWilayah: [] });
    }

    res.status(200).json({ batasWilayah });
  } catch (error) {
    console.error(
      "Error saat mengambil data batas wilayah untuk admin:",
      error
    );
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Create: Membuat data batas wilayah baru (tanpa geographyId)
export const createBatasWilayah = async (req, res) => {
  const { kategori, nilai } = req.body;
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Validasi input
    if (!kategori || !nilai) {
      return res.status(400).json({ msg: "Semua field wajib diisi" });
    }

    const newBatasWilayah = await prisma.batasWilayah.create({
      data: {
        kategori,
        nilai,
      },
    });

    res.status(201).json({
      msg: "Batas wilayah berhasil dibuat",
      batasWilayah: newBatasWilayah,
    });
  } catch (error) {
    console.error("Error saat membuat batas wilayah:", error);

    // Handling error spesifik dari Prisma
    if (error.code === "P2002") {
      return res.status(409).json({ msg: "Data batas wilayah sudah ada" });
    }

    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Update: Memperbarui data batas wilayah yang ada
export const updateBatasWilayah = async (req, res) => {
  const { uuid } = req.params; // Mengambil UUID dari URL params
  const { kategori, nilai } = req.body;

  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const existingBatasWilayah = await prisma.batasWilayah.findUnique({
      where: { uuid },
    });

    if (!existingBatasWilayah) {
      return res.status(404).json({ msg: "Batas wilayah tidak ditemukan" });
    }

    const updatedBatasWilayah = await prisma.batasWilayah.update({
      where: { uuid },
      data: {
        kategori,
        nilai,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      msg: "Batas wilayah diperbarui",
      batasWilayah: updatedBatasWilayah,
    });
  } catch (error) {
    console.error("Error saat memperbarui batas wilayah:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Delete: Menghapus data batas wilayah berdasarkan UUID
export const deleteBatasWilayah = async (req, res) => {
  const { uuid } = req.params;

  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const existingBatasWilayah = await prisma.batasWilayah.findUnique({
      where: { uuid },
    });

    if (!existingBatasWilayah) {
      return res.status(404).json({ msg: "Batas wilayah tidak ditemukan" });
    }

    await prisma.batasWilayah.delete({
      where: { uuid },
    });

    res.status(200).json({ msg: "Batas wilayah dihapus dengan sukses" });
  } catch (error) {
    console.error("Error saat menghapus batas wilayah:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//Orbitasi
// Get: Ambil semua data batas wilayah (tanpa geography)
export const getOrbitasiPengunjung = async (req, res) => {
  try {
    const orbitasi = await prisma.orbitasiDesa.findMany();

    if (orbitasi.length === 0) {
      return res.status(200).json({ orbitasi: [] });
    }

    res.status(200).json({ orbitasi });
  } catch (error) {
    console.error("Error saat mengambil data batas wilayah:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Admin: Ambil semua data batas wilayah dengan autentikasi
export const getOrbitasiAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const orbitasi = await prisma.orbitasiDesa.findMany();

    if (orbitasi.length === 0) {
      return res.status(200).json({ orbitasi: [] });
    }

    res.status(200).json({ orbitasi });
  } catch (error) {
    console.error(
      "Error saat mengambil data batas wilayah untuk admin:",
      error
    );
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Create: Membuat data batas wilayah baru (tanpa geographyId)
export const createOrbitasi = async (req, res) => {
  const { kategori, nilai, satuan } = req.body;
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Validasi input
    if (!kategori || !nilai || !satuan) {
      return res.status(400).json({ msg: "Semua field wajib diisi" });
    }

    const newOrbitasi = await prisma.orbitasiDesa.create({
      data: {
        kategori,
        nilai,
        satuan,
      },
    });

    res.status(201).json({
      msg: "Orbitasi berhasil dibuat",
      orbitasi: newOrbitasi,
    });
  } catch (error) {
    console.error("Error saat membuat Orbitasi Desa:", error);

    // Handling error spesifik dari Prisma
    if (error.code === "P2002") {
      return res.status(409).json({ msg: "Data Orbitasi Desa sudah ada" });
    }

    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Update: Memperbarui data batas wilayah yang ada
export const updateOrbitasi = async (req, res) => {
  const { uuid } = req.params; // Mengambil UUID dari URL params
  const { kategori, nilai, satuan } = req.body;

  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const existingOrbitasi = await prisma.orbitasiDesa.findUnique({
      where: { uuid },
    });

    if (!existingOrbitasi) {
      return res.status(404).json({ msg: "Batas wilayah tidak ditemukan" });
    }

    const updatedOrbitasi = await prisma.orbitasiDesa.update({
      where: { uuid },
      data: {
        kategori,
        nilai,
        satuan,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      msg: "Orbitasi Desa diperbarui",
      orbitasi: updatedOrbitasi,
    });
  } catch (error) {
    console.error("Error saat memperbarui batas wilayah:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Delete: Menghapus data batas wilayah berdasarkan UUID
export const deleteOrbitasi = async (req, res) => {
  const { uuid } = req.params;

  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const existingOrbitasi = await prisma.orbitasiDesa.findUnique({
      where: { uuid },
    });

    if (!existingOrbitasi) {
      return res.status(404).json({ msg: "Batas wilayah tidak ditemukan" });
    }

    await prisma.orbitasiDesa.delete({
      where: { uuid },
    });

    res.status(200).json({ msg: "Batas wilayah dihapus dengan sukses" });
  } catch (error) {
    console.error("Error saat menghapus batas wilayah:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};
