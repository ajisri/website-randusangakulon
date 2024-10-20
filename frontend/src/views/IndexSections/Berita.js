import React, { useEffect, useState } from "react";

const Berita = () => {
  const newsItems = [
    {
      imgSrc: "https://via.placeholder.com/150",
      title: "World Famous Fish",
      author: "Bessie Cooper",
      date: "October 7",
      description: "Quisque sagittis purus sit amet volutpat consequat mauris.",
    },
    {
      imgSrc: "https://via.placeholder.com/150",
      title: "Extinction and Origination",
      author: "Jenna Clark",
      date: "October 10",
      description: "Bibendum enim facilisis gravida neque convallis a cras.",
    },
    {
      imgSrc: "https://via.placeholder.com/150",
      title: "World Famous Fish",
      author: "Bessie Cooper",
      date: "October 7",
      description: "Quisque sagittis purus sit amet volutpat consequat mauris.",
    },
    {
      imgSrc: "https://via.placeholder.com/150",
      title: "Extinction and Origination",
      author: "Jenna Clark",
      date: "October 10",
      description: "Bibendum enim facilisis gravida neque convallis a cras.",
    },
    {
      imgSrc: "https://via.placeholder.com/150",
      title: "World Famous Fish",
      author: "Bessie Cooper",
      date: "October 7",
      description: "Quisque sagittis purus sit amet volutpat consequat mauris.",
    },
    {
      imgSrc: "https://via.placeholder.com/150",
      title: "Extinction and Origination",
      author: "Jenna Clark",
      date: "October 10",
      description: "Bibendum enim facilisis gravida neque convallis a cras.",
    },
    // Add more news items as needed
  ];

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      style={{
        maxHeight: "600px",
        overflowY: "scroll",
        padding: "20px",
        width: isSmallScreen ? "100%" : "80%", // Ubah lebar sesuai dengan ukuran layar
        margin: "0 auto", // Center the news component
        height: "90vh",
        boxSizing: "border-box", // Pastikan padding dihitung dalam width
      }}
    >
      {newsItems.map((item, index) => (
        <div
          className="news-item"
          key={index}
          style={{
            display: "flex",
            marginBottom: "30px",
            flexDirection: "row", // Default flex row
            flexWrap: "wrap",
          }}
        >
          {/* Gambar di kiri */}
          <div
            style={{
              flex: "0 0 200px",
              marginRight: isSmallScreen ? "0" : "15px",
              marginBottom: isSmallScreen ? "15px" : "0",
            }}
          >
            <img
              src={item.imgSrc}
              alt={item.title}
              style={{
                width: "200px",
                height: "130px",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Konten berita di kanan */}
          <div
            style={{ flex: "1", fontSize: isSmallScreen ? "1rem" : "1.2rem" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: "#888" }}>{item.date}</span>
            </div>
            <h4
              style={{
                fontWeight: "bold",
                fontSize: "1.5rem",
                margin: "8px 0",
              }}
            >
              {item.title}
            </h4>
            <p style={{ margin: "0", color: "#666" }}>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Berita;
