export const CustomerService = {
  getData() {
    return [
      {
        id: 1000,
        name: "PERDES RKPDES 2022",
        description:
          "Peraturan Desa Tentang Rencana Kerja Pemerintah Desa Tahun 2022",
        date: "2015-09-13",
        download: "download",
      },
      {
        id: 1001,
        name: "PERDES RKPDES 2023",
        description:
          "Peraturan Desa Tentang Rencana Kerja Pemerintah Desa Tahun 2023",
        date: "2023-09-13",
        download: "download",
      },
      {
        id: 1002,
        name: "PERDES NO 1 SOTK 2024",
        description:
          "Peraturan Desa Tentang SOTK Desa Randusanga Kulon Tahun 2024",
        date: "2024-09-13",
        download: "download",
      },
      {
        id: 1003,
        name: "PERKADES NO.01 PERUBAHAN PENETAPAN KPM BLT DD TA 2024",
        description:
          "Peraturan Kepala Desa Tentang Perubahan Penetapan KPM BLT DD Tahun 2024",
        date: "2024-10-13",
        download: "download",
      },
      {
        id: 1004,
        name: "SK NO.3 TPK KEGIATAN DESA 2024",
        description: "Pengangkatan TPK Kegiatan Desa Tahun 2024",
        date: "2024-11-13",
        download: "download",
      },
      {
        id: 1005,
        name: "SK NO.2 PPKD 2024",
        description: "Pengangkatan PPKD Tahun 2024",
        date: "2024-10-13",
        download: "download",
      },
      {
        id: 1006,
        name: "SK.NO.12. LPM DESA 2024",
        description: "Pengangkatan LPM Desa Tahun 2024",
        date: "2024-10-13",
        download: "download",
      },
      {
        id: 1007,
        name: "SK.NO.11 KELOMPOK NELAYAN LANGGENG JAYA 2024",
        description: "Pengangkatan Kelompok Nelayan Langgeng Jaya 2024",
        date: "2024-10-11",
        download: "download",
      },
      {
        id: 1008,
        name: "SK.NO.9 GURU TK PERTIWI 2024",
        description: "Pengangkatan Guru TK Pertiwi Nur Ilmi",
        date: "2024-10-01",
        download: "download",
      },
      {
        id: 1009,
        name: "SK.NO.8 GURU TK 2024",
        description: "Pengangkatan Guru TK Pertiwi SOKHIFATUN NAJIYAH",
        date: "2024-08-01",
        download: "download",
      },
      {
        id: 1010,
        name: "SK.NO.7 GURU TK MULYANA 2024",
        description: "Pengangkatan Guru TK Pertiwi Mulyana 2024",
        date: "2024-08-01",
        download: "download",
      },
    ];
  },

  getCustomersSmall() {
    return Promise.resolve(this.getData().slice(0, 10));
  },

  getCustomersMedium() {
    return Promise.resolve(this.getData().slice(0, 50));
  },

  getCustomersLarge() {
    return Promise.resolve(this.getData().slice(0, 200));
  },

  getCustomersXLarge() {
    return Promise.resolve(this.getData());
  },

  getCustomers(params) {
    const queryParams = params
      ? Object.keys(params)
          .map(
            (k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k])
          )
          .join("&")
      : "";

    return fetch("/api/data/customers?" + queryParams).then((res) =>
      res.json()
    );
  },
};
