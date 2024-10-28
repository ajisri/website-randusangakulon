import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { Galleria } from "primereact/galleria";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Galeri = () => {
  const { data: galeriData, error: galeriError } = useSWR(
    "http://localhost:5000/galeripengunjung",
    fetcher
  );
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1200); // Tambahkan state untuk mengecek layar lebar

  const responsiveOptions = [
    {
      breakpoint: "1200px", // Untuk layar lebar (desktop)
      numVisible: 5,
    },
    {
      breakpoint: "991px", // Untuk layar sedang (tablet potret)
      numVisible: 4,
    },
    {
      breakpoint: "767px", // Untuk layar kecil (tablet lanskap/ponsel besar)
      numVisible: 3,
    },
    {
      breakpoint: "575px", // Untuk layar sangat kecil (ponsel)
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

  // Ubah data API sesuai dengan format yang dibutuhkan oleh Galleria
  const images = galeriData.galeris.map((item) => ({
    itemImageSrc: `http://localhost:5000${item.file_url}`, // Gambar utama
    thumbnailImageSrc: `http://localhost:5000${item.file_url}`, // Gambar thumbnail
    alt: item.title,
    title: item.title,
  }));

  const itemTemplate = (item) => {
    return (
      <div
        style={{
          width: "100%",
          height: isWideScreen ? "70vh" : "60vh",
          overflow: "hidden",
        }}
      >
        <img
          src={item.itemImageSrc}
          alt={item.alt}
          style={{
            width: "100%", // Lebar penuh
            height: "100%", // Tinggi penuh
            objectFit: "contain", // Menjaga gambar agar tidak terpotong
            display: "block",
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
          width: "80px", // Atur lebar thumbnail
          height: "60px", // Atur tinggi thumbnail
          objectFit: "cover", // Pastikan gambar sesuai area tanpa distorsi
          borderRadius: "5px", // Jika ingin menambahkan sedikit efek rounded
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
        height: "100vh",
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
          maxWidth: isWideScreen ? "100%" : "100%", // Sesuaikan lebar berdasarkan ukuran layar
          height: "100vh",
        }}
        showItemNavigators
        showThumbnailNavigators
      />
    </div>
  );
};

export default Galeri;
