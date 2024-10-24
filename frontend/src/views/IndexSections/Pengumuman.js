import React, { useState } from "react";
import useSWR from "swr";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
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

  // Handle loading and error states
  if (pengumumanError) {
    return <div>Error loading data</div>;
  }

  if (!pengumumanData) {
    return <div>Loading...</div>;
  }

  const pengumumanItems = pengumumanData.pengumumans || [];
  const doubledNewsItems = [...pengumumanItems, ...pengumumanItems];

  // Fungsi untuk membuka dialog dengan data item yang dipilih
  const openDialog = (item) => {
    setSelectedItem(item);
    setVisible(true);
  };

  return (
    <div className={styles.newsContainer}>
      <div className={styles.newsContentWrapper}>
        {doubledNewsItems.map((item, index) => (
          <div className={styles.newsItem} key={index}>
            <div className={styles.imageContainer}>
              <img
                src={`http://localhost:5000${item.file_url}`}
                alt={item.title}
                className={styles.newsImage}
              />
            </div>
            <div className={styles.newsContent}>
              <div className={styles.newsHeader}>
                <span className={styles.newsDate}>
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
              <h4 className={styles.newsTitle}>{item.title}</h4>
              <Button
                label="Lihat Deskripsi"
                icon="pi pi-info-circle"
                className="p-button-text"
                onClick={() => openDialog(item)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dialog untuk menampilkan deskripsi */}
      {selectedItem && (
        <Dialog
          header={selectedItem.title}
          visible={visible}
          maximizable
          style={{ width: "80vw", borderRadius: "15px" }} // Lebar dialog ditambah
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
