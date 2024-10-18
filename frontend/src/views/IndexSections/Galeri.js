import React, { useState, useEffect } from "react";
import { Galleria } from "primereact/galleria";
import { PhotoService } from "./service/PhotoServices";

const Galeri = () => {
  const [images, setImages] = useState(null);
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
  }, []);

  const itemTemplate = (item) => {
    return (
      <img
        src={item.itemImageSrc}
        alt={item.alt}
        style={{ width: "100%", display: "block" }}
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
    <div className="card" style={{ width: "100%", margin: "0" }}>
      <Galleria
        value={images}
        responsiveOptions={responsiveOptions}
        numVisible={5}
        item={itemTemplate}
        thumbnail={thumbnailTemplate}
        caption={caption}
        style={{ maxWidth: "100%" }}
      />
    </div>
  );
};

export default Galeri;
