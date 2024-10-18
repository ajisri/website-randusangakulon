import React from "react";

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
    // Add more news items as needed
  ];

  return (
    <div
      style={{
        maxHeight: "400px",
        overflowY: "scroll",
        border: "1px solid #ddd",
        padding: "10px",
      }}
    >
      {newsItems.map((item, index) => (
        <div
          className="news-item"
          key={index}
          style={{
            display: "flex",
            marginBottom: "20px",
          }}
        >
          {/* Image on the left */}
          <div style={{ flex: "0 0 150px", marginRight: "15px" }}>
            <img
              src={item.imgSrc}
              alt={item.title}
              style={{ width: "150px", height: "100px", objectFit: "cover" }}
            />
          </div>

          {/* News content on the right */}
          <div style={{ flex: "1" }}>
            {/* Author and date */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <span style={{ fontWeight: "bold", marginRight: "10px" }}>
                {item.author}
              </span>
              <span style={{ color: "#888" }}>{item.date}</span>
            </div>

            {/* Title */}
            <h4
              style={{
                fontWeight: "bold",
                fontSize: "1.2rem",
                margin: "5px 0",
              }}
            >
              {item.title}
            </h4>

            {/* Description */}
            <p style={{ margin: "0", color: "#666" }}>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Berita;
