import React, { useState, useEffect } from "react";
import useSWR from "swr"; // Import SWR
// import axios from "axios";
import { Chart } from "primereact/chart";
import { Button, Row, Col } from "reactstrap";
import { Dialog } from "primereact/dialog";
// import { CustomerService } from "./service/CustomerService";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Modals = () => {
  const [dialogVisiblevm, setDialogVisiblevm] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogVisiblettg, setDialogVisiblettg] = useState(false);
  const [dialogVisiblesd, setDialogVisiblesd] = useState(false);
  const [dialogVisibleso, setDialogVisibleso] = useState(false);
  const [dialogVisiblele, setDialogVisiblele] = useState(false);
  const [dialogVisiblege, setDialogVisiblege] = useState(false);
  // const [customers, setCustomers] = useState([]);
  // const [chartData, setChartData] = useState({});
  // const [chartOptions, setChartOptions] = useState({});

  const { data: tentangData, error: tentangError } = useSWR(
    "http://localhost:5000/tentangpengunjung",
    fetcher
  );
  const loadingTentang = !tentangData && !tentangError;

  const { data: sejarahData, error: sejarahError } = useSWR(
    "http://localhost:5000/sejarahpengunjung",
    fetcher
  );
  const loadingSejarah = !sejarahData && !sejarahError;

  const { data: visionData, error: visionError } = useSWR(
    "http://localhost:5000/visimisipengunjung",
    fetcher
  );
  const loadingVision = !visionData && !visionError;

  const { data: strukturorganisasiData, error: strukturorganisasiError } =
    useSWR("http://localhost:5000/strukturorganisasipengunjung", fetcher);

  const loadingStrukturorganisasi =
    !strukturorganisasiData && !strukturorganisasiError;

  // Construct full URL for the image
  const baseURL = "http://localhost:5000";
  const imageURL = strukturorganisasiData?.profile.file_url
    ? `${baseURL}${strukturorganisasiData.profile.file_url}`
    : null;

  const { data: demografiData, error: demografiError } = useSWR(
    "http://localhost:5000/demografipengunjung",
    fetcher
  );

  const [genderChartData, setGenderChartData] = useState(null);
  const [educationChartData, setEducationChartData] = useState(null);
  const [jobChartData, setJobChartData] = useState(null);
  const [religionChartData, setReligionChartData] = useState(null);
  const [maritalStatusChartData, setMaritalStatusChartData] = useState(null);

  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    if (demografiData) {
      // Safely handle gender data
      const genderLabels =
        demografiData.genderCounts?.map((item) => item?.gender) || [];
      const genderCounts =
        demografiData.genderCounts?.map((item) => item?._count?.id || 0) || [];

      // Safely handle education data
      const educationLabels =
        demografiData.educationCounts?.map((item) => item?.education?.level) ||
        [];
      const educationCounts =
        demografiData.educationCounts?.map((item) => item?.count || 0) || [];

      console.log("Education Labels: ", educationLabels);
      console.log("Education Counts: ", educationCounts);

      // Safely handle job data
      const jobLabels = demografiData.jobCounts?.map((item) => item?.job) || [];
      const jobCounts =
        demografiData.jobCounts?.map((item) => item?._count?.id || 0) || [];

      // Safely handle religion data
      const religionLabels =
        demografiData.religionCounts?.map((item) => item?.religion?.name) || [];
      const religionCounts =
        demografiData.religionCounts?.map((item) => item?._count?.id || 0) ||
        [];

      // Safely handle marital status data
      const maritalStatusLabels =
        demografiData.maritalStatusCounts?.map(
          (item) => item?.marital_status
        ) || [];
      const maritalStatusCounts =
        demografiData.maritalStatusCounts?.map(
          (item) => item?._count?.id || 0
        ) || [];

      // Set chart data
      setGenderChartData({
        labels: genderLabels,
        datasets: [
          {
            data: genderCounts,
            backgroundColor: ["#42A5F5", "#66BB6A"],
            hoverBackgroundColor: ["#64B5F6", "#81C784"],
          },
        ],
      });

      setEducationChartData({
        labels: educationLabels,
        datasets: [
          {
            data: educationCounts,
            backgroundColor: ["#FFA726", "#FB8C00", "#F57C00"],
            hoverBackgroundColor: ["#FFB74D", "#FF9800", "#F57C00"],
          },
        ],
      });

      setJobChartData({
        labels: jobLabels,
        datasets: [
          {
            data: jobCounts,
            backgroundColor: ["#26A69A", "#66BB6A", "#FF7043"],
            hoverBackgroundColor: ["#4DB6AC", "#81C784", "#FF8A65"],
          },
        ],
      });

      setReligionChartData({
        labels: religionLabels,
        datasets: [
          {
            data: religionCounts,
            backgroundColor: ["#AB47BC", "#5C6BC0", "#42A5F5"],
            hoverBackgroundColor: ["#BA68C8", "#7986CB", "#64B5F6"],
          },
        ],
      });

      setMaritalStatusChartData({
        labels: maritalStatusLabels,
        datasets: [
          {
            data: maritalStatusCounts,
            backgroundColor: ["#EF5350", "#FF7043", "#66BB6A"],
            hoverBackgroundColor: ["#E57373", "#FF8A65", "#81C784"],
          },
        ],
      });

      // Update chart options
      setChartOptions({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "right", // Move labels to the right
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const dataValue = tooltipItem.raw;
                return `${tooltipItem.label}: ${dataValue}`;
              },
            },
          },
        },
      });
    }
  }, [demografiData]);

  // useEffect(() => {
  //   CustomerService.getCustomersMedium().then((data) => setCustomers(data));

  //   const documentStyle = getComputedStyle(document.documentElement);
  //   const data = {
  //     labels: ["A", "B", "C"],
  //     datasets: [
  //       {
  //         data: [540, 325, 702],
  //         backgroundColor: [
  //           documentStyle.getPropertyValue("--blue-500"),
  //           documentStyle.getPropertyValue("--yellow-500"),
  //           documentStyle.getPropertyValue("--green-500"),
  //         ],
  //         hoverBackgroundColor: [
  //           documentStyle.getPropertyValue("--blue-400"),
  //           documentStyle.getPropertyValue("--yellow-400"),
  //           documentStyle.getPropertyValue("--green-400"),
  //         ],
  //       },
  //     ],
  //   };
  //   const options = {
  //     plugins: {
  //       legend: {
  //         labels: {
  //           usePointStyle: true,
  //         },
  //       },
  //     },
  //   };

  //   setChartData(data);
  //   setChartOptions(options);
  // }, []);

  const dialogFooterTemplate = (hideDialog) => (
    <Button label="Ok" icon="pi pi-check" onClick={hideDialog} />
  );

  if (demografiError) return <div>Error loading data</div>;
  if (!demografiData) return <div>Loading...</div>;

  return (
    <>
      <h2 className="mt-sm mb-2">
        <span></span>
      </h2>
      <Row>
        <Col className="mt-1" md="3" xs="6">
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={() => setDialogVisiblettg(true)}
          >
            Tentang
          </Button>
          <div className="card">
            <Dialog
              header="Tentang"
              visible={dialogVisiblettg}
              style={{ width: "75vw" }}
              maximizable
              modal
              contentStyle={{ height: "300px" }}
              onHide={() => setDialogVisiblettg(false)}
              footer={dialogFooterTemplate(() => setDialogVisiblettg(false))}
            >
              <div className="modal-body col-lg">
                {loadingTentang ? (
                  <p>Loading...</p>
                ) : tentangError ? (
                  <p>{tentangError}</p>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: tentangData?.profile?.content,
                    }}
                  />
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
            onClick={() => setDialogVisiblesd(true)}
          >
            Sejarah
          </Button>
          <div className="card">
            <Dialog
              header="Sejarah"
              visible={dialogVisiblesd}
              style={{ width: "75vw" }}
              maximizable
              modal
              contentStyle={{ height: "300px" }}
              onHide={() => setDialogVisiblesd(false)}
              footer={dialogFooterTemplate(() => setDialogVisiblesd(false))}
            >
              <div className="modal-body col-lg">
                {loadingSejarah ? (
                  <p>Loading...</p>
                ) : sejarahError ? (
                  <p>{sejarahError}</p>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: sejarahData?.profile?.content,
                    }}
                  />
                )}
              </div>
            </Dialog>
          </div>
        </Col>

        <Col className="mt-1" md="3" xs="6">
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0"
            color="default"
            type="button"
            onClick={() => setDialogVisiblevm(true)}
          >
            Visi dan Misi
          </Button>
          <div className="card">
            <Dialog
              header="Visi dan Misi"
              visible={dialogVisiblevm}
              style={{ width: "75vw" }}
              maximizable
              modal
              onHide={() => setDialogVisiblevm(false)}
              footer={dialogFooterTemplate(() => setDialogVisiblevm(false))}
            >
              <div className="modal-body col-lg">
                {loadingVision ? (
                  <p>Loading...</p>
                ) : visionError ? (
                  <p>{visionError}</p>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: visionData?.profile?.content,
                    }}
                  />
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
            onClick={() => setDialogVisibleso(true)}
          >
            Struktur Organisasi
          </Button>
          <div className="card">
            <Dialog
              header="Struktur Organisasi"
              visible={dialogVisibleso}
              style={{ width: "75vw", borderRadius: "16px" }}
              maximizable
              modal
              contentStyle={{ height: "calc(100% - 60px)" }}
              onHide={() => setDialogVisibleso(false)}
              footer={dialogFooterTemplate(() => setDialogVisibleso(false))}
            >
              <div className="modal-body col-lg">
                {loadingStrukturorganisasi ? (
                  <p>Loading...</p>
                ) : strukturorganisasiError ? (
                  <p>
                    {strukturorganisasiError.message || "Failed to load data"}
                  </p>
                ) : (
                  <div>
                    {imageURL ? (
                      <div>
                        <img
                          src={imageURL}
                          alt="Organizational Structure"
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "20px",
                            maxHeight: "calc(89vh - 60px)",
                          }} // Adjust image size
                        />
                      </div>
                    ) : (
                      <p>No image available</p>
                    )}
                    {strukturorganisasiData?.profile?.content && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: strukturorganisasiData.profile.content,
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
            onClick={() => setDialogVisiblele(true)}
          >
            Lembaga
          </Button>
          <div className="card">
            <Dialog
              header="Lembaga"
              visible={dialogVisiblele}
              style={{ width: "75vw" }}
              maximizable
              modal
              contentStyle={{ height: "300px" }}
              onHide={() => setDialogVisiblele(false)}
              footer={dialogFooterTemplate(() => setDialogVisiblele(false))}
            >
              <div className="modal-body col-lg">
                <p>Far far away, behind the word mountains...</p>
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
            onClick={() => setDialogVisiblege(true)}
          >
            Geografi
          </Button>
          <div className="card">
            <Dialog
              header="Geografi"
              visible={dialogVisiblege}
              style={{ width: "75vw" }}
              maximizable
              modal
              contentStyle={{ height: "300px" }}
              onHide={() => setDialogVisiblege(false)}
              footer={dialogFooterTemplate(() => setDialogVisiblege(false))}
            >
              <div className="modal-body col-lg">
                <p>Desa Randusanga Kulon merupakan daerah pesisir...</p>
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
            onClick={() => setDialogVisible(true)}
          >
            Demografi
          </Button>
          <div className="card">
            <Dialog
              header="Demografi"
              visible={dialogVisible}
              style={{ width: "75vw" }}
              maximizable
              modal
              contentStyle={{
                height: "500px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
              onHide={() => setDialogVisible(false)}
            >
              <div className="modal-body col-lg">
                {/* Consistent section styling for alignment */}
                <div style={{ width: "100%", padding: "10px 0" }}>
                  <h2 style={{ textAlign: "left" }}>Gender Distribution</h2>
                  {genderChartData && (
                    <Chart
                      type="pie"
                      data={genderChartData}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          legend: {
                            ...chartOptions.plugins.legend,
                            align: "start",
                          }, // Align legend left
                        },
                      }}
                      style={{ marginBottom: "30px", width: "100%" }}
                    />
                  )}
                </div>

                <div style={{ width: "100%", padding: "10px 0" }}>
                  <h2 style={{ textAlign: "left" }}>Education Distribution</h2>
                  {educationChartData && (
                    <Chart
                      type="pie"
                      data={educationChartData}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          legend: {
                            ...chartOptions.plugins.legend,
                            align: "start",
                          }, // Align legend left
                        },
                      }}
                      style={{ marginBottom: "30px", width: "100%" }}
                    />
                  )}
                </div>

                <div style={{ width: "100%", padding: "10px 0" }}>
                  <h2 style={{ textAlign: "left" }}>Job Distribution</h2>
                  {jobChartData && (
                    <Chart
                      type="pie"
                      data={jobChartData}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          legend: {
                            ...chartOptions.plugins.legend,
                            align: "start",
                          },
                        },
                      }}
                      style={{ marginBottom: "30px", width: "100%" }}
                    />
                  )}
                </div>

                <div style={{ width: "100%", padding: "10px 0" }}>
                  <h2 style={{ textAlign: "left" }}>Religion Distribution</h2>
                  {religionChartData && (
                    <Chart
                      type="pie"
                      data={religionChartData}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          legend: {
                            ...chartOptions.plugins.legend,
                            align: "start",
                          },
                        },
                      }}
                      style={{ marginBottom: "30px", width: "100%" }}
                    />
                  )}
                </div>

                <div style={{ width: "100%", padding: "10px 0" }}>
                  <h2 style={{ textAlign: "left" }}>
                    Marital Status Distribution
                  </h2>
                  {maritalStatusChartData && (
                    <Chart
                      type="pie"
                      data={maritalStatusChartData}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          legend: {
                            ...chartOptions.plugins.legend,
                            align: "start",
                          },
                        },
                      }}
                      style={{ marginBottom: "30px", width: "100%" }}
                    />
                  )}
                </div>
              </div>
            </Dialog>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Modals;
