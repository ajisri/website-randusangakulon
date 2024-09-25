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
    religion_id: null,
    file_url: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const toast = useRef(null);
  const [errors, setErrors] = useState({});
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
    if (
      demografiData &&
      demografiData.demographics &&
      demografiData.demographics.length > 0
    ) {
      const demographic = demografiData.demographics[0]; // Get the first element
      console.log("Fetched Data:", demographic); // Log the fetched demographic data
      setFormData({
        nik: demographic.nik || "",
        name: demographic.name || "",
        gender: demographic.gender || "",
        birth_date: demographic.birth_date || null,
        marital_status: demographic.marital_status || "",
        education_id: demographic.education_id || null,
        job: demographic.job || "",
        rt: demographic.rt || "",
        rw: demographic.rw || "",
        hamlet: demographic.hamlet || "",
        religion_id: demographic.religion_id || null,
      });
    } else {
      console.log("No data fetched or demographics array is empty."); // Log if no data is fetched
    }
  }, [demografiData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (e) => {
    const selectedDate = e.value;
    setFormData({
      ...formData,
      birth_date: selectedDate ? formatDate(selectedDate) : null,
    });
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
    console.log("Submitted Birth Date:", formData.birth_date);
    console.log("Form Data Before Submit:", formData);

    const formDataToSend = new FormData();
    formDataToSend.append("nik", formData.nik);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("job", formData.job);
    formDataToSend.append("rt", formData.rt);
    formDataToSend.append("rw", formData.rw);
    formDataToSend.append("hamlet", formData.hamlet);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("birth_date", formData.birth_date);
    formDataToSend.append("marital_status", formData.marital_status);
    formDataToSend.append("education_id", parseInt(formData.education_id, 10));
    formDataToSend.append("religion_id", formData.religion_id);

    if (selectedFile) {
      formDataToSend.append("file", selectedFile);
    }

    try {
      await axiosJWT.post("http://localhost:5000/cdemografi", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Data saved successfully!",
        life: 3000,
      });
      await mutate("http://localhost:5000/demografi");
      resetForm();
    } catch (error) {
      handleError(error);
    }
  };

  // Handle error in a separate function for reusability
  const handleError = (error) => {
    if (error.response) {
      // Check if the response data contains errors
      if (error.response.data.errors) {
        error.response.data.errors.forEach((err) => {
          toast.current.show({
            severity: "error",
            summary: "Validation Error",
            detail: err.msg, // Ensure this matches your backend structure
            life: 5000,
          });
        });
      } else {
        // General error message if no specific errors are returned
        toast.current.show({
          severity: "error",
          summary: "Server Error",
          detail: error.response.data.message || "An unexpected error occurred",
          life: 5000,
        });
      }
    } else {
      // Fallback for unknown errors
      toast.current.show({
        severity: "error",
        summary: "Unknown Error",
        detail: "Something went wrong. Please try again later.",
        life: 5000,
      });
    }
  };

  // Reset form state after successful submission
  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setErrors({});
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  console.log("Fetched Data:", demografiData);
  console.log("Form Data after setting:", formData);

  return (
    <div className="demografi-container">
      <Toast ref={toast} />
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="demografi-form"
      >
        <Card className="demografi-card">
          <h3 className="section-title">Demographic Information</h3>
          <div className="form-group">
            <label htmlFor="nik">NIK</label>
            <InputText
              id="nik"
              name="nik"
              value={formData.nik}
              onChange={handleChange}
              className="input-field"
            />
            {errors.nik && <p className="error-text">{errors.nik}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
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
            <label>Gender</label>
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
            <label htmlFor="birth_date">Birth Date</label>
            <Calendar
              id="birth_date"
              name="birth_date"
              value={formData.birth_date ? new Date(formData.birth_date) : null}
              onChange={handleDateChange}
              dateFormat="yy-mm-dd"
              showIcon
            />
            {errors.birth_date && (
              <p className="error-text">{errors.birth_date}</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="marital_status">Marital Status</label>
            <InputText
              id="marital_status"
              name="marital_status"
              value={formData.marital_status}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label htmlFor="education_id">Education</label>
            {isEducationLoading ? (
              <p>Loading educations...</p>
            ) : educationError ? (
              <p className="error-text">Failed to fetch education</p>
            ) : educationData && educationData.length > 0 ? (
              <Dropdown
                id="education_id"
                name="education_id"
                value={formData.education_id} // Selected value
                options={educationData} // Directly use educationData
                onChange={handleChange}
                optionLabel="level" // Label field from backend
                optionValue="id" // Value field from backend
                placeholder="Select Education"
                className="dropdown-field"
              />
            ) : (
              <p>No education options available</p>
            )}
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
            <label htmlFor="religion_id">Religion</label>
            {isReligionLoading ? (
              <p>Loading religions...</p>
            ) : religionError ? (
              <p className="error-text">Failed to fetch religions</p>
            ) : religionData && religionData.length > 0 ? (
              <Dropdown
                id="religion_id"
                name="religion_id"
                value={formData.religion_id} // Selected value
                options={religionData} // Directly use religionData
                onChange={handleChange}
                optionLabel="name" // Label field from backend
                optionValue="id" // Value field from backend
                placeholder="Select Religion"
                className="dropdown-field"
              />
            ) : (
              <p>No religion options available</p>
            )}
          </div>
          <div className="file-input-wrapper">
            <label htmlFor="file" className="file-input-label">
              <span className="file-input-text">Upload File</span>
              <input
                id="file"
                name="file"
                type="file"
                onChange={handleFileChange}
                accept="image/*,application/pdf"
                className="file-input"
              />
            </label>
            {selectedFile && preview && (
              <div className="file-preview">
                <div className="file-info">
                  <p className="file-name">File Name: {selectedFile.name}</p>
                  <p className="file-size">
                    File Size: {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <div className="file-preview-image">
                  <img src={preview} alt="Preview" className="preview-image" />
                </div>
              </div>
            )}
          </div>
          <div className="form-group">
            <Button
              label="Save"
              icon="pi pi-check"
              className="p-button-success p-button-raised"
              type="submit"
            />
          </div>
        </Card>
      </form>
    </div>
  );
};

export default Demografi;
