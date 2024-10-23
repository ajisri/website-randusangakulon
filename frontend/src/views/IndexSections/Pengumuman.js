import React, { useRef, useEffect } from "react";
import useSWR from "swr";
import styles from "../../assets/css/Pengumuman.module.css";

// Fungsi fetcher untuk mengambil data dari API
const fetcher = (url) => fetch(url).then((res) => res.json());

const Pengumuman = () => {
  const containerRef = useRef(null);
  const { data: pengumumanData, error: pengumumanError } = useSWR(
    "http://localhost:5000/pengumumanpengunjung",
    fetcher
  );

  useEffect(() => {
    const container = containerRef.current;
    let scrollAmount = 0;
    const scrollSpeed = 1;

    const scroll = () => {
      scrollAmount += scrollSpeed;
      if (container) {
        container.scrollLeft = scrollAmount;

        // Reset scroll if it reaches half of the total content
        if (scrollAmount >= container.scrollWidth / 2) {
          scrollAmount = 0;
        }
      }

      requestAnimationFrame(scroll);
    };

    scroll(); // Start the scroll
    return () => cancelAnimationFrame(scroll);
  }, []);

  // Handle loading and error states
  if (pengumumanError) {
    return <div>Error loading data</div>;
  }

  if (!pengumumanData) {
    return <div>Loading...</div>;
  }

  const pengumumanItems = pengumumanData.pengumumans || [];
  const doubledNewsItems = [...pengumumanItems, ...pengumumanItems];

  return (
    <div ref={containerRef} className={styles.newsContainer}>
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

            {/* Gunakan dangerouslySetInnerHTML untuk menampilkan HTML dari API */}
            <div
              className={styles.newsDescription}
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Pengumuman;
