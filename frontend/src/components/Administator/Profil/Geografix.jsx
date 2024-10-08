import React, { useState, useEffect } from "react";
import { Steps } from "primereact/steps";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import useSWR from "swr";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./Geografix.css";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Geografix = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [batasWilayahDesa, setBatasWilayahDesa] = useState([]);
  const [orbitasiDesa, setOrbitasiDesa] = useState([]);
  const [jenisLahan, setJenisLahan] = useState([]);
  const [potensiWisata, setPotensiWisata] = useState([]);

  const {
    data: batasWilayahData,
    error: batasWilayahError,
    isLoading: isBatasWilayahLoading,
  } = useSWR("http://localhost:5000/batawilayahpengunjung", fetcher);

  const {
    data: orbitasiData,
    error: orbitasiError,
    isLoading: isOrbitasiLoading,
  } = useSWR("http://localhost:5000/orbitasipengunjung", fetcher);
  const {
    data: jenisLahanData,
    error: jenisLahanError,
    isLoading: isJenisLahanLoading,
  } = useSWR("http://localhost:5000/jenislahanpengunjung", fetcher);
  const {
    data: potensiWisataData,
    error: potensiWisataError,
    isLoading: isPotensiWisataLoading,
  } = useSWR("http://localhost:5000/potensiwisatapengunjung", fetcher);

  useEffect(() => {
    if (batasWilayahData?.batasWilayah) {
      setBatasWilayahDesa(batasWilayahData.batasWilayah);
    }
  }, [batasWilayahData]);

  useEffect(() => {
    if (orbitasiData?.orbitasi) {
      setOrbitasiDesa(orbitasiData.orbitasi);
    }
  }, [orbitasiData]);

  useEffect(() => {
    if (jenisLahanData?.jenisLahan) {
      setJenisLahan(jenisLahanData.jenisLahan);
    }
  }, [jenisLahanData]);

  useEffect(() => {
    if (potensiWisataData?.potensiWisata) {
      setPotensiWisata(potensiWisataData.potensiWisata);
    }
  }, [potensiWisataData]);

  const handleNext = () => {
    if (activeIndex < 3) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handleBack = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const JenisLahanChart = () => {
    const totalLuasPerJenis = jenisLahan.reduce((acc, item) => {
      if (acc[item.jenis]) {
        acc[item.jenis] += item.luas;
      } else {
        acc[item.jenis] = item.luas;
      }
      return acc;
    }, {});

    const data = {
      labels: Object.keys(totalLuasPerJenis),
      datasets: [
        {
          data: Object.values(totalLuasPerJenis),
          backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "#26A69A"],
        },
      ],
    };

    return (
      <div>
        <Chart type="pie" data={data} />
        <h6 className="text-center">
          Total Luas Wilayah Berdasarkan Jenis Lahan
        </h6>
      </div>
    );
  };

  // Chart untuk Potensi Wisata
  const PotensiWisataChart = () => {
    const totalLuasPerJenis = potensiWisata.reduce((acc, item) => {
      if (acc[item.jenis]) {
        acc[item.jenis] += item.luas;
      } else {
        acc[item.jenis] = item.luas;
      }
      return acc;
    }, {});

    const data = {
      labels: Object.keys(totalLuasPerJenis),
      datasets: [
        {
          data: Object.values(totalLuasPerJenis),
          backgroundColor: ["#FF7043", "#8D6E63", "#26A69A", "#FFA726"],
        },
      ],
    };

    return (
      <div>
        <Chart type="pie" data={data} />
        <h6 className="text-center">Total Luas Berdasarkan Potensi Wisata</h6>
      </div>
    );
  };

  if (
    isPotensiWisataLoading ||
    isBatasWilayahLoading ||
    isJenisLahanLoading ||
    isOrbitasiLoading
  )
    return <p>Loading...</p>;
  if (
    potensiWisataError ||
    batasWilayahError ||
    jenisLahanError ||
    orbitasiError
  )
    return <p>Error fetching data</p>;

  return (
    <div
      className={`geografi-container ${activeIndex >= 2 ? "shifted-left" : ""}`}
    >
      <div className="geografi-main">
        <h3>Informasi Desa</h3>
        <Steps
          model={[
            { label: "Batas Wilayah" },
            { label: "Orbitasi Desa" },
            { label: "Jenis Lahan" },
            { label: "Potensi Wisata" },
          ]}
          activeIndex={activeIndex}
          onSelect={(e) => setActiveIndex(e.index)}
        />
        <div className="geografi-content">
          <div className="geografi-steps">
            {activeIndex === 0 && isBatasWilayahLoading && (
              <div>Loading data...</div>
            )}
            {activeIndex === 0 && batasWilayahError && (
              <div>Error loading data!</div>
            )}
            {activeIndex === 0 && batasWilayahDesa.length > 0 && (
              <DataTable value={batasWilayahDesa} paginator rows={10}>
                <Column
                  field="kategori" // Menggunakan 'kategori' dari respons API
                  header="Kategori"
                  style={{ width: "100rem" }}
                />
                <Column
                  field="nilai" // Menggunakan 'nilai' dari respons API
                  header="Nilai"
                  editor={(options) => (
                    <input
                      type="text"
                      value={options.value}
                      onChange={(e) => options.editorCallback(e.target.value)}
                    />
                  )}
                  style={{ width: "35rem" }}
                />
              </DataTable>
            )}
            {activeIndex === 1 && isOrbitasiLoading && (
              <div>Loading data...</div>
            )}
            {activeIndex === 1 && orbitasiError && (
              <div>Error loading data!</div>
            )}
            {activeIndex === 1 && orbitasiDesa.length > 0 && (
              <DataTable value={orbitasiDesa} paginator rows={10}>
                <Column
                  field="kategori" // Menggunakan 'kategori' dari API
                  header="Kategori"
                  style={{ width: "190rem" }}
                />
                <Column
                  field="nilai" // Menggunakan 'nilai' dari API
                  header="Nilai"
                  editor={(options) => (
                    <input
                      type="text"
                      value={options.value}
                      onChange={(e) => options.editorCallback(e.target.value)}
                    />
                  )}
                  style={{ width: "25rem" }}
                />
              </DataTable>
            )}
            {activeIndex === 2 && isJenisLahanLoading && (
              <div>Loading data...</div>
            )}
            {activeIndex === 2 && jenisLahanError && (
              <div>Error loading data!</div>
            )}
            {activeIndex === 2 && jenisLahan.length > 0 && (
              <DataTable value={jenisLahan} paginator rows={10}>
                <Column
                  field="jenis" // Menggunakan 'jenis' dari API
                  header="Jenis Lahan"
                  style={{ width: "25rem" }}
                />
                <Column
                  field="nama" // Menggunakan 'jenis' dari API
                  header="Nama Lahan"
                  style={{ width: "25rem" }}
                />
                <Column
                  field="luas" // Menggunakan 'luas' dari API
                  header="Luas (Ha)"
                  editor={(options) => (
                    <input
                      type="text"
                      value={options.value}
                      onChange={(e) => options.editorCallback(e.target.value)}
                    />
                  )}
                  style={{ width: "25rem" }}
                />
              </DataTable>
            )}
            {activeIndex === 3 && isPotensiWisataLoading && (
              <div>Loading data...</div>
            )}
            {activeIndex === 3 && potensiWisataError && (
              <div>Error loading data!</div>
            )}
            {activeIndex === 3 && potensiWisata.length > 0 && (
              <DataTable value={potensiWisata} paginator rows={10}>
                <Column
                  field="jenis" // Menggunakan 'jenis' dari API
                  header="Jenis Potensi Wisata"
                  style={{ width: "25rem" }}
                />
                <Column
                  field="luas" // Menggunakan 'luas' dari API
                  header="Luas (Ha)"
                  editor={(options) => (
                    <input
                      type="text"
                      value={options.value}
                      onChange={(e) => options.editorCallback(e.target.value)}
                    />
                  )}
                  style={{ width: "25rem" }}
                />
              </DataTable>
            )}
          </div>
          {activeIndex >= 2 && (
            <div className="geografi-charts">
              {activeIndex === 2 && <JenisLahanChart />}
              {activeIndex === 3 && <PotensiWisataChart />}
            </div>
          )}
        </div>

        <div className="mt-4 d-flex justify-content-between">
          <Button
            label="Kembali"
            className={`custom-button ${
              activeIndex === 0 ? "p-button-disabled" : ""
            }`}
            onClick={handleBack}
            disabled={activeIndex === 0}
          />
          <Button
            label="Lanjut"
            className={`custom-button ${
              activeIndex === 3 ? "p-button-disabled" : ""
            }`}
            onClick={handleNext}
            disabled={activeIndex === 3}
          />
        </div>
      </div>
    </div>
  );
};

export default Geografix;
