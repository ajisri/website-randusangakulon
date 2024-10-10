import React, { useState, useEffect, useCallback, useRef } from "react";
import useSWR, { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Dialog } from "primereact/dialog";
// import { Dropdown } from "primereact/dropdown";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import "./Lembaga.css"; // Custom CSS for styling

const Lembaga = () => {
  const [formData, setFormData] = useState({
    nama: "",
    singkatan: "",
    dasar_hukum: "",
    alamat_kantor: "",
    file_url: null,
    profil: "",
    visimisi: "",
    tugaspokok: "",
  });

  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [imagePreview, setImagePreview] = useState(null); // State untuk menyimpan URL gambar

  const navigate = useNavigate();
  const toast = useRef(null);
  const axiosJWT = useAuth(navigate);

  const fetcher = useCallback(
    async (url) => {
      const response = await axiosJWT.get(url);
      return response.data;
    },
    [axiosJWT]
  );

  const { data, error, isLoading } = useSWR(
    "http://localhost:5000/lembaga",
    fetcher
  );

  useEffect(() => {
    console.log(data); // Cek apakah data terdefinisi
    if (data?.lembaga) {
      setDataList(data.lembaga);
    }
  }, [data]);

  useEffect(() => {
    if (data?.lembaga) {
      const lembagaData = data.lembaga;
      setFormData({
        uuid: lembagaData.uuid,
        nama: lembagaData.nama,
        singkatan: lembagaData.singkatan,
        dasar_hukum: lembagaData.dasar_hukum,
        alamat_kantor: lembagaData.alamat_kantor,
        profil: lembagaData.profilLembaga?.content || "", // Ambil konten dari relasi profilLembaga
        visimisi: lembagaData.visiMisi?.content || "", // Ambil konten dari relasi visiMisi
        tugaspokok: lembagaData.tugasPokok?.content || "", // Ambil konten dari relasi tugasPokok
      });
    }
  }, [data]);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuillChange = (value, field) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, file_url: file });

    // Buat URL untuk menampilkan gambar
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Buat data payload untuk dikirim
    const data = new FormData();
    data.append("nama", formData.nama);
    data.append("singkatan", formData.singkatan);
    data.append("dasar_hukum", formData.dasar_hukum);
    data.append("alamat_kantor", formData.alamat_kantor);
    if (formData.file) {
      data.append("file", formData.file); // Upload file
    }
    data.append("profil", formData.profil);
    data.append("visimisi", formData.visimisi);
    data.append("tugaspokok", formData.tugaspokok);

    try {
      if (isEditMode) {
        await axiosJWT.put(
          `http://localhost:5000/clembaga/${currentData.uuid}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data updated successfully!",
          life: 3000,
        });
      } else {
        await axiosJWT.post("http://localhost:5000/clembaga", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data created successfully!",
          life: 3000,
        });
      }
      await mutate("http://localhost:5000/lembaga");
      resetForm();
      setDialogVisible(false);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 5000,
    });
  };

  const resetForm = () => {
    setFormData({
      nama: "",
      singkatan: "",
      dasar_hukum: "",
      alamat_kantor: "",
      file_url: null,
      profil: "",
      visimisi: "",
      tugaspokok: "",
    });
    setImagePreview(null);
    setEditMode(false);
    setCurrentData(null);
  };

  const editData = (data) => {
    setFormData(data);
    setCurrentData(data);
    setEditMode(true);
    setDialogVisible(true);
  };

  const deleteData = async (uuid) => {
    if (window.confirm("Are you sure you want to delete this data?")) {
      try {
        await axiosJWT.delete(`http://localhost:5000/lembaga/${uuid}`);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data deleted successfully!",
          life: 3000,
        });
        await mutate("http://localhost:5000/lembaga");
      } catch (error) {
        handleError(error);
      }
    }
  };

  const openDialog = () => {
    resetForm();
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
  };

  const renderHeader = () => {
    return (
      <div className="table-header">
        <span className="p-input-icon-left search-container">
          <InputText
            type="search"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Pencarian"
            className="search-input"
            style={{ width: "300px" }}
          />
        </span>
        <Button
          label="Add Data"
          onClick={openDialog}
          className="add-data-button p-button-rounded p-button-success"
          icon="pi pi-plus"
        />
      </div>
    );
  };

  const header = renderHeader();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div>
      <h1 className="demografi-header">Lembaga</h1>
      <Toast ref={toast} />
      <DataTable
        value={dataList || []}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        filters={filters}
        header={header}
        filterDisplay="menu"
      >
        <Column field="nama" header="Nama Lembaga" />
        <Column field="singkatan" header="Singkatan" />
        <Column field="dasar_hukum" header="Dasar Hukum" />
        <Column field="alamat_kantor" header="alamat_kantor" />
        <Column
          body={(rowData) => (
            <div
              className="edit-delete-buttons"
              style={{ display: "flex", gap: "0.5rem" }}
            >
              <Button
                icon="pi pi-pencil"
                className="edit-button coastal-button p-button-rounded"
                onClick={() => editData(rowData)}
              />
              <Button
                icon="pi pi-trash"
                className="delete-button coastal-button p-button-rounded"
                onClick={() => deleteData(rowData.uuid)}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog
        header={isEditMode ? "Edit Lembaga" : "Add Lembaga"}
        visible={isDialogVisible}
        onHide={closeDialog}
        dismissableMask={true}
        modal={true}
        style={{ width: "70vw" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Card className="demografi-card" style={{ padding: "20px" }}>
              <h3 className="section-title">Informasi Lembaga</h3>
              <div className="form-group">
                <label htmlFor="nama">Nama Lembaga</label>
                <InputText
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="singkatan">Singkatan</label>
                <InputText
                  id="singkatan"
                  name="singkatan"
                  value={formData.singkatan}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dasar_hukum">Dasar Hukum</label>
                <InputText
                  id="dasar_hukum"
                  name="dasar_hukum"
                  value={formData.dasar_hukum}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="alamat_kantor">alamat_kantor</label>
                <InputText
                  id="alamat_kantor"
                  name="alamat_kantor"
                  value={formData.alamat_kantor}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <label>Profil Lembaga</label>
                <ReactQuill
                  value={formData.profil}
                  onChange={(value) => handleQuillChange(value, "profil")}
                  className="quill-editor"
                />
              </div>
              <div className="form-group">
                <label>Visi Misi</label>
                <ReactQuill
                  value={formData.visimisi}
                  onChange={(value) => handleQuillChange(value, "visimisi")}
                  className="quill-editor"
                />
              </div>
              <div className="form-group">
                <label>Tugas Pokok</label>
                <ReactQuill
                  value={formData.tugaspokok}
                  onChange={(value) => handleQuillChange(value, "tugaspokok")}
                  className="quill-editor"
                />
              </div>
              <div className="form-group">
                <label>Upload File</label>
                <input type="file" onChange={handleFileChange} />
                {imagePreview && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                )}
              </div>
              <Button
                type="submit"
                label={isEditMode ? "Update Data" : "Add Data"}
                icon="pi pi-check"
                className="p-button-rounded p-button-success submit-button"
                style={{ width: "100%" }}
              />
            </Card>
          </form>
        </div>
      </Dialog>
    </div>
  );
};

export default Lembaga;
