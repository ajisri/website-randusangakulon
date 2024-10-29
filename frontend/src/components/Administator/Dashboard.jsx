import React, { useState, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { Ripple } from "primereact/ripple";
import axios from "axios";
import { jwtDecode as jwt_decode } from "jwt-decode"; // Import as default
import { useNavigate } from "react-router-dom";
// Profil
import Tentang from "./Profil/Tentang";
import Sejarah from "./Profil/Sejarah";
import Demografi from "./Profil/Demografi";
import Lembaga from "./Profil/Lembaga";
import Strukturorganisasi from "./Profil/Strukturorganisasi";
import Visimisi from "./Profil/Visimisi";
// import Geografi from "./Profil/Geografi";
import BatasWilayah from "./Profil/BatasWilayah";
import Orbitasi from "./Profil/Orbitasi";
import JenisLahan from "./Profil/JenisLahan";
import PotensiWisata from "./Profil/PotensiWisata";
// Layanan
import Aktakelahiran from "./Layanan/Aktakelahiran";
import Kartukeluarga from "./Layanan/Kartukeluarga";
import Kartutandapenduduk from "./Layanan/Kartutandapenduduk";
import Pembuatansktm from "./Layanan/Pembuatansktm";
import Pendaftarannikah from "./Layanan/Pendaftarannikah";
import Aktifasibpjs from "./Layanan/Aktifasibpjs";
//Transparansi
import Produkhukum from "./Transparansi/ProdukHukum";
//sosial
import Agenda from "./Social/Agenda";
import Pengumuman from "./Social/Pengumuman";
import Galeri from "./Social/Galeri";
import Berita from "./Social/Berita";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./Sidebar.css";

const Dashboard = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const navigate = useNavigate();
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isProfilSubmenuVisible, setProfilSubmenuVisible] = useState(false);
  const [isLayananSubmenuVisible, setLayananSubmenuVisible] = useState(false);
  const [isTransparansiSubmenuVisible, setTransparansiSubmenuVisible] =
    useState(false);
  const [isSocialSubmenuVisible, setSocialSubmenuVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Tentang");
  const toggleProfilSubmenu = () =>
    setProfilSubmenuVisible(!isProfilSubmenuVisible);
  const [isGeografiSubmenuVisible, setGeografiSubmenuVisible] = useState(false);
  const toggleGeografiSubmenu = () =>
    setGeografiSubmenuVisible(!isGeografiSubmenuVisible);
  const toggleLayananSubmenu = () =>
    setLayananSubmenuVisible(!isLayananSubmenuVisible);
  const toggleTransparansiSubmenu = () =>
    setTransparansiSubmenuVisible(!isTransparansiSubmenuVisible);
  const toggleSocialSubmenu = () =>
    setSocialSubmenuVisible(!isSocialSubmenuVisible);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("http://localhost:5000/token");
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setExpire(decoded.exp);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const checkToken = async () => {
      try {
        await refreshToken(); // Panggil fungsi untuk memperbarui token jika ada
      } catch (error) {
        navigate("/"); // Redirect ke halaman login jika token tidak valid
      }
    };
    checkToken();
  }, [navigate]);

  const renderContent = () => {
    switch (activeMenu) {
      case "Tentang":
        return <Tentang />;
      case "Sejarah":
        return <Sejarah />;
      case "Demografi":
        return <Demografi />;
      case "Lembaga":
        return <Lembaga />;
      case "Strukturorganisasi":
        return <Strukturorganisasi />;
      case "Visimisi":
        return <Visimisi />;
      // case "Geografi":
      //   return <Geografi />;
      case "BatasWilayah":
        return <BatasWilayah />;
      case "Orbitasi":
        return <Orbitasi />;
      case "JenisLahan":
        return <JenisLahan />;
      case "PotensiWisata":
        return <PotensiWisata />;
      case "Aktakelahiran":
        return <Aktakelahiran />;
      case "Aktifasibpjs":
        return <Aktifasibpjs />;
      case "Kartukeluarga":
        return <Kartukeluarga />;
      case "Kartutandapenduduk":
        return <Kartutandapenduduk />;
      case "Pembuatansktm":
        return <Pembuatansktm />;
      case "Pendaftarannikah":
        return <Pendaftarannikah />;
      case "Produkhukum":
        return <Produkhukum />;
      case "Agenda":
        return <Agenda />;
      case "Pengumuman":
        return <Pengumuman />;
      case "Galeri":
        return <Galeri />;
      case "Berita":
        return <Berita />;
      default:
        return <Tentang />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        visible={true}
        onHide={() => {}}
        dismissable={false}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        showCloseIcon={false}
        className="my-sidebar"
        style={{
          width: isSidebarHovered ? "300px" : "60px",
          background: "#ffffff",
          paddingLeft: isSidebarHovered ? "1rem" : "0",
          zIndex: 1,
        }}
      >
        <div
          onClick={toggleProfilSubmenu}
          className="menu-item"
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            padding: "10px",
            paddingLeft: "5px",
          }}
        >
          <i className="pi pi-fw pi-user" style={{ marginRight: "20px" }}></i>
          {isSidebarHovered && <span>Profil</span>}
          <i
            className={`pi pi-fw ${
              isProfilSubmenuVisible ? "pi-chevron-down" : "pi-chevron-right"
            }`}
            style={{ marginLeft: "auto" }}
          ></i>
          <Ripple />
        </div>
        {isSidebarHovered && isProfilSubmenuVisible && (
          <div
            className="submenu"
            style={{ marginLeft: "20px", marginBottom: "10px" }}
          >
            <div
              onClick={() => setActiveMenu("Tentang")}
              className="menu-item"
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-info-circle"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>Tentang</span>}
              <Ripple />
            </div>
            <div
              onClick={() => setActiveMenu("Sejarah")}
              className="menu-item"
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-book"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>Sejarah</span>}
              <Ripple />
            </div>
            <div
              onClick={() => setActiveMenu("Visimisi")}
              className="menu-item"
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-bullseye"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>Visi dan Misi</span>}
              <Ripple />
            </div>
            <div
              onClick={() => setActiveMenu("Strukturorganisasi")}
              className="menu-item"
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-sitemap"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>Struktur Organisasi</span>}
              <Ripple />
            </div>
            <div
              onClick={() => setActiveMenu("Lembaga")}
              className="menu-item"
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-building"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>Lembaga</span>}
              <Ripple />
            </div>

            <div
              onClick={toggleGeografiSubmenu}
              className="menu-item"
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                padding: "10px",
                paddingLeft: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-globe"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>Geografi</span>}
              <i
                className={`pi pi-fw ${
                  isGeografiSubmenuVisible
                    ? "pi-chevron-down"
                    : "pi-chevron-right"
                }`}
                style={{ marginLeft: "auto" }}
              ></i>
              <Ripple />
            </div>
            {isSidebarHovered && isGeografiSubmenuVisible && (
              <div
                className="submenu"
                style={{ marginLeft: "20px", marginBottom: "10px" }}
              >
                <div
                  onClick={() => setActiveMenu("BatasWilayah")}
                  className="menu-item"
                  style={{
                    marginBottom: "10px",
                    cursor: "pointer",
                    padding: "10px",
                  }}
                >
                  <i
                    className="pi pi-fw pi-map"
                    style={{ marginRight: "10px" }}
                  ></i>
                  {isSidebarHovered && <span>Batas Wilayah</span>}
                  <Ripple />
                </div>
                <div
                  onClick={() => setActiveMenu("Orbitasi")}
                  className="menu-item"
                  style={{
                    marginBottom: "10px",
                    cursor: "pointer",
                    padding: "10px",
                  }}
                >
                  <i
                    className="pi pi-fw pi-compass"
                    style={{ marginRight: "10px" }}
                  ></i>
                  {isSidebarHovered && <span>Orbitasi Desa</span>}
                  <Ripple />
                </div>
                <div
                  onClick={() => setActiveMenu("JenisLahan")}
                  className="menu-item"
                  style={{
                    marginBottom: "10px",
                    cursor: "pointer",
                    padding: "10px",
                  }}
                >
                  <i
                    className="pi pi-fw pi-map-marker"
                    style={{ marginRight: "10px" }}
                  ></i>
                  {isSidebarHovered && <span>Jenis Lahan</span>}
                  <Ripple />
                </div>

                <div
                  onClick={() => setActiveMenu("PotensiWisata")}
                  className="menu-item"
                  style={{
                    marginBottom: "10px",
                    cursor: "pointer",
                    padding: "10px",
                  }}
                >
                  <i
                    className="pi pi-fw pi-map"
                    style={{ marginRight: "10px" }}
                  ></i>
                  {isSidebarHovered && <span>Potensi Wisata</span>}
                  <Ripple />
                </div>
              </div>
            )}

            <div
              onClick={() => setActiveMenu("Demografi")}
              className="menu-item"
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-database"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>Demografi</span>}
              <Ripple />
            </div>
          </div>
        )}

        <div
          onClick={toggleLayananSubmenu}
          className="menu-item"
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            padding: "10px",
            paddingLeft: "5px",
          }}
        >
          <i
            className="pi pi-fw pi-briefcase"
            style={{ marginRight: "20px" }}
          ></i>
          {isSidebarHovered && <span>Layanan</span>}
          <i
            className={`pi pi-fw ${
              isLayananSubmenuVisible ? "pi-chevron-down" : "pi-chevron-right"
            }`}
            style={{ marginLeft: "auto" }}
          ></i>
          <Ripple />
        </div>
        {isSidebarHovered && isLayananSubmenuVisible && (
          <div
            className="submenu"
            style={{ marginLeft: "20px", marginBottom: "10px" }}
          >
            <div
              onClick={() => setActiveMenu("Aktakelahiran")}
              className="menu-item"
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-file"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>Akta Kelahiran</span>}
              <Ripple />
            </div>
            <div
              onClick={() => setActiveMenu("Kartukeluarga")}
              className="menu-item"
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-id-card"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>Kartu Keluarga</span>}
              <Ripple />
            </div>
            <div
              onClick={() => setActiveMenu("Kartutandapenduduk")}
              className="menu-item"
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-id-card"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>Kartu Tanda Penduduk</span>}
              <Ripple />
            </div>
            <div
              onClick={() => setActiveMenu("Pendaftarannikah")}
              className="menu-item"
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-heart"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>Pendaftaran Nikah</span>}
              <Ripple />
            </div>
            <div
              onClick={() => setActiveMenu("Aktifasibpjs")}
              className="menu-item"
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-book"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>Aktifasi BPJS PBI-JKN</span>}
              <Ripple />
            </div>
            <div
              onClick={() => setActiveMenu("Pembuatansktm")}
              className="menu-item"
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-envelope"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>Pembuatan SKTM</span>}
              <Ripple />
            </div>
          </div>
        )}

        <div
          onClick={toggleTransparansiSubmenu}
          className="menu-item"
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            padding: "10px",
            paddingLeft: "5px",
          }}
        >
          <i
            className="pi pi-fw pi-info-circle"
            style={{ marginRight: "20px" }}
          ></i>
          {isSidebarHovered && <span>Transparansi</span>}
          <i
            className={`pi pi-fw ${
              isTransparansiSubmenuVisible
                ? "pi-chevron-down"
                : "pi-chevron-right"
            }`}
            style={{ marginLeft: "auto" }}
          ></i>
          <Ripple />
        </div>
        {isSidebarHovered && isTransparansiSubmenuVisible && (
          <div
            className="submenu"
            style={{ marginLeft: "20px", marginBottom: "10px" }}
          >
            <div
              className="menu-item"
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-cog"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>Desa Ankor</span>}
              <Ripple />
            </div>
            <div
              onClick={() => setActiveMenu("Produkhukum")}
              className="menu-item"
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-file"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>Produk Hukum</span>}
              <Ripple />
            </div>
            <div
              className="menu-item"
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-dollar"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>APB Desa</span>}
              <Ripple />
            </div>
            <div
              className="menu-item"
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-download"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>Download</span>}
              <Ripple />
            </div>
          </div>
        )}

        <div
          onClick={toggleSocialSubmenu}
          className="menu-item"
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            padding: "10px",
            paddingLeft: "5px",
          }}
        >
          <i
            className="pi pi-fw pi-desktop"
            style={{ marginRight: "20px" }}
          ></i>
          {isSidebarHovered && <span>Social</span>}
          <i
            className={`pi pi-fw ${
              isSocialSubmenuVisible ? "pi-chevron-down" : "pi-chevron-right"
            }`}
            style={{ marginLeft: "auto" }}
          ></i>
          <Ripple />
        </div>
        {isSidebarHovered && isSocialSubmenuVisible && (
          <div
            className="submenu"
            style={{ marginLeft: "20px", marginBottom: "10px" }}
          >
            <div
              onClick={() => setActiveMenu("Agenda")}
              className="menu-item"
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-calendar-clock"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>Agenda</span>}
              <Ripple />
            </div>
            <div
              onClick={() => setActiveMenu("Pengumuman")}
              className="menu-item"
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-bell"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>Pengumuman</span>}
              <Ripple />
            </div>
            <div
              onClick={() => setActiveMenu("Galeri")}
              className="menu-item"
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-images"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>Galeri</span>}
              <Ripple />
            </div>
            <div
              onClick={() => setActiveMenu("Berita")}
              className="menu-item"
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-book"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>Berita</span>}
              <Ripple />
            </div>
            <div
              className="menu-item"
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <i
                className="pi pi-fw pi-download"
                style={{ marginRight: "10px" }}
              ></i>
              {isSidebarHovered && <span>Download</span>}
              <Ripple />
            </div>
          </div>
        )}
      </Sidebar>

      <div
        className="content"
        style={{
          marginLeft: isSidebarHovered ? "300px" : "60px",
          transition: "margin-left 0.3s ease",
          padding: "20px",
          width: "100%",
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
