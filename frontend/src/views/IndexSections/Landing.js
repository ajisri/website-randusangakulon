/*!

=========================================================
* Argon Design System React - v1.1.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library that concatenates classes
import classnames from "classnames";
// import { Calendar } from "primereact/calendar";
import { Link } from "react-router-dom";

import { Carousel } from "primereact/carousel";
import { Card } from "primereact/card";
import { OrderList } from "primereact/orderlist";
import { ProductService } from "./service/ProductService";
import { EventService } from "./service/EventService";
import { PhotoService } from "./service/PhotoService";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "primeflex/primeflex.css";

// reactstrap components
import {
  // Badge,
  Button,
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

class Landing extends React.Component {
  state = {};

  constructor(props) {
    super(props);

    this.state = {
      date: null,
      products: [],
    };

    this.eventTemplate = this.eventTemplate.bind(this);
    this.photoTemplate = this.photoTemplate.bind(this);
    this.itemTemplate = this.itemTemplate.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    // document.documentElement.scrollTop = 0;
    // document.scrollingElement.scrollTop = 0;
    // this.refs.main.scrollTop = 0;

    ProductService.getProductsMini().then((data) => {
      this.setState({ products: data });
    });
    EventService.getEvents().then((data) =>
      this.setState({ events: data.slice(0, 9) })
    );
    PhotoService.getImages().then((data) =>
      this.setState({ photos: data.slice(0, 9) })
    );
  }

  itemTemplate(item) {
    return (
      <div
        className="flex flex-wrap p-2 align-items-center gap-3"
        style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)" }}
      >
        <div className="flex-1 flex flex-column gap-2 xl:mr-8">
          <span className="font-bold">{item.name}</span>
          <div className="flex align-items-center gap-2">
            {/* <i className="ni ni-square-pin"></i> */}
            <span>{item.category}</span>
          </div>
        </div>
        <span className="font-bold text-900">{item.price}</span>
      </div>
    );
  }

  eventTemplate(event) {
    return (
      // <Card title={event.title}>
      //   <p className="m-0">{event.description}</p>
      // </Card>

      <Card
        title={
          <div
            style={{
              height: "50px",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // textAlign: "center",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {event.title}
          </div>
        }
        style={{
          width: "250px",
          margin: "auto",
          minHeight: "350px", // Tinggi minimum card
          maxHeight: "350px", // Tinggi maksimum card agar seragam
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 12px 20px rgba(0, 0, 0, 0.4)", // Menambahkan shadow pada card
        }}
      >
        <div style={{ flexGrow: 1 }}>
          <p className="p-m-0" style={{ lineHeight: "1.5" }}>
            {event.description}
          </p>
        </div>
      </Card>
    );
  }

  photoTemplate(photo) {
    return (
      <div className="card mb-3">
        <Card
          title={photo.title}
          style={{
            boxShadow: "0 12px 20px rgba(0, 0, 0, 0.4)", // Menambahkan shadow pada card
          }}
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
  }

  onChange(e) {
    this.setState({ products: e.value });
  }

  render() {
    return (
      <>
        <DemoNavbar />
        <main ref="main">
          <div className="position-relative">
            {/* shape Hero */}
            <section className="section section-lg section-shaped ">
              <div
                style={{ backgroundColor: "#45b39d" }}
                className="shape"
              ></div>
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
                                  Ikan bandeng merupakan spesies asli dari
                                  Samudra Hindia dan Pasifik. Ikan ini telah
                                  lama dibudidayakan di Asia Tenggara, khususnya
                                  di Indonesia, Filipina, dan Taiwan..{" "}
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
                                  cottonii dan Gracilaria telah menjadi
                                  komoditas penting sejak dekade-dekade
                                  terakhir.
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
                                  cottonii dan Gracilaria telah menjadi
                                  komoditas penting sejak dekade-dekade
                                  terakhir.
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
                                  cottonii dan Gracilaria telah menjadi
                                  komoditas penting sejak dekade-dekade
                                  terakhir.
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
            {/* 1st Hero Variation */}
          </div>
          {/* agenda kegiatan */}
          <section className="section section-lg section-shaped ">
            <div style={{ backgroundColor: "#5dade2" }} className="shape"></div>
            <Container
              className="py-lg-md d-flex"
              style={{ minHeight: "500px" }}
            >
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
                      className="display-3 text-white"
                    >
                      Agenda Kegiatan{" "}
                    </h1>
                  </Col>
                </Row>
                <div className="py-5">
                  <div className="container">
                    <div className="row g-4">
                      <Row className="justify-content-md-center">
                        <div className="col-lg-5 col-md-6">
                          <OrderList
                            dataKey="id"
                            value={this.state.products}
                            onChange={this.onChange}
                            itemTemplate={this.itemTemplate}
                            header="Agenda Kegiatan"
                            filter
                            filterBy="name"
                            // style={{
                            //   boxShadow: "0 4px 12px rgba(0, 0, 0, 0)",
                            // }}
                          ></OrderList>
                        </div>
                        <div className="col-lg-7 col-md-6">
                          <div
                            className="service-item rounded d-flex h-100"
                            style={{
                              minHeight: "600px",
                              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)", // Bayangan tebal pada container utama
                              position: "relative", // Agar pseudo-element bisa diatur posisinya
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
                                alt=""
                                style={{ borderRadius: "inherit" }}
                              />
                            </div>
                            <div
                              className="service-text rounded p-2"
                              style={{
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Bayangan tebal pada teks
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
                        </div>
                      </Row>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
            {/* SVG separator */}
          </section>
          {/* Berita */}
          <section className="section section-lg section-shaped">
            <div className="grid p-3">
              <div className="col-12 md:col-6 lg:col-3">
                <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                  <div className="flex justify-content-between mb-3">
                    <div>
                      <span className="block text-500 font-medium mb-3">
                        Pembangunan Desa
                      </span>
                      <div className="text-900 font-medium text-xl">
                        {/* 152 */}
                      </div>
                    </div>
                    <div
                      className="flex align-items-center justify-content-center bg-blue-100 border-round"
                      style={{ width: "2.5rem", height: "2.5rem" }}
                    >
                      <i className="pi pi-building text-blue-500 text-xl"></i>
                    </div>
                  </div>
                  <span className="text-green-500 font-medium">
                    {/* 24 new  */}
                  </span>
                  <span className="text-500">{/* since last visit */}</span>
                </div>
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <Link to="/keuangan-desa">
                  <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                    <div className="flex justify-content-between mb-3">
                      <div>
                        <span className="block text-500 font-medium mb-3">
                          Keuangan Desa
                        </span>
                        <div className="text-900 font-medium text-xl">
                          {/* $2.100 */}
                        </div>
                      </div>
                      <div
                        className="flex align-items-center justify-content-center bg-orange-100 border-round"
                        style={{ width: "2.5rem", height: "2.5rem" }}
                      >
                        <i className="pi pi-wallet text-orange-500 text-xl"></i>
                      </div>
                    </div>
                    <span className="text-green-500 font-medium">
                      {/* %52+  */}
                    </span>
                    <span className="text-500">{/* since last week */}</span>
                  </div>
                </Link>
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                  <div className="flex justify-content-between mb-3">
                    <div>
                      <span className="block text-500 font-medium mb-3">
                        Berita
                      </span>
                      <div className="text-900 font-medium text-xl">
                        {/* 28441 */}
                      </div>
                    </div>
                    <div
                      className="flex align-items-center justify-content-center bg-cyan-100 border-round"
                      style={{ width: "2.5rem", height: "2.5rem" }}
                    >
                      <i className="pi pi-bell text-cyan-500 text-xl"></i>
                    </div>
                  </div>
                  <span className="text-green-500 font-medium">
                    {/* 520 */}
                  </span>
                  <span className="text-500">{/* newly registered */}</span>
                </div>
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                  <div className="flex justify-content-between mb-3">
                    <div>
                      <span className="block text-500 font-medium mb-3">
                        Galeri Foto
                      </span>
                      <div className="text-900 font-medium text-xl">
                        {/* 152 Unread */}
                      </div>
                    </div>
                    <div
                      className="flex align-items-center justify-content-center bg-purple-100 border-round"
                      style={{ width: "2.5rem", height: "2.5rem" }}
                    >
                      <i className="pi pi-image text-purple-500 text-xl"></i>
                    </div>
                  </div>
                  <span className="text-green-500 font-medium">{/* 85 */}</span>
                  <span className="text-500">{/* responded */}</span>
                </div>
              </div>
            </div>
          </section>
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
                <polygon
                  className="fill-white"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
          </section>
          {/* saran dan kritik */}
          <section className="section section-lg pt-lg-0 section-contact-us">
            <Container>
              <Row className="justify-content-center mt--300">
                <Col lg="8">
                  <Card className="bg-gradient-secondary shadow">
                    <CardBody className="p-lg-5">
                      <h4 className="mb-1">Saran dan Kritik</h4>
                      <p className="mt-0">Suaramu akan membantu perbaikan.</p>
                      <FormGroup
                        className={classnames("mt-5", {
                          focused: this.state.nameFocused,
                        })}
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
                            onFocus={(e) =>
                              this.setState({ nameFocused: true })
                            }
                            onBlur={(e) =>
                              this.setState({ nameFocused: false })
                            }
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup
                        className={classnames({
                          focused: this.state.emailFocused,
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
                            onFocus={(e) =>
                              this.setState({ emailFocused: true })
                            }
                            onBlur={(e) =>
                              this.setState({ emailFocused: false })
                            }
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
          <section className="lg-12">
            <div className="py-5 bg-secondary">
              <Container fluid>
                {/* Inputs (alternative) */}
                <div className="card">
                  <Carousel
                    value={this.state.photos}
                    numVisible={1}
                    numScroll={1}
                    circular
                    autoplayInterval={5000}
                    itemTemplate={this.photoTemplate}
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
        </main>
      </>
    );
  }
}

export default Landing;
