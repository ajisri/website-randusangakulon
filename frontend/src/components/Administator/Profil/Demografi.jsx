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
import "./Demografi.css"; // Custom CSS for styling

const Demografi = () => {
  const [formData, setFormData] = useState({
    nik: "",
    name: "",
    gender: "",
    birth_date: null,
    marital_status: "",
    education_id: null,
    job: "",
    rt: "",
    rw: "",
    hamlet: "",
    status_aktif: "",
    tmt_status_aktif: null,
    keterangan_status: null,
    religion_id: null,
    file_url: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [currentDemographic, setCurrentDemographic] = useState(null);
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
    data: demografiData,
    error,
    isLoading,
  } = useSWR("http://localhost:5000/demografi", fetcher);
  const {
    data: educationData,
    error: educationError,
    isLoading: isEducationLoading,
  } = useSWR("http://localhost:5000/education-options", fetcher);
  const {
    data: religionData,
    error: religionError,
    isLoading: isReligionLoading,
  } = useSWR("http://localhost:5000/agama", fetcher);

  useEffect(() => {
    if (demografiData?.demographics) {
      setDemografiList(demografiData.demographics);
    }
  }, [demografiData]);

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

  const [demografiList, setDemografiList] = useState([]);

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

    if (formData.status_aktif === "tidak aktif") {
      dataToSend.append("tmt_status_aktif", formData.tmt_status_aktif);
      dataToSend.append("keterangan_status", formData.keterangan_status);
    } else {
      // Kosongkan field ini jika status aktif
      dataToSend.append("tmt_status_aktif", "");
      dataToSend.append("keterangan_status", "");
    }

    try {
      if (isEditMode) {
        await axiosJWT.put(
          `http://localhost:5000/demografi/${currentDemographic.nik}`,
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
        await axiosJWT.post("http://localhost:5000/cdemografi", dataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data saved successfully!",
          life: 3000,
        });
      }

      await mutate("http://localhost:5000/demografi");
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
      nik: "",
      name: "",
      gender: "",
      birth_date: null,
      marital_status: "",
      education_id: null,
      job: "",
      rt: "",
      rw: "",
      hamlet: "",
      status_aktif: "",
      tmt_status_aktif: "",
      keterangan_status: "",
      religion_id: null,
      file_url: "",
    });
    setSelectedFile(null);
    setPreview(null);
    setEditMode(false);
    setCurrentDemographic(null);
  };

  const [detailDialogVisible, setDetailDialogVisible] = useState(false);
  const [selectedDemographic, setSelectedDemographic] = useState(null);

  const showDetails = (rowData) => {
    setSelectedDemographic(rowData);
    setDetailDialogVisible(true);
  };

  const editDemographic = (demographic) => {
    setFormData(demographic);
    setSelectedFile(null);
    const fileUrl = demographic.file_url
      ? `http://localhost:5000${demographic.file_url}`
      : null;
    // console.log("File URL:", fileUrl);
    setPreview(fileUrl); // Set preview to the existing file URL
    setCurrentDemographic(demographic);
    setEditMode(true);
    setDialogVisible(true);
  };

  const deleteDemographic = async (nik) => {
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
    if (selectedDemographic?.file_url) {
      setPreview(`http://localhost:5000${selectedDemographic.file_url}`);
    } else {
      setPreview("");
    }
  }, [selectedDemographic]);

  if (isLoading || isEducationLoading || isReligionLoading)
    return <p>Loading...</p>;
  if (error || educationError || religionError)
    return <p>Error fetching data</p>;

  return (
    <div>
      <h1 className="demografi-header">Demografi</h1>
      <Toast ref={toast} />
      <DataTable
        value={demografiList}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        filters={filters}
        globalFilterFields={[
          "nik",
          "name",
          "gender",
          "birth_date",
          "marital_status",
          "job",
          "rt",
          "rw",
          "hamlet",
          "status_aktif",
          "tmt_status_aktif",
          "keterangan_status",
        ]}
        header={header}
        tableStyle={{ minWidth: "50rem" }}
        breakpoints={{
          "960px": {
            columns: [
              { field: "name", header: "Name" },
              { field: "gender", header: "Gender" },
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
          field="nik"
          header="NIK"
          style={{ width: "150px", minWidth: "120px" }} // Lebar tetap dengan batas minimum
          bodyStyle={{ overflow: "hidden", textOverflow: "ellipsis" }} // Potong teks panjang
        />
        <Column
          field="name"
          header="Nama"
          style={{ width: "200px", minWidth: "150px" }} // Lebar tetap dengan batas minimum
          bodyStyle={{ overflow: "hidden", textOverflow: "ellipsis" }} // Potong teks panjang
        />
        <Column
          field="hamlet"
          header="Dusun"
          style={{ width: "200px", minWidth: "150px" }} // Lebar tetap dengan batas minimum
          bodyStyle={{ overflow: "hidden", textOverflow: "ellipsis" }}
        />
        <Column
          field="education_id"
          header="Pendidikan"
          body={(rowData) =>
            educationData.find((ed) => ed.id === rowData.education_id)?.level
          }
        />
        <Column
          field="religion_id"
          header="Agama"
          body={(rowData) =>
            religionData.find((rel) => rel.id === rowData.religion_id)?.name
          }
        />
        <Column field="status_aktif" header="Status" />
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
                onClick={() => editDemographic(rowData)}
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
                onClick={() => deleteDemographic(rowData.nik)}
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
          header="Detail Demografi"
          visible={detailDialogVisible}
          onHide={() => setDetailDialogVisible(false)}
          style={{
            width: "60vw",
            border: "none",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          }}
        >
          {selectedDemographic && (
            <div className="detail-container">
              <h3 className="detail-title">Informasi Warga</h3>
              <div className="detail-content">
                {[
                  { label: "NIK:", value: selectedDemographic.nik },
                  { label: "Nama:", value: selectedDemographic.name },
                  {
                    label: "Jenis Kelamin:",
                    value: selectedDemographic.gender,
                  },
                  {
                    label: "Tanggal Lahir:",
                    value: new Date(
                      selectedDemographic.birth_date
                    ).toLocaleDateString(),
                  },
                  {
                    label: "Agama:",
                    value:
                      religionData.find(
                        (ed) => ed.id === selectedDemographic.religion_id
                      )?.name || "Tidak ada data",
                  },
                  {
                    label: "Pendidikan Terakhir:",
                    value:
                      educationData.find(
                        (ed) => ed.id === selectedDemographic.education_id
                      )?.level || "Tidak ada data",
                  },
                  { label: "Pekerjaan:", value: selectedDemographic.job },
                  { label: "RT:", value: selectedDemographic.rt },
                  { label: "RW:", value: selectedDemographic.rw },
                  { label: "Dusun:", value: selectedDemographic.hamlet },
                  {
                    label: "Status Warga:",
                    value: selectedDemographic.status_aktif,
                  },
                  {
                    label: "TMT Status Warga:",
                    value:
                      selectedDemographic.tmt_status_aktif || "Tidak ada data",
                  },
                  {
                    label: "Keterangan Status Warga:",
                    value:
                      selectedDemographic.keterangan_status || "Tidak ada data",
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

          {selectedDemographic?.file_url && (
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
                <label htmlFor="education_id">
                  Pendidikan Terakhir <span className="required">*</span>
                </label>
                <Dropdown
                  id="education_id"
                  name="education_id"
                  value={formData.education_id}
                  options={educationData}
                  onChange={handleChange}
                  optionLabel="level"
                  optionValue="id"
                  placeholder="Select Education"
                  className="input-field"
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
                <label htmlFor="religion_id">
                  Agama <span className="required">*</span>
                </label>
                <Dropdown
                  id="religion_id"
                  name="religion_id"
                  value={formData.religion_id}
                  options={religionData}
                  onChange={handleChange}
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Select Religion"
                  className="dropdown-field"
                  required
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

export default Demografi;
