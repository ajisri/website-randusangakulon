import React, { useState, useEffect } from "react";
import useSWR from "swr"; // Import SWR
// import axios from "axios";
import { Chart } from "primereact/chart";
import { Button, Row, Col } from "reactstrap";
import { Dialog } from "primereact/dialog";
import { CustomerService } from "./service/CustomerService";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Modall = () => {
  // State untuk masing-masing dialog
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogVisiblekk, setDialogVisiblekk] = useState(false);
  const [dialogVisiblektp, setDialogVisiblektp] = useState(false);
  const [dialogVisiblepn, setDialogVisiblepn] = useState(false);
  const [dialogVisibleabp, setDialogVisibleabp] = useState(false);
  const [dialogVisiblepsktm, setDialogVisiblepsktm] = useState(false);

  //akta kelahiran
  const { data: aktakelahiranData, error: aktakelahiranError } = useSWR(
    "http://localhost:5000/aktakelahiranpengunjung",
    fetcher
  );

  const loadingAktakelahiran = !aktakelahiranData && !aktakelahiranError;

  // Construct full URL for the image
  const baseAURL = "http://localhost:5000";
  const imageAURL = aktakelahiranData?.service.file_url
    ? `${baseAURL}${aktakelahiranData.service.file_url}`
    : null;

  //kartu keluarga
  const { data: kartukeluargaData, error: kartukeluargaError } = useSWR(
    "http://localhost:5000/kartukeluargapengunjung",
    fetcher
  );

  const loadingKartukeluarga = !kartukeluargaData && !kartukeluargaError;

  // Construct full URL for the image
  const baseKKURL = "http://localhost:5000";
  const imageKKURL = kartukeluargaData?.service.file_url
    ? `${baseKKURL}${kartukeluargaData.service.file_url}`
    : null;

  //ktp
  const { data: kartutandapendudukData, error: kartutandapendudukError } =
    useSWR("http://localhost:5000/kartutandapendudukpengunjung", fetcher);

  const loadingKartutandapenduduk =
    !kartutandapendudukData && !kartutandapendudukError;

  // Construct full URL for the image
  const baseKTPURL = "http://localhost:5000";
  const imageKTPURL = kartutandapendudukData?.service.file_url
    ? `${baseKTPURL}${kartutandapendudukData.service.file_url}`
    : null;

  //pendaftaran nikah
  const { data: pendaftarannikahData, error: pendaftarannikahError } = useSWR(
    "http://localhost:5000/pendaftarannikahpengunjung",
    fetcher
  );

  const loadingPendaftarannikah =
    !pendaftarannikahData && !pendaftarannikahError;

  // Construct full URL for the image
  const basePNURL = "http://localhost:5000";
  const imagePNURL = pendaftarannikahData?.service.file_url
    ? `${basePNURL}${pendaftarannikahData.service.file_url}`
    : null;

  //aktifasi bpjs
  const { data: aktifasibpjsData, error: aktifasibpjsError } = useSWR(
    "http://localhost:5000/aktifasibpjspengunjung",
    fetcher
  );

  const loadingAktifasibpjs = !aktifasibpjsData && !aktifasibpjsError;

  // Construct full URL for the image
  const baseABURL = "http://localhost:5000";
  const imageABURL = aktifasibpjsData?.service.file_url
    ? `${baseABURL}${aktifasibpjsData.service.file_url}`
    : null;

  //pembuatan sktm
  const { data: pembuatansktmData, error: pembuatansktmError } = useSWR(
    "http://localhost:5000/pembuatansktmpengunjung",
    fetcher
  );

  const loadingPembuatansktm = !pembuatansktmData && !pembuatansktmError;

  // Construct full URL for the image
  const basePSKTMURL = "http://localhost:5000";
  const imagePSKTMURL = pembuatansktmData?.service.file_url
    ? `${basePSKTMURL}${pembuatansktmData.service.file_url}`
    : null;

  // Template untuk footer dialog
  const dialogFooterTemplate = () => (
    <Button label="Ok" icon="pi pi-check" onClick={hideDialog} />
  );

  const dialogFooterTemplatekk = () => (
    <Button label="Ok" icon="pi pi-check" onClick={hideDialogkk} />
  );

  const dialogFooterTemplatektp = () => (
    <Button label="Ok" icon="pi pi-check" onClick={hideDialogktp} />
  );

  const dialogFooterTemplatepn = () => (
    <Button label="Ok" icon="pi pi-check" onClick={hideDialogpn} />
  );

  const dialogFooterTemplateabp = () => (
    <Button label="Ok" icon="pi pi-check" onClick={hideDialogabp} />
  );

  const dialogFooterTemplatepsktm = () => (
    <Button label="Ok" icon="pi pi-check" onClick={hideDialogpsktm} />
  );

  // Fungsi untuk menampilkan/menghilangkan dialog
  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  const showDialogkk = () => setDialogVisiblekk(true);
  const hideDialogkk = () => setDialogVisiblekk(false);

  const showDialogktp = () => setDialogVisiblektp(true);
  const hideDialogktp = () => setDialogVisiblektp(false);

  const showDialogpn = () => setDialogVisiblepn(true);
  const hideDialogpn = () => setDialogVisiblepn(false);

  const showDialogabp = () => setDialogVisibleabp(true);
  const hideDialogabp = () => setDialogVisibleabp(false);

  const showDialogpsktm = () => setDialogVisiblepsktm(true);
  const hideDialogpsktm = () => setDialogVisiblepsktm(false);
  return (
    <>
      <h2 className="mt-sm mb-2">
        <span></span>
      </h2>
      {/* <h3 className="h4 text-success font-weight-bold mb-4">Modals</h3> */}
      <Row>
        <Col className="mt-1" md="3" xs="6">
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialog}
          >
            Akta Kelahiran
          </Button>
          <div className="card">
            <Dialog
              header="Akta Kelahiran"
              visible={dialogVisible}
              style={{ width: "75vw" }}
              maximizable
              modal
              contentStyle={{ height: "300px" }}
              onHide={hideDialog}
              footer={dialogFooterTemplate}
            >
              <div className="modal-body col-lg">
                {loadingAktakelahiran ? (
                  <p>Loading...</p>
                ) : aktakelahiranError ? (
                  <p>{aktakelahiranError.message || "Failed to load data"}</p>
                ) : (
                  <div>
                    {imageAURL ? (
                      <div>
                        <img
                          src={imageAURL}
                          alt="Organizational Structure"
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "20px",
                            maxHeight: "calc(89vh - 60px)",
                            marginBottom: "50px",
                          }} // Adjust image size
                        />
                      </div>
                    ) : (
                      <p>No image available</p>
                    )}
                    {aktakelahiranData?.service?.content && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: aktakelahiranData.service.content,
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </Dialog>
          </div>
        </Col>
        <Col className="mt-1" md="3" xs="6">
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialogkk}
          >
            Kartu Keluarga
          </Button>
          <div className="card">
            <Dialog
              header="Kartu Keluarga"
              visible={dialogVisiblekk}
              style={{ width: "75vw" }}
              maximizable
              modal
              contentStyle={{ height: "300px" }}
              onHide={hideDialogkk}
              footer={dialogFooterTemplatekk}
            >
              <div className="modal-body col-lg">
                {loadingKartukeluarga ? (
                  <p>Loading...</p>
                ) : kartukeluargaError ? (
                  <p>{kartukeluargaError.message || "Failed to load data"}</p>
                ) : (
                  <div>
                    {imageKKURL ? (
                      <div>
                        <img
                          src={imageKKURL}
                          alt="Organizational Structure"
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "20px",
                            maxHeight: "calc(89vh - 60px)",
                            marginBottom: "50px",
                          }} // Adjust image size
                        />
                      </div>
                    ) : (
                      <p>No image available</p>
                    )}
                    {kartukeluargaData?.service?.content && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: kartukeluargaData.service.content,
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </Dialog>
          </div>
        </Col>
        <Col className="mt-1" md="3" xs="6">
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialogktp}
          >
            Kartu Tanda Penduduk
          </Button>
          <div className="card">
            <Dialog
              header="Kartu Tanda Penduduk"
              visible={dialogVisiblektp}
              style={{ width: "75vw" }}
              maximizable
              modal
              contentStyle={{ height: "300px" }}
              onHide={hideDialogktp}
              footer={dialogFooterTemplatektp}
            >
              <div className="modal-body col-lg">
                {loadingKartutandapenduduk ? (
                  <p>Loading...</p>
                ) : kartutandapendudukError ? (
                  <p>
                    {kartutandapendudukError.message || "Failed to load data"}
                  </p>
                ) : (
                  <div>
                    {imageKTPURL ? (
                      <div>
                        <img
                          src={imageKTPURL}
                          alt="Organizational Structure"
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "20px",
                            maxHeight: "calc(89vh - 60px)",
                            marginBottom: "50px",
                          }} // Adjust image size
                        />
                      </div>
                    ) : (
                      <p>No image available</p>
                    )}
                    {kartutandapendudukData?.service?.content && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: kartutandapendudukData.service.content,
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </Dialog>
          </div>
        </Col>
        <Col className="mt-1" md="3" xs="6">
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialogpn}
          >
            Pendaftaran Nikah
          </Button>
          <div className="card">
            <Dialog
              header="Pendaftaran Nikah"
              visible={dialogVisiblepn}
              style={{ width: "75vw" }}
              maximizable
              modal
              contentStyle={{ height: "300px" }}
              onHide={hideDialogpn}
              footer={dialogFooterTemplatepn}
            >
              <div className="modal-body col-lg">
                {loadingPendaftarannikah ? (
                  <p>Loading...</p>
                ) : pendaftarannikahError ? (
                  <p>
                    {pendaftarannikahError.message || "Failed to load data"}
                  </p>
                ) : (
                  <div>
                    {imagePNURL ? (
                      <div>
                        <img
                          src={imagePNURL}
                          alt="Organizational Structure"
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "20px",
                            maxHeight: "calc(89vh - 60px)",
                            marginBottom: "50px",
                          }} // Adjust image size
                        />
                      </div>
                    ) : (
                      <p>No image available</p>
                    )}
                    {pendaftarannikahData?.service?.content && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: pendaftarannikahData.service.content,
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </Dialog>
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="mt-1" md="3" xs="6">
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialogabp}
          >
            Aktifasi BPJS PBI-JKN
          </Button>
          <div className="card">
            <Dialog
              header="Aktifasi BPJS PBI-JKN"
              visible={dialogVisibleabp}
              style={{ width: "75vw" }}
              maximizable
              modal
              contentStyle={{ height: "300px" }}
              onHide={hideDialogabp}
              footer={dialogFooterTemplateabp}
            >
              <div className="modal-body col-lg">
                {loadingAktifasibpjs ? (
                  <p>Loading...</p>
                ) : aktifasibpjsError ? (
                  <p>{aktifasibpjsError.message || "Failed to load data"}</p>
                ) : (
                  <div>
                    {imageABURL ? (
                      <div>
                        <img
                          src={imageABURL}
                          alt="Organizational Structure"
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "20px",
                            maxHeight: "calc(89vh - 60px)",
                            marginBottom: "50px",
                          }} // Adjust image size
                        />
                      </div>
                    ) : (
                      <p>No image available</p>
                    )}
                    {aktifasibpjsData?.service?.content && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: aktifasibpjsData.service.content,
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </Dialog>
          </div>
        </Col>
        <Col className="mt-1" md="3" xs="6">
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialogpsktm}
          >
            Pembuatan SKTM
          </Button>
          <div className="card">
            <Dialog
              header="Pembuatan SKTM"
              visible={dialogVisiblepsktm}
              style={{ width: "75vw" }}
              maximizable
              modal
              contentStyle={{ height: "300px" }}
              onHide={hideDialogpsktm}
              footer={dialogFooterTemplatepsktm}
            >
              <div className="modal-body col-lg">
                {loadingPembuatansktm ? (
                  <p>Loading...</p>
                ) : pembuatansktmError ? (
                  <p>{pembuatansktmError.message || "Failed to load data"}</p>
                ) : (
                  <div>
                    {imagePSKTMURL ? (
                      <div>
                        <img
                          src={imagePSKTMURL}
                          alt="Organizational Structure"
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "20px",
                            maxHeight: "calc(89vh - 60px)",
                            marginBottom: "50px",
                          }} // Adjust image size
                        />
                      </div>
                    ) : (
                      <p></p>
                    )}
                    {pembuatansktmData?.service?.content && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: pembuatansktmData.service.content,
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </Dialog>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Modall;
