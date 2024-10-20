import React, { useState, useEffect } from "react";
import { Galleria } from "primereact/galleria";
import { PhotoService } from "./service/PhotoServices";

const Galeri = () => {
  const [images, setImages] = useState(null);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1200); // Tambahkan state untuk mengecek layar lebar

  const responsiveOptions = [
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
    PhotoService.getImages().then((data) => setImages(data));

    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 1200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const itemTemplate = (item) => {
    return (
      <img
        src={item.itemImageSrc}
        alt={item.alt}
        style={{
          width: "100%", // Lebar penuh
          height: isWideScreen ? "70vh" : "60vh", // Tinggi disesuaikan dengan ukuran layar
          objectFit: "cover",
          display: "block",
        }}
      />
    );
  };

  const thumbnailTemplate = (item) => {
    return (
      <img
        src={item.thumbnailImageSrc}
        alt={item.alt}
        style={{ display: "block" }}
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
        height: "100vh",
      }}
    >
      <Galleria
        value={images}
        responsiveOptions={responsiveOptions}
        numVisible={8}
        item={itemTemplate}
        thumbnail={thumbnailTemplate}
        caption={caption}
        style={{
          maxWidth: isWideScreen ? "100%" : "100%", // Sesuaikan lebar berdasarkan ukuran layar
          height: "100vh",
        }}
        showItemNavigators
      />
    </div>
  );
};

export default Galeri;
