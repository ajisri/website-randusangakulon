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
    uuid: "",
    nama: "",
    singkatan: "",
    dasar_hukum: "",
    alamat: "",
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
    if (data?.lembaga) {
      setDataList(data.lembaga);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuillChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axiosJWT.patch(
          `http://localhost:5000/lembaga/${currentData.uuid}`,
          formData
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data updated successfully!",
          life: 3000,
        });
      } else {
        await axiosJWT.post("http://localhost:5000/lembaga", formData);
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
      uuid: "",
      nama: "",
      singkatan: "",
      dasar_hukum: "",
      alamat: "",
      profil: "",
      visimisi: "",
      tugaspokok: "",
    });
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
        value={dataList}
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
        <Column field="alamat" header="Alamat" />
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
                <label htmlFor="alamat">Alamat</label>
                <InputText
                  id="alamat"
                  name="alamat"
                  value={formData.alamat}
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
