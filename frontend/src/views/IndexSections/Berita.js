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
      maxHeight: "800px", // Tinggi maksimal kontainer berita
      overflowY: "scroll",
      padding: "20px",
      paddingRight: "40px",
      width: isSmallScreen ? "100%" : "80%",
      margin: "0 auto",
      height: "90vh", // Mengatur agar mengambil 90% dari tinggi viewport
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
    },
    card: {
      display: "flex",
      flexDirection: "column",
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
    image: {
      width: "100%",
      height: "200px",
      objectFit: "cover",
      borderRadius: "8px",
    },
    content: {
      marginTop: "10px",
    },
    title: {
      fontWeight: "bold",
      fontSize: "1.5rem",
      margin: 0,
      color: "#333",
    },
    date: {
      color: "#888",
      fontSize: "1rem",
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
      height: "300px",
      objectFit: "cover",
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
            <img
              src={
                `http://localhost:5000${item.file_url}` ||
                "default-image-url.jpg"
              }
              alt={item.title}
              style={styles.image}
            />
            <div style={styles.content}>
              <h4 style={styles.title}>{item.title}</h4>
              <span style={styles.date}>{formatTanggal(item.created_at)}</span>
              <p style={styles.description}>{item.short_description}</p>
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
          style={{ width: "70vw" }}
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
