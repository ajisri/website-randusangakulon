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
import ReactTypingEffect from "react-typing-effect";

// import { Link } from "react-router-dom";
import Tabs from "./Tabs.js";

// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";
// import Videofull from "./Videofull.js";

class Hero extends React.Component {
  constructor(props) {
    super(props);
    // Mengatur state awal
    this.state = {
      isVisible: false,
    };
  }

  // Fungsi untuk toggle visibilitas
  toggleVisibility = () => {
    this.setState((prevState) => ({
      isVisible: !prevState.isVisible,
    }));
  };
  render() {
    return (
      <>
        <div className="position-relative">
          {/* Hero for FREE version */}
          {/* <Videofull /> */}
          <section className="section section-hero bg-gradient-cyan embed-responsive">
            <video
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 1, // Membuat video di belakang komponen lainnya
              }}
              autoPlay
              loop
              muted
              playsInline
              src={require("assets/img/theme/vi1.mp4")}
            ></video>
            {/* Background circles */}
            <Container className="shape-container d-flex align-items-center justify-content-center py-lg">
              <div
                style={{
                  zIndex: 2, // Membuat video di belakang komponen lainnya
                }}
                className="col px-0"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "'Poppins', sans-serif", // Font modern populer
                    fontWeight: "700", // Tebal
                    fontSize: "2.5rem", // Ukuran font besar untuk judul
                    letterSpacing: "1.5px", // Spasi antar huruf untuk kesan modern
                    textTransform: "uppercase", // Huruf kapital semua
                    color: "#004D40", // Warna teks hijau tua untuk kontras
                    textAlign: "center", // Teks di tengah
                    lineHeight: "1.3",
                    paddingBottom: "10px", // Memberikan sedikit ruang di bawah judul
                  }}
                  className="responsive-title text-center"
                >
                  <h3 className="text-center font-weight-bold">
                    {/* Teks statis */}
                    <span>Selamat Datang di Portal Desa </span>

                    {/* Teks dengan animasi typing */}
                    <span
                      style={{
                        display: "inline-block",
                        whiteSpace: "nowrap",
                        minWidth: "250px", // Minimum width agar tetap stabil
                        textAlign: "left",
                      }}
                    >
                      <ReactTypingEffect
                        className="h3 text-center mr-1 font-weight-bold mt-6"
                        text={["Randusanga Kulon"]}
                        speed={100}
                        eraseSpeed={50}
                        eraseDelay={2000}
                        typingDelay={500}
                      />
                    </span>
                  </h3>
                </div>

                <Row className="align-items-center justify-content-center mt-2">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Button
                      onClick={this.toggleVisibility}
                      style={{ width: "100%" }}
                      block
                      color="secondary"
                      size="lg"
                      type="button"
                    >
                      Silahkan Klik Untuk Membuka Menu
                    </Button>
                  </div>
                  <Col className="text-center" lg="12">
                    {this.state.isVisible && <Tabs />}
                    <p className="lead text-white">
                      <strong>
                        Udang Vaname-Wisata Laut-Wisata Pemancingan-Kerang
                        Hijau-Ikan Bandeng-Rumput Laut
                      </strong>
                    </p>
                  </Col>
                </Row>
              </div>
            </Container>
            {/* SVG separator */}
            <div className="separator separator-bottom separator-skew zindex-100">
              <svg viewBox="0 0 120 28" xmlns="http://www.w3.org/2000/svg">
                <path
                  className="bg-gradient-cyan"
                  d="M0 20 Q 10 25, 20 20 T 40 20 T 60 20 T 80 20 T 100 20 T 120 20 V 30 H 0 Z"
                  fill="#4da6ff"
                />
              </svg>
            </div>
          </section>
        </div>
      </>
    );
  }
}

export default Hero;
