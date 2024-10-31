import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { Galleria } from "primereact/galleria";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Galeri = () => {
  const { data: galeriData, error: galeriError } = useSWR(
    "http://localhost:5000/galeripengunjung",
    fetcher
  );
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1200);

  const responsiveOptions = [
    {
      breakpoint: "1200px",
      numVisible: 5,
    },
    {
      breakpoint: "991px",
      numVisible: 4,
    },
    {
      breakpoint: "767px",
      numVisible: 3,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 1200);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (galeriError) {
    return <div>Error loading images</div>;
  }

  if (!galeriData) {
    return <div>Loading...</div>;
  }

  const images = galeriData.galeris.map((item) => ({
    itemImageSrc: `http://localhost:5000${item.file_url}`,
    thumbnailImageSrc: `http://localhost:5000${item.file_url}`,
    alt: item.title,
    title: item.title,
  }));

  const itemTemplate = (item) => {
    return (
      <div
        style={{
          width: "100%",
          height: isWideScreen ? "70vh" : "60vh",
          maxHeight: "80vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 50%, #E0E0E0 100%)",
        }}
      >
        <img
          src={item.itemImageSrc}
          alt={item.alt}
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
            display: "block",
            maxHeight: isWideScreen ? "70vh" : "60vh",
          }}
        />
      </div>
    );
  };

  const thumbnailTemplate = (item) => {
    return (
      <img
        src={item.thumbnailImageSrc}
        alt={item.alt}
        style={{
          display: "block",
          width: "80px",
          height: "60px",
          objectFit: "cover",
          borderRadius: "8px",
          margin: "2px",
          border: "2px solid black",
          padding: "2px",
        }}
      />
    );
  };

  const caption = (item) => {
    return (
      <>
        <div className="text-xl mb-2 font-bold">{item.title}</div>
        <p className="text-white">{item.alt}</p>
      </>
    );
  };

  return (
    <div
      className="card"
      style={{
        width: "100%",
        margin: "0",
        height: "90vh",
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 50%, #E0E0E0 100%)",
        border: "1px solid black",
        boxSizing: "border-box",
        padding: "10px",
        borderRadius: "5px",
      }}
    >
      <Galleria
        value={images}
        responsiveOptions={responsiveOptions}
        numVisible={5}
        item={itemTemplate}
        thumbnail={thumbnailTemplate}
        caption={caption}
        style={{
          maxWidth: "100%",
          height: "100%",
          background: "none",
        }}
        showItemNavigators
        showThumbnailNavigators
        itemStyle={{ border: "none" }}
      />
    </div>
  );
};

export default Galeri;
