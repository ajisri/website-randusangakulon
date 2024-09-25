import kepaladesa from "../../../assets/img/theme/kepaladesa.jpeg";
import sekdesa from "../../../assets/img/theme/sekdesa.jpeg";
import kasipemerintahan from "../../../assets/img/theme/kasipemerintahan.jpeg";
import kaurperencanaan from "../../../assets/img/theme/kaurperencanaan.jpeg";
import kasikesejahteraan from "../../../assets/img/theme/kasikesejahteraan.jpeg";
import kaurumum from "../../../assets/img/theme/kaurumum.jpeg";
import kaurkeuangan from "../../../assets/img/theme/kaurkeuangan.jpeg";
import kasipelayanan from "../../../assets/img/theme/kasipelayanan.jpeg";
import kadussatu from "../../../assets/img/theme/kadussatu.jpeg";
import kadusdua from "../../../assets/img/theme/kadusdua.jpeg";
import kadustiga from "../../../assets/img/theme/kadustiga.jpeg";
export const PhotoService = {
  getData() {
    return [
      {
        itemImageSrc: kepaladesa,
        alt: "Kepala Desa bertugas menyelenggarakan Pemerintahan Desa, melaksanakan pembangunan Desa, pembinaan kemasyarakatan Desa, dan pemberdayaan masyarakat Desa.",
        title: "Kepala Desa",
      },
      {
        itemImageSrc: sekdesa,
        alt: "Sekretaris Desa adalah pimpinan Sekretariat Desa yang membantu Kepala Desa dalam administrasi pemerintahan. Tugasnya meliputi urusan ketatausahaan, umum, keuangan, dan perencanaan desa. Selain itu, Sekretaris Desa juga bertanggung jawab atas pengelolaan administrasi desa serta pelaksanaan tugas lain yang diberikan oleh Kepala Desa. Fungsi utama Sekretaris Desa mencakup pengurusan administrasi surat menyurat, keuangan, perencanaan anggaran, dan penyusunan laporan.",
        title: "Sekretaris Desa",
      },
      {
        itemImageSrc: kasipemerintahan,
        alt: "Kepala Urusan Pemerintahan adalah pelaksana teknis di bidang pemerintahan yang membantu Kepala Desa dalam operasional pemerintahan. Tugasnya meliputi manajemen tata praja, penyusunan regulasi desa, dan pembinaan masalah pertanahan, ketenteraman, serta ketertiban masyarakat desa. Kepala Urusan juga bertanggung jawab atas upaya perlindungan masyarakat, pembinaan kependudukan, serta penataan dan pengelolaan wilayah desa. Selain itu, ia mengelola Profil Desa dan melaksanakan tugas kedinasan lain yang diberikan oleh atasan. Semua tugas ini dilakukan untuk mendukung fungsi pemerintahan desa secara keseluruhan.",
        title: "Kasi Pemerintahan",
      },
      {
        itemImageSrc: kaurperencanaan,
        alt: "Kepala Urusan Perencanaan adalah staf sekretariat yang membantu Sekretaris Desa dalam urusan administrasi pemerintahan. Tugas utamanya meliputi koordinasi perencanaan desa, penyusunan RAPBDes, serta inventarisasi data pembangunan desa. Kepala Urusan Perencanaan juga bertanggung jawab atas monitoring dan evaluasi program pemerintah desa, serta penyusunan RPJMDesa dan RKPDesa. Selain itu, ia menyusun laporan kegiatan desa dan melaksanakan tugas-tugas kedinasan lain yang diberikan oleh atasan. Semua fungsi ini dilakukan untuk mendukung perencanaan dan pelaksanaan pembangunan di desa.",
        title: "Kaur Perencanaan",
      },
      {
        itemImageSrc: kasikesejahteraan,
        alt: "Description for Image 5",
        title: "Kasi Kesejahteraan",
      },
      {
        itemImageSrc: kaurumum,
        alt: "Description for Image 6",
        title: "Kaur Umum",
      },
      {
        itemImageSrc: kaurkeuangan,
        alt: "Description for Image 7",
        title: "Kaur Keuangan",
      },
      {
        itemImageSrc: kasipelayanan,
        alt: "Description for Image 8",
        title: "Kasi Pelayanan",
      },
      {
        itemImageSrc: kadussatu,
        alt: "Description for Image 9",
        title: "Kadus I",
      },
      {
        itemImageSrc: kadusdua,
        alt: "Description for Image 10",
        title: "Kadus II",
      },
      {
        itemImageSrc: kadustiga,
        alt: "Description for Image 11",
        title: "Kadus III",
      },
    ];
  },

  getImages() {
    return Promise.resolve(this.getData());
  },
};
