import React, { useState, useEffect, useCallback, useRef } from "react";
import useSWR, { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { RadioButton } from "primereact/radiobutton";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Dialog } from "primereact/dialog";
import "./Pengumuman.css"; // Custom CSS for styling

const Pengumuman = () => {
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
  const [currentPengumuman, setCurrentPengumuman] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [pengumumanList, setPengumumanList] = useState([]);
  const [detailDialogVisible, setDetailDialogVisible] = useState(false);
  const [selectedPengumuman, setSelectedPengumuman] = useState(null);
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
    data: pengumumanData,
    error,
    isLoading,
  } = useSWR("http://localhost:5000/pengumuman", fetcher);

  useEffect(() => {
    if (pengumumanData?.demographics) {
      setPengumumanList(pengumumanData.demographics);
    }
  }, [pengumumanData]);

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

  const handleDateChange = (e, field) => {
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
        [field]: adjustedDate.toISOString().split("T")[0], // Format to yyyy-mm-dd
      });
    } else {
      setFormData({ ...formData, [field]: null });
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
          `http://localhost:5000/pengumuman/${currentPengumuman.uuid}`,
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
        await axiosJWT.post("http://localhost:5000/cpengumuman", dataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data saved successfully!",
          life: 3000,
        });
      }

      await mutate("http://localhost:5000/pengumuman");
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
    setCurrentPengumuman(null);
  };

  const showDetails = (rowData) => {
    setSelectedPengumuman(rowData);
    setDetailDialogVisible(true);
  };

  const editPengumuman = (demographic) => {
    setFormData(demographic);
    setSelectedFile(null);
    const fileUrl = demographic.file_url
      ? `http://localhost:5000${demographic.file_url}`
      : null;
    // console.log("File URL:", fileUrl);
    setPreview(fileUrl); // Set preview to the existing file URL
    setCurrentPengumuman(demographic);
    setEditMode(true);
    setDialogVisible(true);
  };

  const deletePengumuman = async (nik) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axiosJWT.delete(`http://localhost:5000/demografi/${nik}`);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data deleted successfully!",
          life: 3000,
        });
        await mutate("http://localhost:5000/demografi");
      } catch (error) {
        handleError(error);
      }
    }
  };

  useEffect(() => {
    if (selectedPengumuman?.file_url) {
      setPreview(`http://localhost:5000${selectedPengumuman.file_url}`);
    } else {
      setPreview("");
    }
  }, [selectedPengumuman]);

  return (
    <div>
      <h1 className="demografi-header">Pengumuman</h1>
      <Toast ref={toast} />
      <DataTable
        value={pengumumanList}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        filters={filters}
        globalFilterFields={["title", "content", "status"]}
        header={header}
        tableStyle={{ minWidth: "50rem" }}
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
          field="uuid"
          header="UUID"
          style={{ width: "15%", minWidth: "12%" }} // Lebar tetap dengan batas minimum
          bodyStyle={{ overflow: "hidden", textOverflow: "ellipsis" }} // Potong teks panjang
        />
        <Column
          field="title"
          header="Judul Pengumuman"
          style={{ width: "15%", minWidth: "15%" }} // Lebar tetap dengan batas minimum
          bodyStyle={{ overflow: "hidden", textOverflow: "ellipsis" }} // Potong teks panjang
        />
        <Column
          field="status"
          header="Status Pengumuman"
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
                label="Detail"
                onClick={() => showDetails(rowData)}
                className="detail-button coastal-button p-button-rounded"
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
                onClick={() => editPengumuman(rowData)}
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
                onClick={() => deletePengumuman(rowData.uuid)}
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
          height: "100%",
        }}
      >
        <Dialog
          header="Detail Pengumuman"
          visible={detailDialogVisible}
          onHide={() => setDetailDialogVisible(false)}
          style={{
            width: "60vw",
            border: "none",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          }}
        >
          {selectedPengumuman && (
            <div className="detail-container">
              <h3 className="detail-title">Informasi Warga</h3>
              <div className="detail-content">
                {[
                  { label: "NIK:", value: selectedPengumuman.nik },
                  { label: "Nama:", value: selectedPengumuman.name },
                  {
                    label: "Jenis Kelamin:",
                    value: selectedPengumuman.gender,
                  },
                  {
                    label: "Tanggal Lahir:",
                    value: new Date(
                      selectedPengumuman.birth_date
                    ).toLocaleDateString(),
                  },

                  { label: "Pekerjaan:", value: selectedPengumuman.job },
                  { label: "RT:", value: selectedPengumuman.rt },
                  { label: "RW:", value: selectedPengumuman.rw },
                  { label: "Dusun:", value: selectedPengumuman.hamlet },
                  {
                    label: "Status Warga:",
                    value: selectedPengumuman.status_aktif,
                  },
                  {
                    label: "TMT Status Warga:",
                    value:
                      selectedPengumuman.tmt_status_aktif || "Tidak ada data",
                  },
                  {
                    label: "Keterangan Status Warga:",
                    value:
                      selectedPengumuman.keterangan_status || "Tidak ada data",
                  },
                ].map((item, index) => (
                  <div className="detail-row" key={index}>
                    <span className="detail-label">{item.label}</span>
                    <span className="detail-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedPengumuman?.file_url && (
            <div className="file-preview">
              <h4>File:</h4>
              <img
                src={preview} // Menggunakan preview yang sudah di-set
                alt="File Preview"
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                }}
              />
            </div>
          )}
        </Dialog>
      </div>
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
          header={isEditMode ? "Edit Demographic Data" : "Add Demographic Data"}
          visible={isDialogVisible}
          onHide={closeDialog}
          style={{ width: "65vw" }}
        >
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Card className="demografi-card">
              <h3 className="section-title">Informasi Demografi</h3>

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
                  Nama <span className="required">*</span>
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
                <label htmlFor="gender">
                  Jenis Kelamin <span className="required">*</span>
                </label>
                <div className="radio-group">
                  <div className="radio-item">
                    <RadioButton
                      inputId="Laki-Laki"
                      name="gender"
                      value="Laki-Laki"
                      onChange={handleChange}
                      checked={formData.gender === "Laki-Laki"}
                    />
                    <label htmlFor="Laki-Laki" className="radio-label">
                      Laki-Laki
                    </label>
                  </div>
                  <div className="radio-item">
                    <RadioButton
                      inputId="Perempuan"
                      name="gender"
                      value="Perempuan"
                      onChange={handleChange}
                      checked={formData.gender === "Perempuan"}
                    />
                    <label htmlFor="Perempuan" className="radio-label">
                      Perempuan
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="birth_date">
                  Tanggal Lahir <span className="required">*</span>
                </label>
                <Calendar
                  id="birth_date"
                  name="birth_date"
                  value={
                    formData.birth_date ? new Date(formData.birth_date) : null
                  }
                  onChange={(e) => handleDateChange(e, "birth_date")}
                  dateFormat="yy-mm-dd"
                  showIcon
                  placeholder="Select Tanggal"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="Status Kawin">Status Kawin</label>
                <Dropdown
                  id="marital_status"
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleChange}
                  options={[
                    { label: "Kawin Tercatat", value: "Kawin Tercatat" },
                    {
                      label: "Kawin Tidak Tercatat",
                      value: "Kawin Tidak Tercatat",
                    },
                    { label: "Cerai Hidup", value: "Cerai Hidup" },
                    { label: "Cerai Mati", value: "Cerai Mati" },
                    { label: "Belum Kawin", value: "Belum Kawin" },
                  ]}
                  placeholder="Pilih Status Kawin"
                  className="dropdown-field"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="job">Pekerjaan</label>
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
                <label htmlFor="hamlet">Dusun</label>
                <InputText
                  id="hamlet"
                  name="hamlet"
                  value={formData.hamlet}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="status_aktif">Status Warga</label>
                <div className="radio-group">
                  <div className="radio-item">
                    <RadioButton
                      inputId="aktif"
                      name="status_aktif"
                      value="aktif"
                      onChange={handleChange}
                      checked={formData.status_aktif === "aktif"}
                    />
                    <label htmlFor="aktif" className="radio-label">
                      Aktif
                    </label>
                  </div>
                  <div className="radio-item">
                    <RadioButton
                      inputId="tidak_aktif"
                      name="status_aktif"
                      value="tidak_aktif"
                      onChange={handleChange}
                      checked={formData.status_aktif === "tidak_aktif"}
                    />
                    <label htmlFor="tidak_aktif" className="radio-label">
                      Tidak Aktif
                    </label>
                  </div>
                </div>
              </div>

              {formData.status_aktif === "tidak_aktif" && (
                <>
                  <div className="form-group">
                    <label htmlFor="status">
                      TMT Status <span className="required">*</span>
                    </label>
                    <Calendar
                      id="tmt_status_aktif"
                      name="tmt_status_aktif"
                      value={
                        formData.tmt_status_aktif
                          ? new Date(formData.tmt_status_aktif)
                          : null
                      }
                      onChange={(e) => handleDateChange(e, "tmt_status_aktif")}
                      dateFormat="yy-mm-dd"
                      showIcon
                      placeholder="Pilih Tanggal"
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="keterangan_status">
                      Keterangan Status Warga
                    </label>
                    <InputText
                      id="keterangan_status"
                      name="keterangan_status"
                      value={formData.keterangan_status}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </>
              )}

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
                    <img
                      src={preview}
                      alt="Preview"
                      className="preview-image"
                    />
                    <span className="preview-text">
                      Preview of uploaded file
                    </span>
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

export default Pengumuman;
