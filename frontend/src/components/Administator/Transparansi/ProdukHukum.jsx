import React, { useState, useEffect, useCallback, useRef } from "react";
import useSWR, { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { RadioButton } from "primereact/radiobutton";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Dialog } from "primereact/dialog";
import "./ProdukHukum.css"; // Custom CSS for styling

const Produkhukum = () => {
  const [formData, setFormData] = useState({
    name: "",
    deskrispsi: "",
    waktu: null,
    file_url: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [currentProdukhukum, setCurrentProdukhukum] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }, // Use FilterMatchMode
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
    data: produkhukumData,
    error,
    isLoading,
  } = useSWR("http://localhost:5000/produk_hukum", fetcher);

  useEffect(() => {
    if (produkhukumData?.produkhukums) {
      setProdukhukumList(produkhukumData.produkhukums);
    }
  }, [produkhukumData]);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
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
            style={{ width: "300px" }} // Increased width for search input
          />
        </span>
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

  const [ProdukhukumList, setProdukhukumList] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const selectedDate = e.value;
    if (selectedDate) {
      // Create a new Date object, and ensure it's set to the start of the day in UTC
      const adjustedDate = new Date(
        Date.UTC(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        )
      );
      setFormData({
        ...formData,
        birth_date: adjustedDate.toISOString().split("T")[0], // Format to yyyy-mm-dd
      });
    } else {
      setFormData({ ...formData, birth_date: null });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      dataToSend.append(key, formData[key]);
    });
    if (selectedFile) {
      dataToSend.append("file", selectedFile);
    }

    try {
      if (isEditMode) {
        await axiosJWT.put(
          `http://localhost:5000/produk_hukum/${currentProdukhukum.uuid}`,
          dataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data updated successfully!",
          life: 3000,
        });
      } else {
        await axiosJWT.post("http://localhost:5000/cprodukhukum", dataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data saved successfully!",
          life: 3000,
        });
      }

      await mutate("http://localhost:5000/produk_hukum");
      resetForm();
      setDialogVisible(false);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      if (error.response.data.errors) {
        const messages = error.response.data.errors.map((err) => err.msg) || [];
        messages.forEach((msg) => {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: msg,
            life: 5000,
          });
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.response.data.message || "An unexpected error occurred",
          life: 5000,
        });
      }
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An unexpected error occurred",
        life: 5000,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      deskrispsi: "",
      waktu: null,
      file_url: "",
    });
    setSelectedFile(null);
    setPreview(null);
    setEditMode(false);
    setCurrentProdukhukum(null);
  };

  const [detailDialogVisible, setDetailDialogVisible] = useState(false);
  const [selectedProdukhukum, setSelectedProdukhukum] = useState(null);

  const showDetails = (rowData) => {
    setSelectedProdukhukum(rowData);
    setDetailDialogVisible(true);
  };

  const editProdukhukum = (produkhukum) => {
    setFormData(produkhukum);
    setSelectedFile(null);
    const fileUrl = produkhukum.file_url
      ? `http://localhost:5000${produkhukum.file_url}`
      : null;
    // console.log("File URL:", fileUrl);
    setPreview(fileUrl); // Set preview to the existing file URL
    setCurrentProdukhukum(produkhukum);
    setEditMode(true);
    setDialogVisible(true);
  };

  const deleteProdukhukum = async (uuid) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axiosJWT.delete(`http://localhost:5000/produk_hukum/${uuid}`);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data deleted successfully!",
          life: 3000,
        });
        await mutate("http://localhost:5000/produk_hukum");
      } catch (error) {
        handleError(error);
      }
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="demografi-container">
      <h1 className="demografi-header">Produk Hukum</h1>
      <Toast ref={toast} />
      <DataTable
        value={ProdukhukumList}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        filters={filters}
        globalFilterFields={["name", "deskripsi", "waktu"]}
        header={header}
        tableStyle={{ minWidth: "50rem" }}
        breakpoints={{
          "960px": {
            columns: [
              { field: "name", header: "Name" },
              { field: "deskripsi", header: "Deskripsi" },
              // Add other columns you want to display for smaller screens
            ],
          },
          "640px": {
            columns: [
              { field: "name", header: "Name" }, // You can hide columns based on screen size
            ],
          },
        }}
        className="datagrid"
      >
        <Column field="name" header="Name" />
        <Column field="deskripsi" header="Deskripsi" />
        <Column field="waktu" header="Tanggal" />
        <Column field="file_url" header="File" />
        <Column
          header="Actions"
          body={(rowData) => (
            <div
              className="edit-delete-buttons"
              style={{ display: "flex", gap: "0.5rem" }}
            >
              <Button
                label="Detail"
                onClick={() => showDetails(rowData)}
                className="detail-button p-button-rounded"
                tooltip="View Details"
                tooltipOptions={{ position: "bottom" }}
                style={{
                  backgroundColor: "#009688",
                  border: "none",
                  color: "white",
                }}
              />
              <Button
                icon="pi pi-pencil"
                onClick={() => editProdukhukum(rowData)}
                className="edit-button p-button-rounded"
                tooltip="Edit"
                tooltipOptions={{ position: "bottom" }}
                style={{
                  backgroundColor: "#4DB6AC",
                  border: "none",
                  color: "white",
                }}
              />
              <Button
                icon="pi pi-trash"
                onClick={() => deleteProdukhukum(rowData.uuid)}
                className="delete-button p-button-rounded"
                tooltip="Delete"
                tooltipOptions={{ position: "bottom" }}
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
        header="Produk Hukum Details"
        visible={detailDialogVisible}
        onHide={() => setDetailDialogVisible(false)}
        style={{
          width: "40vw",
          border: "none",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        {selectedProdukhukum && (
          <div className="detail-container">
            {/* Highlighted important sections */}
            <h4 style={{ color: "#00796B" }}>Important Information</h4>
            <div className="detail-row">
              <span className="detail-label">
                <strong>Name:</strong>
              </span>
              <span className="detail-value">{selectedProdukhukum.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">
                <strong>Deskripsi:</strong>
              </span>
              <span className="detail-value">
                {selectedProdukhukum.deskripsi}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">
                <strong>Tanggal SK:</strong>
              </span>
              <span className="detail-value">{selectedProdukhukum.waktu}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">
                <strong>File:</strong>
              </span>
              <span className="detail-value">
                {selectedProdukhukum.file_url}
              </span>
            </div>
          </div>
        )}
      </Dialog>

      <Dialog
        header={isEditMode ? "Edit Produk Hukum Data" : "Add Produk Hukum Data"}
        visible={isDialogVisible}
        onHide={closeDialog}
        style={{ width: "50vw" }}
      >
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Card className="demografi-card">
            <h3 className="section-title">Produk Hukum Information</h3>

            <div className="form-group">
              <label htmlFor="nik">
                NIK <span className="required">*</span>
              </label>
              <InputText
                id="nik"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                className="input-field"
                required
                disabled={isEditMode}
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">
                Name <span className="required">*</span>
              </label>
              <InputText
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Gender <span className="required">*</span>
              </label>
              <div className="radio-group">
                <RadioButton
                  inputId="male"
                  name="gender"
                  value="male"
                  onChange={handleChange}
                  checked={formData.gender === "male"}
                />
                <label htmlFor="male">Male</label>
                <RadioButton
                  inputId="female"
                  name="gender"
                  value="female"
                  onChange={handleChange}
                  checked={formData.gender === "female"}
                />
                <label htmlFor="female">Female</label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="birth_date">
                Birth Date <span className="required">*</span>
              </label>
              <Calendar
                id="birth_date"
                name="birth_date"
                value={
                  formData.birth_date ? new Date(formData.birth_date) : null
                }
                onChange={handleDateChange}
                dateFormat="yy-mm-dd"
                showIcon
                placeholder="Select Birth Date"
              />
            </div>

            <div className="form-group">
              <label htmlFor="marital_status">
                Marital Status <span className="required">*</span>
              </label>
              <InputText
                id="marital_status"
                name="marital_status"
                value={formData.marital_status}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="job">Job</label>
              <InputText
                id="job"
                name="job"
                value={formData.job}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="rt">RT</label>
              <InputText
                id="rt"
                name="rt"
                value={formData.rt}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="rw">RW</label>
              <InputText
                id="rw"
                name="rw"
                value={formData.rw}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="hamlet">Hamlet</label>
              <InputText
                id="hamlet"
                name="hamlet"
                value={formData.hamlet}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="file">Upload File</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              {preview && (
                <div className="file-preview">
                  <img src={preview} alt="Preview" className="preview-image" />
                  <span className="preview-text">Preview of uploaded file</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              label={isEditMode ? "Update" : "Save"}
              className="submit-button p-button-rounded p-button-primary"
            />
          </Card>
        </form>
      </Dialog>
    </div>
  );
};

export default Produkhukum;
