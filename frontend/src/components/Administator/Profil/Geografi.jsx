import React, { useState } from "react";
import { Steps } from "primereact/steps";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./Geografi.css";

const Geografi = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const batasWilayahDesa = [
    { id: 1, category: "Deskel Sebelah Utara", value: "LAUT JAWA" },
    { id: 2, category: "Deskel Sebelah Selatan", value: "LIMBANGAN WETAN" },
    { id: 3, category: "Deskel Sebelah Timur", value: "RANDUSANGA WETAN" },
    { id: 4, category: "Deskel Sebelah Barat", value: "KALIWLINGI" },
  ];

  const orbitasiDesa = [
    { id: 1, category: "Jarak Ke Ibu Kota Kecamatan", value: "6 Km" },
    {
      id: 2,
      category:
        "Lama Jarak Tempuh Ke Ibu Kota Kecamatan Dgn Kendaraan Bermotor",
      value: "0.25 Jam",
    },
    {
      id: 3,
      category: "Lama Jarak Tempuh Ke Ibu Kota Kecamatan",
      value: "1.3 Jam",
    },
    {
      id: 4,
      category: "Kendaraan Umum Ke Ibu Kota Kecamatan",
      value: "0 Unit",
    },
    { id: 5, category: "Jarak Ke Ibu Kota Kabkota", value: "5 Km" },
  ];

  const jenisLahan = [
    { id: 1, jenis: "SAWAH IRIGASI TEKNIS", luas: "24.47 Ha." },
    { id: 2, jenis: "SAWAH IRIGASI SETENGAH TEKNIS", luas: "0 Ha." },
    { id: 3, jenis: "SAWAH TADAH HUJAN", luas: "0 Ha." },
    { id: 4, jenis: "PEMUKIMAN", luas: "90 Ha." },
    { id: 5, jenis: "PEKARANGAN", luas: "12.21 Ha." },
    { id: 6, jenis: "LUAS TANAH SAWAH", luas: "24.47 Ha." },
  ];

  const potensiWisata = [
    { id: 1, jenis: "Laut", luas: "50 Ha." },
    { id: 2, jenis: "Danau", luas: "Ha." },
  ];

  const items = [
    { label: "Batas Wilayah" },
    { label: "Orbitasi Desa" },
    { label: "Jenis Lahan" },
    { label: "Potensi Wisata" },
  ];

  const onCellEditComplete = (e) => {
    const { rowData, newValue, field } = e;

    if (newValue.trim().length > 0) {
      rowData[field] = newValue;
    } else {
      e.preventDefault();
    }
  };

  const handleNext = () => {
    if (activeIndex < items.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handleBack = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const renderContent = () => {
    switch (activeIndex) {
      case 0:
        return (
          <div className="batas-wilayah-animation">
            {/* Animasi batas wilayah bisa ditambahkan di sini */}
            <h4>Animasi Batas Wilayah</h4>
          </div>
        );
      case 1:
        return (
          <div className="orbitasi-desa-animation">
            {/* Animasi orbitasi desa bisa ditambahkan di sini */}
            <h4>Animasi Orbitasi Desa</h4>
          </div>
        );
      case 2:
        const luasLahanData = {
          labels: jenisLahan.map((item) => item.jenis),
          datasets: [
            {
              data: jenisLahan.map((item) => parseFloat(item.luas)),
              backgroundColor: [
                "#42A5F5",
                "#66BB6A",
                "#FFA726",
                "#26A69A",
                "#FF7043",
                "#8D6E63",
              ],
            },
          ],
        };
        return (
          <div>
            <Chart type="pie" data={luasLahanData} />
            <h6 className="text-center">
              Luas Wilayah Berdasarkan Jenis Lahan
            </h6>
          </div>
        );
      case 3:
        const potensiWisataData = {
          labels: potensiWisata.map((item) => item.jenis),
          datasets: [
            {
              data: potensiWisata.map((item) => parseFloat(item.luas)),
              backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "#26A69A"],
            },
          ],
        };
        return (
          <div>
            <Chart type="pie" data={potensiWisataData} />
            <h6 className="text-center">
              Potensi Wisata Berdasarkan Luas Wilayah
            </h6>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`geografi-container ${activeIndex >= 2 ? "shifted-left" : ""}`}
    >
      <div className="geografi-main">
        <h3>Informasi Desa</h3>
        <Steps
          model={items}
          activeIndex={activeIndex}
          onSelect={(e) => setActiveIndex(e.index)}
        />
        <div className="geografi-content">
          <div className="geografi-steps">
            {activeIndex === 0 && (
              <DataTable
                value={batasWilayahDesa}
                paginator
                rows={10}
                editMode="cell"
                onCellEditComplete={onCellEditComplete}
              >
                <Column
                  field="category"
                  header="Kategori"
                  style={{ width: "25rem" }}
                />
                <Column
                  field="value"
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
            {activeIndex === 1 && (
              <DataTable
                value={orbitasiDesa}
                paginator
                rows={10}
                className="p-datatable-gridlines"
                editMode="cell"
                onCellEditComplete={onCellEditComplete}
              >
                <Column
                  field="category"
                  header="Kategori"
                  style={{ width: "25rem" }}
                />
                <Column
                  field="value"
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
            {activeIndex === 2 && (
              <DataTable
                value={jenisLahan}
                paginator
                rows={10}
                className="p-datatable-gridlines"
                editMode="cell"
                onCellEditComplete={onCellEditComplete}
              >
                <Column
                  field="jenis"
                  header="Jenis Lahan"
                  style={{ width: "25rem" }}
                />
                <Column
                  field="luas"
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
            {activeIndex === 3 && (
              <DataTable
                value={potensiWisata}
                paginator
                rows={10}
                className="p-datatable-gridlines"
                editMode="cell"
                onCellEditComplete={onCellEditComplete}
              >
                <Column
                  field="jenis"
                  header="Jenis Potensi Wisata"
                  style={{ width: "25rem" }}
                />
                <Column
                  field="luas"
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
            <div className="geografi-charts">{renderContent()}</div>
          )}
        </div>

        <div className="mt-4 d-flex justify-content-between">
          <Button
            label="Kembali"
            onClick={handleBack}
            disabled={activeIndex === 0}
          />
          <Button
            label="Lanjut"
            onClick={handleNext}
            disabled={activeIndex === items.length - 1}
          />
        </div>
      </div>
    </div>
  );
};

export default Geografi;
