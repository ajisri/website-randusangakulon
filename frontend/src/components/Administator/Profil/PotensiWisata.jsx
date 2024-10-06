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

import "./PotensiWisata.css"; // Custom CSS for styling

const PotensiWisata = () => {
  const [formData, setFormData] = useState({
    uuid: "",
    jenis: "",
    luas: "",
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
    "http://localhost:5000/potensiwisata",
    fetcher
  );

  useEffect(() => {
    if (data?.potensiWisata) {
      setDataList(data.potensiWisata);
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
          `http://localhost:5000/potensiwisata/${currentData.uuid}`,
          formData
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data updated successfully!",
          life: 3000,
        });
      } else {
        await axiosJWT.post("http://localhost:5000/cpotensiwisata", formData);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data created successfully!",
          life: 3000,
        });
      }
      await mutate("http://localhost:5000/potensiwisata");
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
      jenis: "",
      luas: "",
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
        await axiosJWT.delete(`http://localhost:5000/potensiwisata/${uuid}`);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data deleted successfully!",
          life: 3000,
        });
        await mutate("http://localhost:5000/potensiwisata");
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
      <h1 className="demografi-header">Lokasi</h1>
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
        <Column field="jenis" header="Lokasi" bodyClassName="lokasi-column" />
        <Column
          field="luas"
          header="Luas"
          bodyClassName="luas-column"
          body={(rowData) => `${rowData.luas} Ha`}
        />

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
        header={isEditMode ? "Edit Jenis Lahan" : "Add Jenis Lahan"}
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
              <h3 className="section-title">Informasi Potensi Wisata</h3>
              <div className="form-group">
                <label htmlFor="Jenis">Lokasi</label>
                <InputText
                  id="jenis"
                  name="jenis"
                  value={formData.jenis}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="Luas">Luas</label>
                <div className=" p-inputgroup w-full md:w-30rem">
                  <InputText
                    id="luas"
                    name="luas"
                    value={formData.luas}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                  <span className="p-inputgroup-addon rounded-addon">Ha</span>
                </div>
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

export default PotensiWisata;
