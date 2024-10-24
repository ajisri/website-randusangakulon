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
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Dialog } from "primereact/dialog";
import "./ProdukHukum.css"; // Custom CSS for styling

const Produkhukum = () => {
  const [formData, setFormData] = useState({
    uuid: "",
    name: "",
    deskrispsi: "",
    waktu: null,
    file_url: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [first, setFirst] = useState(0);
  const [currentProdukhukum, setCurrentProdukhukum] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }, // Use FilterMatchMode
  });
  const [produkhukumList, setProdukhukumList] = useState([]);
  const [fileDialogVisible, setFileDialogVisible] = useState(false);

  const navigate = useNavigate();
  const toast = useRef(null);
  const axiosJWT = useAuth(navigate);

  const fetcher = useCallback(
    async (url) => {
      const response = await axiosJWT.get(url);
      console.log(response.data);
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
    if (produkhukumData?.produkHukum) {
      setProdukhukumList(produkhukumData.produkHukum); // Menggunakan produkHukum
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

  const showFileInModal = (fileUrl) => {
    // console.log("Opening file URL:", fileUrl);
    if (fileUrl) {
      setSelectedFile(fileUrl);
      setFileDialogVisible(true);
    } else {
      console.error("File is not valid");
    }
  };

  const renderFileDialog = () => {
    return (
      <Dialog
        header="File Preview"
        visible={fileDialogVisible}
        onHide={() => setFileDialogVisible(false)}
        modal
        style={{ width: "70vw" }} // Set width sesuai kebutuhan
      >
        {selectedFile ? (
          <>
            <iframe
              src={selectedFile}
              width="100%"
              height="400px"
              title="File Viewer"
            />
          </>
        ) : (
          <p>No file selected.</p>
        )}
        <Button label="Close" onClick={() => setFileDialogVisible(false)} />
      </Dialog>
    );
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
        waktu: adjustedDate.toISOString().split("T")[0], // Format to yyyy-mm-dd
      });
    } else {
      setFormData({ ...formData, waktu: null });
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
        await axiosJWT.patch(
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
      uuid: "",
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
    <div>
      <h1 className="demografi-header">Produk Hukum</h1>
      <Toast ref={toast} />
      <DataTable
        value={produkhukumList}
        paginator
        rows={5}
        first={first}
        onPage={(e) => setFirst(e.first)}
        rowsPerPageOptions={[5, 10, 25, 50]}
        filters={filters}
        globalFilterFields={["name", "deskripsi", "waktu"]}
        header={header}
        footer={`Total data: ${produkhukumList.length}`}
        // tableStyle={{
        //   width: "100%",
        //   minWidth: "70rem",
        //   maxWidth: "85rem",
        // }}
        // breakpoints={{
        //   "960px": {
        //     columns: [
        //       { field: "name", header: "Name" },
        //       { field: "deskripsi", header: "Deskripsi" },
        //       // Add other columns you want to display for smaller screens
        //     ],
        //   },
        //   "640px": {
        //     columns: [
        //       { field: "name", header: "Name" }, // You can hide columns based on screen size
        //     ],
        //   },
        // }}
        // className="datagrid"
      >
        <Column
          header="No"
          body={(rowData, options) => {
            const rowIndex = options.rowIndex ?? 0;
            return rowIndex + 1 + first; // Menghitung nomor urut dengan offset
          }}
          style={{ width: "5%", minWidth: "5%" }}
        />
        <Column field="name" header="Name" />
        <Column field="deskripsi" header="Deskripsi" />
        <Column field="waktu" header="Tanggal" />
        <Column
          field="file_url"
          header="File"
          body={(rowData) => {
            const fileUrl = `http://localhost:5000${rowData.file_url}`;
            return (
              <Button
                label="Lihat"
                onClick={() => showFileInModal(fileUrl)} // Gunakan URL lengkap
                className="coastal-button p-button-rounded"
                tooltip="Lihat File"
                tooltipOptions={{ position: "bottom" }}
              />
            );
          }}
        />
        <Column
          header="Actions"
          body={(rowData) => (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                icon="pi pi-pencil"
                onClick={() => editProdukhukum(rowData)}
                className="edit-button coastal-button p-button-rounded"
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
                className="delete-button coastal-button p-button-rounded"
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
      {renderFileDialog()}

      <Dialog
        header={isEditMode ? "Edit Produk Hukum Data" : "Add Produk Hukum Data"}
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
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Card
              className="demografi-card"
              style={{
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                padding: "20px",
              }}
            >
              <h3 className="section-title" style={{ color: "#00796B" }}>
                Produk Hukum Information
              </h3>

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
                <label htmlFor="deskripsi">
                  Deskripsi <span className="required">*</span>
                </label>
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
                <label htmlFor="waktu">
                  Tanggal SK <span className="required">*</span>
                </label>
                <Calendar
                  id="waktu"
                  name="waktu"
                  value={formData.waktu ? new Date(formData.waktu) : null}
                  onChange={handleDateChange}
                  dateFormat="yy-mm-dd"
                  showIcon
                  placeholder="Select Date"
                  className="input-field"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="file_url">Upload File</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="file-input"
                />
                {preview && (
                  <div className="file-preview">
                    <iframe
                      src={preview}
                      title="File Preview"
                      className="preview-file"
                      style={{ width: "100%", height: "400px" }}
                    />
                  </div>
                )}
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

export default Produkhukum;
