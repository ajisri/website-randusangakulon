import React, { Component } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

class KeuanganDesa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendapatanDesa: [],
      belanjaDesa: [],
      pembiayaanDesa: [],
    };
  }

  componentDidMount() {
    // Fetch data pendapatan desa
    fetch("/api/pendapatan-desa")
      .then((response) => response.json())
      .then((data) => this.setState({ pendapatanDesa: data }))
      .catch((error) =>
        console.error("Error fetching pendapatan desa:", error)
      );

    // Fetch data belanja desa
    fetch("/api/belanja-desa")
      .then((response) => response.json())
      .then((data) => this.setState({ belanjaDesa: data }))
      .catch((error) => console.error("Error fetching belanja desa:", error));

    // Fetch data pembiayaan desa
    fetch("/api/pembiayaan-desa")
      .then((response) => response.json())
      .then((data) => this.setState({ pembiayaanDesa: data }))
      .catch((error) =>
        console.error("Error fetching pembiayaan desa:", error)
      );
  }

  render() {
    const { pendapatanDesa, belanjaDesa, pembiayaanDesa } = this.state;

    return (
      <div>
        <h1>Keuangan Desa</h1>
        <TabView>
          <TabPanel header="Rincian Pendapatan Desa">
            <div className="p-3">
              <h2>Pendapatan Desa</h2>
              <DataTable value={pendapatanDesa} responsiveLayout="scroll">
                <Column field="kodeRekening" header="Kode Rekening" />
                <Column field="uraian" header="Uraian" />
                <Column field="anggaran" header="Anggaran (Rp.)" />
                <Column field="realisasi" header="Realisasi (Rp.)" />
                <Column field="lebihKurang" header="Lebih/Kurang" />
              </DataTable>
            </div>
          </TabPanel>
          <TabPanel header="Belanja Desa">
            <div className="p-3">
              <h2>Belanja Desa</h2>
              <DataTable value={belanjaDesa} responsiveLayout="scroll">
                <Column field="kodeRekening" header="Kode Rekening" />
                <Column field="uraian" header="Uraian" />
                <Column field="anggaran" header="Anggaran (Rp.)" />
                <Column field="realisasi" header="Realisasi (Rp.)" />
                <Column field="lebihKurang" header="Lebih/Kurang" />
              </DataTable>
            </div>
          </TabPanel>
          <TabPanel header="Pembiayaan Desa">
            <div className="p-3">
              <h2>Pembiayaan Desa</h2>
              <DataTable value={pembiayaanDesa} responsiveLayout="scroll">
                <Column field="kodeRekening" header="Kode Rekening" />
                <Column field="uraian" header="Uraian" />
                <Column field="anggaran" header="Anggaran (Rp.)" />
                <Column field="realisasi" header="Realisasi (Rp.)" />
                <Column field="lebihKurang" header="Lebih/Kurang" />
              </DataTable>
            </div>
          </TabPanel>
        </TabView>
      </div>
    );
  }
}

export default KeuanganDesa;
