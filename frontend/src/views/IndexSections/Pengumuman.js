import React, { useEffect, useRef } from "react";
import styles from "../../assets/css/Pengumuman.module.css";

const Pengumuman = () => {
  const containerRef = useRef(null);

  const newsItems = [
    {
      imgSrc: "https://via.placeholder.com/150",
      title: "1",
      date: "October 7",
      description: "Quisque sagittis purus sit amet volutpat consequat mauris.",
    },
    {
      imgSrc: "https://via.placeholder.com/150",
      title: "2",
      date: "October 10",
      description: "Bibendum enim facilisis gravida neque convallis a cras.",
    },
    {
      imgSrc: "https://via.placeholder.com/150",
      title: "3",
      date: "October 7",
      description: "Quisque sagittis purus sit amet volutpat consequat mauris.",
    },
    {
      imgSrc: "https://via.placeholder.com/150",
      title: "4",
      date: "October 10",
      description: "Bibendum enim facilisis gravida neque convallis a cras.",
    },
    {
      imgSrc: "https://via.placeholder.com/150",
      title: "5",
      date: "October 7",
      description: "Quisque sagittis purus sit amet volutpat consequat mauris.",
    },
    {
      imgSrc: "https://via.placeholder.com/150",
      title: "6",
      date: "October 10",
      description: "Bibendum enim facilisis gravida neque convallis a cras.",
    },
  ];

  // Gandakan item berita untuk infinite scrolling
  const doubledNewsItems = [...newsItems, ...newsItems];

  useEffect(() => {
    const container = containerRef.current;
    let scrollAmount = 0;
    const scrollSpeed = 1; // Ubah sesuai kebutuhan

    const scroll = () => {
      scrollAmount += scrollSpeed;
      container.scrollLeft = scrollAmount;

      // Reset scroll jika sudah mencapai setengah dari total konten
      if (scrollAmount >= container.scrollWidth / 2) {
        scrollAmount = 0; // Reset untuk scroll kembali
      }

      requestAnimationFrame(scroll);
    };

    scroll(); // Mulai fungsi scroll
    return () => cancelAnimationFrame(scroll);
  }, []);

  return (
    <div ref={containerRef} className={styles.newsContainer}>
      {doubledNewsItems.map((item, index) => (
        <div className={styles.newsItem} key={index}>
          <div className={styles.imageContainer}>
            <img
              src={item.imgSrc}
              alt={item.title}
              className={styles.newsImage}
            />
          </div>
          <div className={styles.newsContent}>
            <div className={styles.newsHeader}>
              <span className={styles.newsDate}>{item.date}</span>
            </div>
            <h4 className={styles.newsTitle}>{item.title}</h4>
            <p className={styles.newsDescription}>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Pengumuman;
