export const EventService = {
  getData() {
    return [
      {
        id: 1,
        title:
          "Pelibatan Komunitas Dalam Pencegahan &amp; Respon Kekerasan Berbasis Gender (KBG)",
        start: "2024-08-06",
        description:
          "Kegiatan penyuluhan dari Kementrian PPA (Pemberdayaan Perempuan dan Perlindungan Anak) DP3KB Kabupaten Brebes yang dilaksanakan di Aula Desa Randusanga Kulon pada hari Selasa tanggal 6 Agustus 2024",
      },
      {
        id: 2,
        title: "Musyawarah dan Raker Panhutri ke-79",
        start: "2024-07-31",
        description:
          "Kegiatan dalam rangka merayakan Hari Kemerdekaan Republik Indonesia Ke-79 yang dilaksanakan di Desa Randusanga Kulon pada hari Rabu tanggal 31 Juli 2024",
      },
      {
        id: 3,
        title: "Sosialisasi Desa Anti Korupsi 2024",
        start: "2017-02-09T16:00:00",
        description:
          "Kegiatan yang di Selenggarakan Inspekstorat Daerah Kabupaten Brebes dalam rangka Perluasan Wilayah Pembangunan Desa Anti di Kabupaten Brebes sesuai SK.Bupati Brebes Nomor: 356/137 Tahun 2024",
      },
      {
        id: 12,
        title: "Click for Google",
        url: "https://www.google.com/",
        start: "2017-02-28",
      },
    ];
  },

  getEvents() {
    return Promise.resolve(this.getData());
  },
};
