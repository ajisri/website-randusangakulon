import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { Dialog } from "primereact/dialog";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Berita = () => {
  const { data: beritaData, error: beritaError } = useSWR(
    "http://localhost:5000/beritapengunjung",
    fetcher
  );

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const [selectedBerita, setSelectedBerita] = useState(null);

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const formatTanggal = (date) => {
    const options = { month: "long", year: "numeric" };
    return new Date(date).toLocaleDateString("id-ID", options);
  };

  if (beritaError)
    return <p style={{ textAlign: "center" }}>Gagal memuat data berita.</p>;
  if (!beritaData)
    return <p style={{ textAlign: "center" }}>Memuat berita...</p>;

  const styles = {
    container: {
      maxHeight: "800px",
      overflowY: "scroll",
      padding: "10px",
      gap: "20px",
      paddingRight: "30px",
      width: isSmallScreen ? "100%" : "95%",
      margin: "0 auto",
      height: "90vh",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    card: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      cursor: "pointer",
      border: "1px solid #ccc",
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "20px",
      transition: "box-shadow 0.3s ease",
      width: "95%",
    },
    cardHover: {
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    imageContainer: {
      width: isSmallScreen ? "100px" : "150px",
      height: isSmallScreen ? "100px" : "150px",
      borderRadius: "8px",
      overflow: "hidden",
      marginRight: "10px",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    content: {
      flex: "1",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    title: {
      fontWeight: "bold",
      fontSize: isSmallScreen ? "0.9rem" : "1rem",
      margin: 0,
      color: "#333",
    },
    date: {
      color: "#888",
      fontSize: "0.8rem",
      marginTop: "5px",
    },
    description: {
      color: "#616161",
      fontSize: "1rem",
      marginTop: "10px",
      lineHeight: "1.5",
    },
    dialogImage: {
      width: "100%",
      height: "auto",
      maxHeight: isSmallScreen ? "200px" : "300px",
      objectFit: "contain",
      borderRadius: "8px",
      marginBottom: "10px",
    },
    dialogDate: {
      color: "#888",
      fontSize: "1rem",
      textAlign: "right",
      marginBottom: "20px",
    },
    dialogContent: {
      fontSize: "1.1rem",
      lineHeight: "1.6",
      color: "#333",
    },
  };

  return (
    <div style={styles.container}>
      {beritaData.beritas && beritaData.beritas.length > 0 ? (
        beritaData.beritas.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedBerita(item)}
            style={styles.card}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = styles.cardHover.boxShadow)
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <div style={styles.imageContainer}>
              <img
                src={
                  `http://localhost:5000${item.file_url}` ||
                  "default-image-url.jpg"
                }
                alt={item.title}
                style={styles.image}
              />
            </div>
            <div style={styles.content}>
              <h4 style={styles.title}>{item.title}</h4>
              <p style={styles.description}>{item.short_description}</p>
              <span style={styles.date}>{formatTanggal(item.created_at)}</span>
            </div>
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center" }}>Tidak ada data berita tersedia.</p>
      )}

      {selectedBerita && (
        <Dialog
          header={selectedBerita.title}
          visible={!!selectedBerita}
          onHide={() => setSelectedBerita(null)}
          maximizable
          style={{ width: "90vw" }}
        >
          <img
            src={
              `http://localhost:5000${selectedBerita.file_url}` ||
              "default-image-url.jpg"
            }
            alt={selectedBerita.title}
            style={styles.dialogImage}
          />
          <div style={styles.dialogDate}>
            {formatTanggal(selectedBerita.created_at)}
          </div>
          <div
            style={styles.dialogContent}
            dangerouslySetInnerHTML={{ __html: selectedBerita.content }}
          />
        </Dialog>
      )}
    </div>
  );
};

export default Berita;
