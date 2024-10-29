import React, { useEffect, useState } from "react";
import useSWR from "swr"; // Import SWR
// nodejs library that concatenates classes
import classnames from "classnames";
// import { Calendar } from "primereact/calendar";
// import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Carousel } from "primereact/carousel";
import { Card } from "primereact/card";
import { OrderList } from "primereact/orderlist";
import { PhotoService } from "./service/PhotoService";
import Pengumuman from "./Pengumuman";
import Galeri from "./Galeri";
import Berita from "./Berita";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "primeflex/primeflex.css";

// reactstrap components
import {
  CardBody,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.js";

// index page sections
// import Download from "./Download.js";
const fetcher = (url) => fetch(url).then((res) => res.json());

const Landing = () => {
  const [agendas, setAgendas] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  const [selectedAgenda, setSelectedAgenda] = useState(null);

  const handleFocus = () => {
    setNameFocused(true);
  };

  const handleBlur = () => {
    setNameFocused(false);
  };

  const handleEmailFocus = () => {
    setEmailFocused(true);
  };

  const handleEmailBlur = () => {
    setEmailFocused(false);
  };

  const {
    data: agendaData,
    error: agendaError,
    isLoading,
  } = useSWR("http://localhost:5000/agendapengunjung", fetcher);

  useEffect(() => {
    const fetchData = async () => {
      if (agendaData) {
        setAgendas(agendaData.agenda || []); // Gunakan default empty array jika agenda tidak ada
        console.log(agendaData.agenda);
      }

      const photoData = await PhotoService.getImages();
      setPhotos(photoData.slice(0, 9));
    };

    fetchData();
  }, [agendaData]);

  const formattedAgendas = agendas.map((agenda) => ({
    ...agenda,
    formattedDate: new Date(agenda.tanggal_agenda).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  }));

  const itemTemplate = (item) => (
    <div
      className="flex flex-wrap p-2 align-items-center gap-3"
      style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)" }}
      onClick={() => setSelectedAgenda(item)}
    >
      <div className="flex-1 flex flex-column gap-2 xl:mr-8">
        <span className="font-bold">{item.nama_agenda}</span>
        <div className="flex align-items-center gap-2">
          <span>{item.tempat_pelaksanaan}</span>
        </div>
      </div>
      <span className="font-bold text-900">{item.formattedDate}</span>
    </div>
  );

  const photoTemplate = (photo) => (
    <div className="card mb-3">
      <Card
        title={photo.title}
        style={{ boxShadow: "0 12px 20px rgba(0, 0, 0, 0.4)" }}
      >
        <Row className="align-items-start">
          <Col lg="3" className="d-flex">
            <img
              src={photo.itemImageSrc}
              alt={photo.title}
              style={{ width: "200px", height: "300px", objectFit: "cover" }}
            />
            <p>{photo.description}</p>
          </Col>
          <Col lg="9">
            <p style={{ alignSelf: "flex-start" }}>{photo.alt}</p>
          </Col>
        </Row>
      </Card>
    </div>
  );

  const customFilter = (value, filter) => {
    if (!filter) return true;
    return value.toLowerCase().includes(filter.toLowerCase());
  };

  if (isLoading) return <p>Loading...</p>;
  if (agendaError) return <p>{agendaError.message}</p>;

  return (
    <>
      <DemoNavbar />
      <main>
        {/* Pengumuman */}
        <section className="section-shaped">
          <div className="grid">
            <div className="col-12 md:col-12 lg:col-12">
              <Pengumuman />
            </div>
          </div>
        </section>
        {/* agenda kegiatan */}
        <section className="section section-lg section-shaped">
          <div style={{ backgroundColor: "#5dade2" }} className="shape"></div>
          <Container
            className="container-fluid py-lg-md d-flex"
            style={{ minHeight: "500px" }}
          >
            <div className="col px-0">
              <Row>
                <Col lg="10">
                  <h1
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: "700",
                      fontSize: "2.5rem",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                      margin: "0",
                      paddingBottom: "10px",
                      display: "inline-block",
                      borderRadius: "8px",
                      padding: "10px 20px",
                      textShadow: "0px 10px 32px rgba(0, 0, 0, 0.5)",
                    }}
                    className="display-3 text-white"
                  >
                    Agenda Kegiatan
                  </h1>
                </Col>
              </Row>
              <div className="py-5">
                <div className="container">
                  <div className="row g-4">
                    <Row className="justify-content-md-center">
                      <div className="col-lg-6 col-md-6">
                        <OrderList
                          dataKey="id"
                          value={formattedAgendas}
                          onChange={(e) => setAgendas(e.value)}
                          itemTemplate={itemTemplate}
                          header="Agenda Kegiatan"
                          filter
                          filterBy="nama_agenda,tempat_pelaksanaan,formattedDate" // Ganti tanggal_agenda dengan formattedDate
                          filters={{
                            formattedDate: {
                              value: "",
                              matchMode: customFilter,
                            },
                          }} // Custom filter untuk tanggal
                          style={{
                            minWidth:
                              window.innerWidth >= 768 ? "500px" : "auto", // Set minWidth for larger screens
                            width: "100%", // Full width on smaller screens
                          }}
                        />
                      </div>
                      <div
                        className="col-lg-6 col-md-6"
                        style={{
                          position: "absolute",
                          zIndex: 2,
                          left: selectedAgenda
                            ? window.innerWidth < 480
                              ? "0"
                              : "67%"
                            : "auto",
                          transform:
                            selectedAgenda && window.innerWidth >= 480
                              ? "translateX(-50%)"
                              : "none",
                          width: selectedAgenda
                            ? window.innerWidth < 480
                              ? "100%"
                              : "90%"
                            : "100%",
                          maxWidth: "550px",
                          transition: "width 0.3s ease",
                        }}
                      >
                        {selectedAgenda && (
                          <div
                            className="agenda-detail p-3 border rounded shadow-lg"
                            style={{
                              backgroundColor: "#ffffff",
                              color: "#333",
                              position: "relative",
                              minHeight: "514px",
                              height: "514px",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                              }}
                            >
                              <Button
                                icon="pi pi-times"
                                rounded
                                text
                                severity="danger"
                                className="p-button-text"
                                onClick={() => setSelectedAgenda(false)}
                                aria-label="Cancel"
                                style={{
                                  transition:
                                    "background-color 0.3s, border-radius 0.3s",
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor =
                                    "rgba(255, 0, 0, 0.2)";
                                  e.target.style.borderRadius = "50%";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor =
                                    "transparent";
                                  e.target.style.borderRadius = "10px";
                                }}
                              />
                            </div>
                            <h5 className="font-weight-bold text-primary">
                              Informasi
                            </h5>
                            <hr
                              style={{
                                borderTop: "1px solid #ddd",
                                margin: "10px 0",
                              }}
                            />
                            <div style={{ flexGrow: 1 }}>
                              <p>
                                <strong>Nama:</strong>{" "}
                                {selectedAgenda.nama_agenda}
                              </p>
                              <p>
                                <strong>Tempat:</strong>{" "}
                                {selectedAgenda.tempat_pelaksanaan}
                              </p>
                              <p>
                                <strong>Tanggal Mulai:</strong>{" "}
                                {new Date(
                                  selectedAgenda.tanggal_agenda
                                ).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>
                              <p>
                                <strong>Tanggal Selesai:</strong>{" "}
                                {new Date(
                                  selectedAgenda.tanggal_akhir_agenda
                                ).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>
                              <div
                                style={{
                                  flexGrow: 1,
                                  overflowY: "auto",
                                  overflowX: "hidden",
                                  wordBreak: "break-word",
                                  paddingRight: "10px",
                                  marginTop: "15px", // Menambahkan margin atas untuk jarak
                                }}
                              >
                                <p>
                                  <strong>Deskripsi:</strong>{" "}
                                  {selectedAgenda.deskripsi}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="col-lg-6 col-md-6">
                        {!selectedAgenda && (
                          <div
                            className="service-item rounded d-flex h-100"
                            style={{
                              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                              position: "relative",
                            }}
                          >
                            <div
                              className="service-img rounded"
                              style={{
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                              }}
                            >
                              <img
                                className="img-fluid"
                                src={require("assets/img/theme/petadesa.png")}
                                alt="Peta Desa"
                                style={{ borderRadius: "inherit" }}
                              />
                            </div>
                            <div
                              className="service-text rounded p-2"
                              style={{
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                                position: "relative",
                              }}
                            >
                              <h4 className="mb-3">Peta Desa</h4>
                              <p className="mb-4">
                                Wilayah Desa meliputi wilayah RT, wilayah RW,
                                Balai RT, Balai RW, Masjid, Lapangan Desa.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
        {/* Potensi */}
        <div className="position-relative">
          <section className="section section-lg section-shaped ">
            <div style={{ backgroundColor: "#45b39d" }} className="shape"></div>
            <Container className="py-lg-md d-flex">
              <div className="col px-0">
                <Row>
                  <Col lg="8">
                    <h1
                      style={{
                        fontFamily: "'Poppins', sans-serif", // Font modern populer
                        fontWeight: "700", // Tebal
                        fontSize: "2.5rem", // Ukuran font besar untuk judul
                        letterSpacing: "1.5px", // Spasi antar huruf untuk kesan modern
                        textTransform: "uppercase", // Huruf kapital semua
                        color: "#FFFFFF", // Warna teks putih untuk kontras yang tinggi dengan background oranye
                        margin: "0", // Menghilangkan margin default
                        paddingBottom: "10px", // Memberikan sedikit ruang di bawah judul
                        display: "inline-block", // Untuk mengatur garis bawah agar tidak full width
                        borderRadius: "8px", // Rounded corners pada elemen h1 jika diinginkan
                        padding: "10px 20px", // Padding di dalam h1
                        textShadow: "0px 10px 32px rgba(0, 0, 0, 0.5)", // Shadow untuk teks
                      }}
                    >
                      Potensi Desa{" "}
                    </h1>{" "}
                  </Col>
                </Row>
                <Row>
                  <Col lg="10"></Col>
                  <Col lg="2">
                    <div className="align-items-end mt-2">
                      <Button
                        block
                        className="btn-white"
                        color="default"
                        href="https://www.creative-tim.com/product/argon-design-system-react?ref=adsr-landing-page"
                        size="lg"
                      >
                        Hubungi Kami
                      </Button>
                    </div>
                  </Col>
                </Row>
                <div className="py-5">
                  <div className="container">
                    <div className="row g-4">
                      <Row className="justify-content-md-center">
                        <div className="col-lg-4 col-md-6 mt-2">
                          <div
                            className="service-item rounded d-flex h-100"
                            style={{
                              boxShadow: "0 12px 24px rgba(0, 0, 0, 0.4)",
                              position: "relative",
                            }}
                          >
                            <div
                              className="service-img rounded"
                              style={{
                                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)", // Bayangan tebal pada gambar
                              }}
                            >
                              <img
                                className="img-fluid"
                                src={require("assets/img/theme/udangvaname.jpg")}
                                alt=""
                                style={{ borderRadius: "inherit" }}
                              />
                            </div>
                            <div
                              className="service-text rounded p-2"
                              style={{
                                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)", // Bayangan tebal pada teks
                                position: "relative",
                              }}
                            >
                              <div className="p-button p-button-icon-only p-button-outlined p-button-rounded p-button-info mb-3">
                                <img
                                  alt="icon"
                                  className="img-fluid shadow"
                                  src={require("assets/img/theme/icon-1.png")}
                                  style={{
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                                  }}
                                />
                              </div>
                              <h4 className="mb-3">Udang Vaname</h4>
                              <p className="mb-4">
                                Spesies ini telah menyebar luas dan
                                dibudidayakan di berbagai negara, termasuk
                                Indonesia, karena adaptabilitasnya yang tinggi
                                dan tingkat pertumbuhan yang cepat..{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6 mt-2">
                          <div
                            className="service-item rounded d-flex h-100"
                            style={{
                              boxShadow: "0 12px 24px rgba(0, 0, 0, 0.4)",
                              position: "relative",
                            }}
                          >
                            <div
                              className="service-img rounded"
                              style={{
                                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)", // Bayangan tebal pada gambar
                              }}
                            >
                              <img
                                className="img-fluid"
                                src={require("assets/img/theme/keranghijau.jpg")}
                                alt=""
                                style={{ borderRadius: "inherit" }}
                              />
                            </div>
                            <div
                              className="service-text rounded p-2"
                              style={{
                                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)", // Bayangan tebal pada teks
                                position: "relative",
                              }}
                            >
                              <div className="p-button p-button-icon-only p-button-outlined p-button-rounded p-button-info mb-3">
                                <img
                                  alt="icon"
                                  className="img-fluid shadow"
                                  src={require("assets/img/theme/icon-2.png")}
                                  style={{
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                                  }}
                                />
                              </div>
                              <h4 className="mb-3">Kerang Hijau</h4>
                              <p className="mb-4">
                                Kerang hijau berasal dari perairan tropis dan
                                subtropis di Indo-Pasifik, khususnya kawasan
                                Asia Tenggara seperti Indonesia, Malaysia, dan
                                Filipina..{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6 mt-2">
                          <div
                            className="service-item rounded d-flex h-100"
                            style={{
                              boxShadow: "0 12px 24px rgba(0, 0, 0, 0.4)",
                              position: "relative",
                            }}
                          >
                            <div
                              className="service-img rounded"
                              style={{
                                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)", // Bayangan tebal pada gambar
                              }}
                            >
                              <img
                                className="img-fluid"
                                src={require("assets/img/theme/ikanbandeng.jpg")}
                                alt=""
                                style={{ borderRadius: "inherit" }}
                              />
                            </div>
                            <div
                              className="service-text rounded p-2"
                              style={{
                                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)", // Bayangan tebal pada teks
                                position: "relative",
                              }}
                            >
                              <div className="p-button p-button-icon-only p-button-outlined p-button-rounded p-button-info mb-3">
                                <img
                                  alt="icon"
                                  className="img-fluid shadow"
                                  src={require("assets/img/theme/icon-3.png")}
                                  style={{
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                                  }}
                                />
                              </div>
                              <h4 className="mb-3">Ikan Bandeng</h4>
                              <p className="mb-4">
                                Ikan bandeng merupakan spesies asli dari Samudra
                                Hindia dan Pasifik. Ikan ini telah lama
                                dibudidayakan di Asia Tenggara, khususnya di
                                Indonesia, Filipina, dan Taiwan..{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Row>
                      <Row className="justify-content-md-center mt-10">
                        <div className="col-lg-4 col-md-6 mt-2">
                          <div
                            className="service-item rounded d-flex h-100"
                            style={{
                              boxShadow: "0 12px 24px rgba(0, 0, 0, 0.4)",
                              position: "relative",
                            }}
                          >
                            <div
                              className="service-img rounded"
                              style={{
                                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)", // Bayangan tebal pada gambar
                              }}
                            >
                              <img
                                className="img-fluid"
                                src={require("assets/img/theme/rumputlaut.jpg")}
                                alt=""
                                style={{ borderRadius: "inherit" }}
                              />
                            </div>
                            <div
                              className="service-text rounded p-2"
                              style={{
                                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)", // Bayangan tebal pada teks
                                position: "relative",
                              }}
                            >
                              <div className="p-button p-button-icon-only p-button-outlined p-button-rounded p-button-info mb-3">
                                <img
                                  alt="icon"
                                  className="img-fluid shadow"
                                  src={require("assets/img/theme/icon-4.png")}
                                  style={{
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                                  }}
                                />
                              </div>
                              <h4 className="mb-3">Rumput Laut</h4>
                              <p className="mb-4">
                                Di Indonesia, rumput laut seperti Eucheuma
                                cottonii dan Gracilaria telah menjadi komoditas
                                penting sejak dekade-dekade terakhir.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6 mt-2">
                          <div
                            className="service-item rounded d-flex h-100"
                            style={{
                              boxShadow: "0 12px 24px rgba(0, 0, 0, 0.4)",
                              position: "relative",
                            }}
                          >
                            <div
                              className="service-img rounded"
                              style={{
                                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)", // Bayangan tebal pada gambar
                              }}
                            >
                              <img
                                className="img-fluid"
                                src={require("assets/img/theme/wisatapemancingan.jpg")}
                                alt=""
                                style={{ borderRadius: "inherit" }}
                              />
                            </div>
                            <div
                              className="service-text rounded p-2"
                              style={{
                                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)", // Bayangan tebal pada teks
                                position: "relative",
                              }}
                            >
                              <div className="p-button p-button-icon-only p-button-outlined p-button-rounded p-button-info mb-3">
                                <img
                                  alt="icon"
                                  className="img-fluid shadow"
                                  src={require("assets/img/theme/icon-5.png")}
                                  style={{
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                                  }}
                                />
                              </div>
                              <h4 className="mb-3">Wisata Pemancingan</h4>
                              <p className="mb-4">
                                Di Indonesia, rumput laut seperti Eucheuma
                                cottonii dan Gracilaria telah menjadi komoditas
                                penting sejak dekade-dekade terakhir.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6 mt-2">
                          <div
                            className="service-item rounded d-flex h-100"
                            style={{
                              boxShadow: "0 12px 24px rgba(0, 0, 0, 0.4)",
                              position: "relative",
                            }}
                          >
                            <div
                              className="service-img rounded"
                              style={{
                                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)", // Bayangan tebal pada gambar
                              }}
                            >
                              <img
                                className="img-fluid"
                                src={require("assets/img/theme/wisatapantai.jpg")}
                                alt=""
                                style={{ borderRadius: "inherit" }}
                              />
                            </div>
                            <div
                              className="service-text rounded p-2"
                              style={{
                                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)", // Bayangan tebal pada teks
                                position: "relative",
                              }}
                            >
                              <div className="p-button p-button-icon-only p-button-outlined p-button-rounded p-button-info mb-3">
                                <img
                                  alt="icon"
                                  className="img-fluid shadow"
                                  src={require("assets/img/theme/icon-6.png")}
                                  style={{
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                                  }}
                                />
                              </div>
                              <h4 className="mb-3">Wisata Pantai</h4>
                              <p className="mb-4">
                                Di Indonesia, rumput laut seperti Eucheuma
                                cottonii dan Gracilaria telah menjadi komoditas
                                penting sejak dekade-dekade terakhir.
                              </p>
                            </div>
                          </div>
                        </div>
                      </Row>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
            {/* SVG separator */}
          </section>
        </div>
        {/* Galeri dan Berita */}
        <section className="section section-lg section-shaped">
          <Container
            className="container-fluid py-lg-md d-flex"
            style={{
              minHeight: "500px",
              paddingLeft: "0", // Hilangkan padding di kiri
              paddingRight: "0",
              margin: "0", // Pastikan tidak ada margin
              width: "100vw", // Buat lebar selebar layar
              maxWidth: "100%",
              marginBottom: "0", // Menghilangkan margin bawah
              paddingBottom: "0", // Menghilangkan padding bawah
            }}
          >
            <div
              className="grid p-3"
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap", // Pastikan bisa wrap di layar kecil
                width: "100%",
                margin: "0",
                alignItems: "stretch",
              }}
            >
              {/* Galeri di kiri */}
              <div
                className="col-12 md:col-8 lg:col-9"
                style={{
                  flex: "1 1 60%",
                  width: "60%", // Menyisakan 30% untuk berita
                  margin: "0", // Hilangkan margin di sekitar
                  padding: "0", // Hilangkan padding di sekitar
                  maxWidth: "none",
                  flexDirection: "column",
                }}
              >
                <Galeri />
              </div>

              {/* Berita di kanan */}
              <div
                className="col-12 md:col-4 lg:col-3"
                style={{
                  width: "40%",
                  paddingLeft: "10px",
                  minWidth: "300px",
                  marginBottom: "0", // Menghilangkan margin bawah
                  paddingBottom: "0", // Menghilangkan padding bawah
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                }}
              >
                <Berita />
              </div>
            </div>
          </Container>
        </section>
        {/* pegawai */}
        <section className="lg-12">
          <div className="py-5 bg-secondary">
            <Container fluid>
              {/* Inputs (alternative) */}
              <div className="card">
                <Carousel
                  value={photos}
                  numVisible={1}
                  numScroll={1}
                  circular
                  autoplayInterval={5000}
                  itemTemplate={photoTemplate}
                  responsiveOptions={[
                    {
                      breakpoint: "1024px",
                      numVisible: 1,
                      numScroll: 1,
                    },
                    {
                      breakpoint: "768px",
                      numVisible: 1,
                      numScroll: 1,
                    },
                    {
                      breakpoint: "560px",
                      numVisible: 1,
                      numScroll: 1,
                    },
                  ]}
                />
              </div>
            </Container>
          </div>
        </section>
        {/* saran dan kritik */}
        <section className="section section-lg bg-gradient-default ">
          <Container className="pt-lg pb-100"></Container>
          {/* SVG separator */}
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon className="fill-white" points="2560 0 2560 100 0 100" />
            </svg>
          </div>
        </section>
        <section className="section section-lg pt-lg-0 section-contact-us">
          <Container>
            <Row className="justify-content-center mt--300">
              <Col lg="8">
                <Card className="bg-gradient-secondary shadow">
                  <CardBody className="p-lg-5">
                    <h4 className="mb-1">Saran dan Kritik</h4>
                    <p className="mt-0">Suaramu akan membantu perbaikan.</p>
                    <FormGroup
                      className={classnames("mt-5", { focused: nameFocused })}
                    >
                      <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-user-run" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Your name"
                          type="text"
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                        />
                      </InputGroup>
                    </FormGroup>
                    <FormGroup
                      className={classnames({
                        focused: emailFocused,
                      })}
                    >
                      <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-email-83" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Email address"
                          type="email"
                          onFocus={handleEmailFocus}
                          onBlur={handleEmailBlur}
                        />
                      </InputGroup>
                    </FormGroup>
                    <FormGroup className="mb-4">
                      <Input
                        className="form-control-alternative"
                        cols="80"
                        name="name"
                        placeholder="Type a message..."
                        rows="4"
                        type="textarea"
                      />
                    </FormGroup>
                    <div>
                      <Button
                        block
                        className="btn-round"
                        color="default"
                        size="lg"
                        type="button"
                      >
                        Send Message
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </>
  );
};

export default Landing;
