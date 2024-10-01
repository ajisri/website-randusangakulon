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

import "./BatasWilayah.css"; // Custom CSS for styling

const BatasWilayah = () => {
  const [formData, setFormData] = useState({
    uuid: "",
    kategori: "",
    nilai: "",
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
    "http://localhost:5000/bataswilayah",
    fetcher
  );

  useEffect(() => {
    if (data?.batasWilayah) {
      setDataList(data.batasWilayah);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axiosJWT.patch(
          `http://localhost:5000/bataswilayah/${currentData.uuid}`,
          formData
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data updated successfully!",
          life: 3000,
        });
      } else {
        await axiosJWT.post("http://localhost:5000/cbataswilayah", formData);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data created successfully!",
          life: 3000,
        });
      }
      await mutate("http://localhost:5000/bataswilayah");
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
      kategori: "",
      nilai: "",
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
        await axiosJWT.delete(`http://localhost:5000/bataswilayah/${uuid}`);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data deleted successfully!",
          life: 3000,
        });
        await mutate("http://localhost:5000/bataswilayah");
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
      <h1 className="demografi-header">Batas Wilayah</h1>
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
        <Column field="kategori" header="Jenis Batas" />
        <Column field="nilai" header="Berbatasan Dengan" />
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
        header={isEditMode ? "Edit Batas Wilayah" : "Add Batas Wilayah"}
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
              <h3 className="section-title">Batas Wilayah Information</h3>
              <div className="form-group">
                <label htmlFor="Jenis Batas">Jenis Batas</label>
                <InputText
                  id="kategori"
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="Berbatasan dengan">Berbatasan dengan</label>
                <InputText
                  id="nilai"
                  name="nilai"
                  value={formData.nilai}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="button-sub">
                <Button
                  type="submit"
                  label={isEditMode ? "Update" : "Save"}
                  className="coastal-button submit-button p-button-rounded"
                />
              </div>
            </Card>
          </form>
        </div>
      </Dialog>
    </div>
  );
};

export default BatasWilayah;
