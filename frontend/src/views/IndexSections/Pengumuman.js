import React, { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import styles from "../../assets/css/Pengumuman.module.css";

// Fungsi fetcher untuk mengambil data dari API
const fetcher = (url) => fetch(url).then((res) => res.json());

const Pengumuman = () => {
  const { data: pengumumanData, error: pengumumanError } = useSWR(
    "http://localhost:5000/pengumumanpengunjung",
    fetcher
  );

  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    let scrollAmount = 0;
    const scrollSpeed = 0.05; // Kecepatan yang sangat lambat

    const scroll = () => {
      scrollAmount += scrollSpeed;
      if (container) {
        container.scrollLeft = scrollAmount;

        // Ketika mencapai akhir dari konten, reset ke awal
        if (scrollAmount >= container.scrollWidth / 2) {
          scrollAmount = 0;
        }
      }
      requestAnimationFrame(scroll);
    };

    scroll();
    return () => cancelAnimationFrame(scroll);
  }, []);

  if (pengumumanError) {
    return <div>Error loading data</div>;
  }

  if (!pengumumanData) {
    return <div>Loading...</div>;
  }

  const pengumumanItems = pengumumanData.pengumumans || [];
  const doubledNewsItems = [...pengumumanItems, ...pengumumanItems]; // Penggandaan untuk konten menyambung

  const openDialog = (item) => {
    setSelectedItem(item);
    setVisible(true);
  };

  const handleDescriptionClick = (content, item) => {
    const urlPattern = /https?:\/\/[^\s]+/;
    const match = content.match(urlPattern);
    if (match) {
      window.open(match[0], "_blank");
    } else {
      openDialog(item);
    }
  };

  return (
    <div className={styles.newsContainer} ref={containerRef}>
      <div className={styles.newsContentWrapper}>
        {doubledNewsItems.map((item, index) => (
          <div
            className={styles.newsItem}
            key={index}
            style={{ marginRight: "50px" }} // Jarak antar item
          >
            <div className={styles.imageContainer}>
              <Image
                src={`http://localhost:5000${item.file_url}`}
                alt={item.title}
                className={styles.newsImage}
                preview
                width="100%"
                height="100%"
              />
            </div>
            <div className={styles.newsContent}>
              <h4 className={styles.newsTitle}>{item.title}</h4>
              <div className={styles.newsDetails}>
                <div className={styles.newsDescriptionWrapper}>
                  <Button
                    label="Lihat Deskripsi"
                    icon="pi pi-info-circle"
                    className="p-button-text"
                    onClick={() => handleDescriptionClick(item.content, item)}
                  />
                </div>
                <span className={styles.newsDate}>
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <Dialog
          header={selectedItem.title}
          visible={visible}
          maximizable
          style={{ width: "70vw", borderRadius: "15px" }}
          onHide={() => setVisible(false)}
        >
          <div className={styles.dialogContent}>
            <img
              src={`http://localhost:5000${selectedItem.file_url}`}
              alt={selectedItem.title}
              className={styles.dialogImage}
            />
            <p
              dangerouslySetInnerHTML={{ __html: selectedItem.content }}
              className={styles.dialogDescription}
            />
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default Pengumuman;
