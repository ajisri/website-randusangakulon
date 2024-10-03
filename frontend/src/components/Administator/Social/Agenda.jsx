import React, { useState, useEffect, useCallback, useRef } from "react";
import useSWR, { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Dialog } from "primereact/dialog";
import "./Agenda.css"; // Custom CSS for styling

const Agenda = () => {
  const [formData, setFormData] = useState({
    uuid: "",
    nama_agenda: "",
    deskripsi: "",
    tempat_pelaksanaan: "",
    tanggal_agenda: null,
  });

  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [currentAgenda, setCurrentAgenda] = useState(null);
  const [agendaList, setAgendaList] = useState([]);
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

  const {
    data: agendaData,
    error,
    isLoading,
  } = useSWR("http://localhost:5000/agenda", fetcher);

  useEffect(() => {
    if (agendaData?.agenda) {
      setAgendaList(agendaData.agenda);
    }
  }, [agendaData]);

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

  const handleDateChange = (e) => {
    const selectedDate = e.value;
    const year = selectedDate.getFullYear();
    const month = ("0" + (selectedDate.getMonth() + 1)).slice(-2); // Tambahkan padding 0 untuk bulan
    const day = ("0" + selectedDate.getDate()).slice(-2); // Tambahkan padding 0 untuk hari
    const formattedDate = `${year}-${month}-${day}`; // Format yyyy-mm-dd
    setFormData({ ...formData, tanggal_agenda: formattedDate });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axiosJWT.patch(
          `http://localhost:5000/agenda/${currentAgenda.uuid}`,
          formData
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Agenda updated successfully!",
          life: 3000,
        });
      } else {
        await axiosJWT.post("http://localhost:5000/cagenda", formData);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Agenda created successfully!",
          life: 3000,
        });
      }
      await mutate("http://localhost:5000/agenda");
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
      nama_agenda: "",
      deskripsi: "",
      tempat_pelaksanaan: "",
      tanggal_agenda: null,
    });
    setEditMode(false);
    setCurrentAgenda(null);
  };

  const editAgenda = (agenda) => {
    setFormData(agenda);
    setCurrentAgenda(agenda);
    setEditMode(true);
    setDialogVisible(true);
  };

  const deleteAgenda = async (uuid) => {
    if (window.confirm("Are you sure you want to delete this agenda?")) {
      try {
        await axiosJWT.delete(`http://localhost:5000/agenda/${uuid}`);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Agenda deleted successfully!",
          life: 3000,
        });
        await mutate("http://localhost:5000/agenda");
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

  const customFilter = (value, filter) => {
    if (!filter) return true;

    // Konversi nilai tanggal yang ada di rowData
    const dateValue = new Date(value);

    if (isNaN(dateValue.getTime())) {
      return false; // Jika tanggal tidak valid, return false
    }

    // Format tanggal menjadi "MMMM yyyy" (contoh: "September 2024")
    const formattedDate = dateValue.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });

    // Cek apakah nilai filter (misal: "September") ada di formattedDate
    return formattedDate.toLowerCase().includes(filter.toLowerCase());
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
            style={{ width: "300px" }} // Increased width for search input
          />
        </span>
        <div
          className="date-format-info"
          style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}
        >
          <i
            className="pi pi-question-circle"
            data-pr-tooltip="Gunakan format yyyy-mm-dd untuk pencarian tanggal"
            data-pr-position="right"
            style={{ fontSize: "1.5em", cursor: "pointer" }}
          ></i>
          <Tooltip target=".pi-question-circle" />
        </div>
        <div className="add-data-container">
          <Button
            label="Add Data"
            onClick={openDialog}
            className="add-data-button p-button-rounded p-button-success"
            icon="pi pi-plus"
            style={{ backgroundColor: "#00796B", color: "#ffffff" }} // Elegant teal color
          />
        </div>
      </div>
    );
  };

  const header = renderHeader();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div>
      <h1 className="demografi-header">Agenda</h1>
      <Toast ref={toast} />
      <DataTable
        value={agendaList}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        filters={filters}
        header={header}
        filterDisplay="menu"
      >
        <Column field="nama_agenda" header="Nama Agenda" />
        <Column field="deskripsi" header="Deskripsi" />
        <Column field="tempat_pelaksanaan" header="Tempat Pelaksanaan" />
        <Column
          field="tanggal_agenda"
          header="Tanggal"
          body={(rowData) =>
            new Date(rowData.tanggal_agenda).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          }
          filter
          filterFunction={customFilter} // Menerapkan custom filter
          showFilterMenu={false} // Hanya akan menggunakan filter custom
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
                onClick={() => editAgenda(rowData)}
                tooltip="Edit"
                style={{
                  backgroundColor: "#4DB6AC",
                  border: "none",
                  color: "white",
                }}
              />
              <Button
                icon="pi pi-trash"
                className="delete-button coastal-button p-button-rounded"
                onClick={() => deleteAgenda(rowData.uuid)}
                tooltip="Delete"
                style={{
                  backgroundColor: "#009688",
                  border: "none",
                  color: "white",
                }}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog
        header={isEditMode ? "Edit Agenda" : "Add Agenda"}
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
            height: "100%",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Card
              className="demografi-card"
              style={{
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                padding: "20px",
              }}
            >
              <h3 className="section-title" style={{ color: "#00796B" }}>
                Agenda Information
              </h3>
              <div className="form-group">
                <label htmlFor="nama_agenda">Nama Agenda</label>
                <InputText
                  id="nama_agenda"
                  name="nama_agenda"
                  value={formData.nama_agenda}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="deskripsi">Deskripsi</label>
                <InputTextarea
                  id="deskripsi"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  className="input-field"
                  rows={5}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="tempat_pelaksanaan">Tempat Pelaksanaan</label>
                <InputText
                  id="tempat_pelaksanaan"
                  name="tempat_pelaksanaan"
                  value={formData.tempat_pelaksanaan}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="tanggal_agenda">Tanggal Agenda</label>
                <Calendar
                  id="tanggal_agenda"
                  name="tanggal_agenda"
                  value={
                    formData.tanggal_agenda
                      ? new Date(formData.tanggal_agenda)
                      : null
                  }
                  onChange={handleDateChange}
                  showIcon
                  className="input-field"
                  dateFormat="yy-mm-dd"
                />
              </div>
              <div className="button-sub">
                <Button
                  type="submit"
                  label={isEditMode ? "Update" : "Save"}
                  className="coastal-button submit-button p-button-rounded"
                  style={{ marginTop: "20px" }}
                />
              </div>
            </Card>
          </form>
        </div>
      </Dialog>
    </div>
  );
};

export default Agenda;
