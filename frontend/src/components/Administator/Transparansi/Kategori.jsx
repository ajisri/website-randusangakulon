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
import { Dropdown } from "primereact/dropdown";
import "./Keuangan.css"; // Custom CSS for styling

const Kategori = () => {
  const [formData, setFormData] = useState({
    uuid: "",
    name: "",
    keuanganId: "",
  });

  const [keuanganOptions, setKeuanganOptions] = useState([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);
  const [currentKategori, setCurrentKategori] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [kategoriList, setKategoriList] = useState([]);
  const [subkategoriFormData, setSubkategoriFormData] = useState([
    { uuid: "", name: "", kategoriId: "" },
  ]);
  const [isSubkategoriDialogVisible, setSubkategoriDialogVisible] =
    useState(false);

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
    data: kategoriData,
    error,
    isLoading,
  } = useSWR("http://localhost:5000/kategori", fetcher);

  useEffect(() => {
    if (kategoriData) {
      setKategoriList(kategoriData);
    }
  }, [kategoriData]);

  // Fetch keuangan options
  const {
    data: keuanganData,
    error: keuanganError,
    isLoading: isKeuanganLoading,
  } = useSWR("http://localhost:5000/keuangan", fetcher);

  useEffect(() => {
    if (keuanganData) {
      setKeuanganOptions(keuanganData); // Simpan keuanganData untuk dropdown
    }
  }, [keuanganData]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
    };
    console.log("Data to be sent:", dataToSend);

    try {
      if (isEditMode) {
        await axiosJWT.patch(
          `http://localhost:5000/kategori/${currentKategori.uuid}`,
          dataToSend
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data updated successfully!",
          life: 3000,
        });
      } else {
        await axiosJWT.post("http://localhost:5000/ckategori", dataToSend);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data saved successfully!",
          life: 3000,
        });
      }

      await mutate("http://localhost:5000/kategori");
      resetForm();
      setDialogVisible(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response.data.message || "An unexpected error occurred",
        life: 5000,
      });
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An unexpected error occurred",
        life: 5000,
      });
    }
  };

  const handleSubkategoriSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const data of subkategoriFormData) {
        await axiosJWT.post("http://localhost:5000/subkategori", data);
      }
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Subkategori saved successfully!",
        life: 3000,
      });
      await mutate("http://localhost:5000/subkategori");
      setSubkategoriDialogVisible(false);
    } catch (error) {
      handleError(error);
    }
  };

  const resetForm = () => {
    setFormData({
      uuid: "",
      name: "",
      keuanganId: "",
    });
    setEditMode(false);
    setCurrentKategori(null);
  };

  const editKategori = (kategori) => {
    setFormData(kategori);
    setCurrentKategori(kategori);
    setEditMode(true);
    setDialogVisible(true);
  };

  const deleteKategori = async (uuid) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axiosJWT.delete(`http://localhost:5000/kategori/${uuid}`);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data deleted successfully!",
          life: 3000,
        });
        await mutate("http://localhost:5000/kategori");
      } catch (error) {
        handleError(error);
      }
    }
  };

  const addSubkategoriField = () => {
    setSubkategoriFormData((prev) => [
      ...prev,
      { uuid: "", name: "", kategoriId: "" },
    ]);
  };

  const removeSubkategoriField = (index) => {
    const newFormData = subkategoriFormData.filter((_, i) => i !== index);
    setSubkategoriFormData(newFormData);
  };

  const handleSubkategoriChange = (index, e) => {
    const { name, value } = e.target;
    const newFormData = [...subkategoriFormData];
    newFormData[index][name] = value;
    setSubkategoriFormData(newFormData);
  };

  const handlePageChange = (e) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  if (isLoading || isKeuanganLoading) return <p>Loading...</p>;
  if (error || keuanganError) return <p>Error fetching data</p>;

  return (
    <div>
      <h1 className="kategori-header">Kategori</h1>
      <Toast ref={toast} />
      <DataTable
        value={kategoriList}
        paginator
        rows={rows}
        first={first}
        onPage={handlePageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        filters={filters}
        globalFilterFields={["name"]}
        header={
          <div className="table-header">
            <InputText
              type="search"
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Pencarian"
              className="search-input"
              style={{ width: "300px" }}
            />
            <Button
              label="Add Data"
              onClick={openDialog}
              className="add-data-button p-button-rounded p-button-success"
              icon="pi pi-plus"
              style={{ backgroundColor: "#00796B", color: "#ffffff" }}
            />
          </div>
        }
        footer={`Total data: ${kategoriList.length}`}
      >
        <Column
          header="No"
          body={(rowData, options) => {
            const rowIndex = options.rowIndex % rows;
            const nomorUrut = first + rowIndex + 1;
            return nomorUrut;
          }}
          style={{ width: "5%", minWidth: "5%" }}
        />
        <Column field="name" header="Name" />
        <Column
          field="keuanganId"
          header="Keuangan"
          body={(rowData) => {
            const keuangan = keuanganOptions.find(
              (kw) => kw.uuid === rowData.keuanganId
            );
            return keuangan ? keuangan.name : "N/A";
          }}
        />
        <Column field="number" header="Number" />
        <Column
          header="Actions"
          body={(rowData) => (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                label="Add Subkategori"
                onClick={() => {
                  setSubkategoriFormData([
                    { uuid: "", name: "", kategoriId: rowData.uuid },
                  ]); // Set kategoriId to current kategori
                  setSubkategoriDialogVisible(true);
                }}
                className="add-subkategori-button"
              />
              <Button
                icon="pi pi-pencil"
                onClick={() => editKategori(rowData)}
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
                onClick={() => deleteKategori(rowData.uuid)}
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
      <Dialog
        header="Add Subkategori"
        visible={isSubkategoriDialogVisible}
        onHide={() => setSubkategoriDialogVisible(false)}
        dismissableMask={true}
        modal={true}
        style={{ width: "70vw" }}
      >
        <div>
          <form onSubmit={handleSubkategoriSubmit}>
            {subkategoriFormData.map((item, index) => (
              <div key={index}>
                <div className="field">
                  <label htmlFor={`subkategoriName_${index}`}>
                    Subkategori Name:
                  </label>
                  <InputText
                    id={`subkategoriName_${index}`}
                    name="name"
                    value={item.name}
                    onChange={(e) => handleSubkategoriChange(index, e)}
                    required
                    className="input-field"
                  />
                </div>
                <div className="remove-button-container">
                  <Button
                    type="button"
                    label="Hapus"
                    className="remove-button"
                    onClick={() => removeSubkategoriField(index)}
                  />
                </div>
              </div>
            ))}
            <div className="add-jabatan-container">
              {" "}
              <Button
                type="button"
                label="Tambah"
                raised
                rounded
                icon="pi pi-plus"
                onClick={addSubkategoriField}
              />
            </div>
            <Button type="submit" label="Save Subkategori" />
          </form>
        </div>
      </Dialog>

      <Dialog
        header={isEditMode ? "Edit Kategori Data" : "Add Kategori Data"}
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
            <Card className="demografi-card">
              <div className="field">
                <label htmlFor="name">Nama:</label>
                <InputText
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <div className="field">
                <label htmlFor="keuanganId">Keuangan:</label>
                <Dropdown
                  id="keuanganId"
                  name="keuanganId"
                  optionLabel="name"
                  optionValue="uuid"
                  value={formData.keuanganId}
                  options={keuanganData}
                  onChange={handleChange}
                  placeholder="Select Keuangan"
                  required
                  className="input-field"
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

export default Kategori;
