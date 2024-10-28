import React, { useState, useEffect, useCallback, useRef } from "react";
import useSWR, { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Dialog } from "primereact/dialog";
import { Image } from "primereact/image";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import "./Galeri.css"; // Custom CSS for styling

const Galeri = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "",
    file_url: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);
  const [currentGaleri, setCurrentGaleri] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [galeriList, setGaleriList] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }, // Use FilterMatchMode
  });

  const navigate = useNavigate();
  const toast = useRef(null);
  const axiosJWT = useAuth(navigate);

  const fetcher = useCallback(
    async (url) => {
      try {
        const response = await axiosJWT.get(url);
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    },
    [axiosJWT]
  );

  const {
    data: galeriData,
    error,
    isLoading,
  } = useSWR("http://localhost:5000/galeri", fetcher);

  useEffect(() => {
    if (galeriData?.galeris) {
      setGaleriList(galeriData.galeris);
    }
  }, [galeriData]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextChange = useCallback((value) => {
    setFormData((prevData) => ({
      ...prevData,
      content: value, // Mengubah content saat diedit
    }));
  }, []);

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
          `http://localhost:5000/galeri/${currentGaleri.uuid}`,
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
        await axiosJWT.post("http://localhost:5000/cgaleri", dataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data saved successfully!",
          life: 3000,
        });
      }

      await mutate("http://localhost:5000/galeri");
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
      title: "",
      content: "",
      status: "",
      file_url: "",
    });
    setSelectedFile(null);
    setPreview(null);
    setEditMode(false);
    setCurrentGaleri(null);
  };

  const editGaleri = (galeri) => {
    setFormData(galeri);
    setSelectedFile(null);
    const fileUrl = galeri.file_url
      ? `http://localhost:5000${galeri.file_url}`
      : null;
    // console.log("File URL:", fileUrl);
    setPreview(fileUrl); // Set preview to the existing file URL
    setCurrentGaleri(galeri);
    setEditMode(true);
    setDialogVisible(true);
  };

  const deleteGaleri = async (uuid) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axiosJWT.delete(`http://localhost:5000/galeri/${uuid}`);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data deleted successfully!",
          life: 3000,
        });
        await mutate("http://localhost:5000/galeri");
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handlePageChange = (e) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data</p>;

  return (
    <div>
      <h1 className="demografi-header">Galeri</h1>
      <Toast ref={toast} />
      <DataTable
        value={galeriList}
        paginator
        rows={rows} // Gunakan nilai rows dari state
        first={first}
        onPage={handlePageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        filters={filters}
        globalFilterFields={["title", "content", "status"]}
        header={header}
        tableStyle={{ minWidth: "50rem" }}
        footer={`Total data: ${galeriList.length}`}
        breakpoints={{
          "960px": {
            columns: [
              { field: "name", header: "Name" },
              { field: "content", header: "Content" },
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
        <Column
          header="No"
          body={(rowData, options) => {
            const rowIndex = options.rowIndex % rows; // Reset rowIndex setiap halaman
            const nomorUrut = first + rowIndex + 1; // Hitung nomor urut berdasarkan halaman
            console.log("Row Index:", rowIndex, "Nomor Urut:", nomorUrut); // Log nomor urut pada setiap baris

            return nomorUrut;
          }}
          style={{ width: "5%", minWidth: "5%" }}
        />
        <Column
          field="title"
          header="Judul Galeri"
          style={{ width: "50%", minWidth: "15%" }} // Lebar tetap dengan batas minimum
          bodyStyle={{ overflow: "hidden", textOverflow: "ellipsis" }} // Potong teks panjang
        />
        <Column
          field="status"
          header="Status Galeri"
          style={{ width: "25%", minWidth: "15%" }} // Lebar tetap dengan batas minimum
          bodyStyle={{ overflow: "hidden", textOverflow: "ellipsis" }}
        />
        <Column
          header="Actions"
          body={(rowData) => (
            <div
              className="edit-delete-buttons"
              style={{ display: "flex", gap: "0.5rem" }}
            >
              <Button
                icon="pi pi-pencil"
                onClick={() => editGaleri(rowData)}
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
                onClick={() => deleteGaleri(rowData.uuid)}
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Full screen height
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Dialog
          header={isEditMode ? "Edit Galeri Data" : "Add Galeri Data"}
          visible={isDialogVisible}
          onHide={closeDialog}
          style={{ width: "65vw" }}
        >
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Card className="demografi-card">
              <h3 className="section-title">Galeri</h3>

              <div className="form-group">
                <label htmlFor="title">
                  Judul Galeri <span className="required">*</span>
                </label>
                <InputText
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">
                  Deskripsi <span className="required">*</span>
                </label>
                <div className="quill-wrapper">
                  <ReactQuill
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleTextChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="status">
                  Status Galeri <span className="required">*</span>
                </label>
                <div className="radio-group">
                  <div className="radio-item">
                    <RadioButton
                      inputId="DRAFT"
                      name="status"
                      value="DRAFT"
                      onChange={handleChange}
                      checked={formData.status === "DRAFT"}
                    />
                    <label htmlFor="DRAFT" className="radio-label">
                      Draft
                    </label>
                  </div>
                  <div className="radio-item">
                    <RadioButton
                      inputId="Publish"
                      name="status"
                      value="PUBLISH"
                      onChange={handleChange}
                      checked={formData.status === "PUBLISH"}
                    />
                    <label htmlFor="PUBLISH" className="radio-label">
                      Publish
                    </label>
                  </div>
                </div>
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
                    <Image
                      src={preview}
                      alt="Preview"
                      width="250"
                      className="preview-image"
                      preview
                    />
                  </div>
                )}
              </div>
              <div className="button-sub">
                <Button
                  type="submit"
                  label={isEditMode ? "Update" : "Save"}
                  className="submit-button coastal-button p-button-rounded p-button-primary"
                />
              </div>
            </Card>
          </form>
        </Dialog>
      </div>
    </div>
  );
};

export default Galeri;
