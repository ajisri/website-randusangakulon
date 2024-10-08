import React, { useState, useEffect, useCallback, useRef } from "react";
import useSWR, { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth"; // Pastikan hook ini sesuai dengan implementasi Anda
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import ReactQuill from "react-quill";
import { MultiSelect } from "primereact/multiselect"; // Import MultiSelect
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const Lembaga = () => {
  const [nama, setNama] = useState("");
  const [singkatan, setSingkatan] = useState("");
  const [dasarHukum, setDasarHukum] = useState("");
  const [alamatKantor, setAlamatKantor] = useState("");
  const [anggotaIds, setAnggotaIds] = useState([]); // Menyimpan ID anggota yang dipilih
  const [anggotaOptions, setAnggotaOptions] = useState([]); // Menyimpan opsi anggota untuk multiselect
  const [visiMisi, setVisiMisi] = useState([{ title: "", content: "" }]); // Inisialisasi dengan default value
  const [tugasPokok, setTugasPokok] = useState([{ content: "" }]); // Inisialisasi dengan default value
  const [status, setStatus] = useState("DRAFT");
  const navigate = useNavigate();
  const toast = useRef(null);
  const axiosJWT = useAuth(navigate);

  const fetcher = useCallback(
    async (url) => {
      const response = await axiosJWT.get(url);
      console.log("Data fetched from API:", response.data); // Tambahkan ini untuk memeriksa data
      return response.data;
    },
    [axiosJWT]
  );

  // Ambil data lembaga dan anggota
  const { data, error, isLoading } = useSWR(
    "http://localhost:5000/lembaga",
    fetcher
  );

  const { data: anggotaData } = useSWR(
    "http://localhost:5000/demografi", // Endpoint untuk mendapatkan anggota
    fetcher
  );

  useEffect(() => {
    if (data?.lembaga) {
      // Load data lembaga untuk edit
      setNama(data.lembaga.nama);
      setSingkatan(data.lembaga.singkatan);
      setDasarHukum(data.lembaga.dasar_hukum);
      setAlamatKantor(data.lembaga.alamat_kantor);
      setAnggotaIds(data.lembaga.anggota?.map((anggota) => anggota.uuid) || []);

      // Cek apakah visi_misi ada dan bentuk default
      if (data.lembaga.visi_misi) {
        setVisiMisi(
          data.lembaga.visi_misi.map((vm) => ({
            title: vm.title,
            content: vm.content,
          }))
        );
      } else {
        setVisiMisi([{ title: "", content: "" }]); // Default value
      }

      // Cek apakah tugas_pokok ada dan bentuk default
      if (data.lembaga.tugas_pokok) {
        setTugasPokok(
          data.lembaga.tugas_pokok.map((tp) => ({
            content: tp.content,
          }))
        );
      } else {
        setTugasPokok([{ content: "" }]); // Default value
      }
    }
  }, [data]);

  useEffect(() => {
    if (anggotaData?.demographics) {
      setAnggotaOptions(
        anggotaData.demographics.map((anggota) => ({
          label: anggota.name, // Nama anggota untuk ditampilkan
          value: anggota.uuid, // UUID anggota sebagai value
        }))
      );
    }
  }, [anggotaData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      nama,
      singkatan,
      dasar_hukum: dasarHukum,
      alamat_kantor: alamatKantor,
      anggotaIds, // Mengirim ID anggota yang dipilih
      visiMisi,
      tugasPokok,
    };

    try {
      const response = await axiosJWT.post(
        "http://localhost:5000/clembaga",
        formData
      );
      console.log("Data berhasil disimpan:", response.data);
      mutate("http://localhost:5000/lembaga"); // Re-fetch data lembaga
      toast.current.show({
        severity: "success",
        summary: "Berhasil",
        detail: "Data berhasil disimpan",
        life: 3000,
      });
    } catch (error) {
      console.error("Error saat menyimpan data:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Gagal menyimpan data",
        life: 3000,
      });
    }
  };

  const leftColumnRef = useRef(null);
  const rightColumnRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let resizeObserver;

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        const leftColumn = leftColumnRef.current;
        const rightColumn = rightColumnRef.current;

        if (leftColumn && rightColumn) {
          const leftColumnScrollTop = leftColumn.scrollTop;
          const viewportScrollTop = window.scrollY;
          const viewportHeight = window.innerHeight;
          const rightColumnHeight = rightColumn.offsetHeight;

          const scrollTop = Math.min(leftColumnScrollTop, viewportScrollTop);

          const limitTop =
            document.querySelector(".input-title").getBoundingClientRect().top -
            leftColumn.getBoundingClientRect().top;
          const limitBottom = viewportHeight - rightColumnHeight - 90;

          let newTop = Math.min(scrollTop, limitBottom);
          newTop = Math.max(newTop, limitTop);

          rightColumn.style.top = `${newTop}px`;
        }
      });
    };

    resizeObserver = new ResizeObserver(() => {
      handleScroll();
    });

    const leftColumn = leftColumnRef.current;
    const rightColumn = rightColumnRef.current;

    if (leftColumn) {
      leftColumn.addEventListener("scroll", handleScroll);
      resizeObserver.observe(leftColumn);
    }
    if (rightColumn) {
      resizeObserver.observe(rightColumn);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      if (leftColumn) {
        leftColumn.removeEventListener("scroll", handleScroll);
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="tentang-container">
      <Toast ref={toast} />
      <form onSubmit={handleSubmit}>
        <div className="content-wrapper">
          {/* Kolom Kiri */}
          <div className="left-column" ref={leftColumnRef}>
            <h3 className="section-title">Form Lembaga</h3>
            <div className="post-content-container scrollable-container">
              <Card className="cart">
                {/* Input Data Lembaga */}
                <div className="p-field input-text">
                  <label htmlFor="nama">Nama Lembaga</label>
                  <InputText
                    id="nama"
                    className="input-title"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                  />
                </div>
                <div className="p-field input-text">
                  <label htmlFor="singkatan">Singkatan</label>
                  <InputText
                    id="singkatan"
                    className="input-title"
                    value={singkatan}
                    onChange={(e) => setSingkatan(e.target.value)}
                  />
                </div>
                <div className="p-field input-text">
                  <label htmlFor="dasarHukum">Dasar Hukum</label>
                  <InputText
                    id="dasarHukum"
                    className="input-title"
                    value={dasarHukum}
                    onChange={(e) => setDasarHukum(e.target.value)}
                  />
                </div>
                <div className="p-field input-text">
                  <label htmlFor="alamatKantor">Alamat Kantor</label>
                  <InputText
                    id="alamatKantor"
                    className="input-title"
                    value={alamatKantor}
                    onChange={(e) => setAlamatKantor(e.target.value)}
                  />
                </div>
                <div className="p-field custom-multiselect">
                  <label htmlFor="anggota">Pilih Anggota</label>
                  <MultiSelect
                    options={anggotaOptions}
                    value={anggotaIds}
                    onChange={(e) => setAnggotaIds(e.value)}
                    placeholder="Pilih Anggota"
                    display="chip"
                    disabled={anggotaOptions.length === 0}
                  />
                </div>

                {/* Input Visi dan Misi */}
                <h4>Visi dan Misi</h4>
                {visiMisi.map((vm, index) => (
                  <div key={index} className="p-field">
                    <div className="custom-editor">
                      <ReactQuill
                        value={vm.content}
                        onChange={(content) => {
                          const newVisiMisi = [...visiMisi];
                          newVisiMisi[index].content = content;
                          setVisiMisi(newVisiMisi);
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* Input Tugas Pokok */}
                <h4>Tugas Pokok</h4>
                {tugasPokok.map((tp, index) => (
                  <div key={index} className="p-field custom-editor">
                    <ReactQuill
                      value={tp.content}
                      onChange={(content) => {
                        const newTugasPokok = [...tugasPokok];
                        newTugasPokok[index].content = content;
                        setTugasPokok(newTugasPokok);
                      }}
                    />
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="right-column" ref={rightColumnRef}>
            <Card className="cardr" title="Publish Options">
              <div className="publish-options-top">
                <div className="radio-button-container">
                  <RadioButton
                    inputId="draft"
                    name="status"
                    value="DRAFT"
                    onChange={(e) => setStatus(e.target.value)}
                    checked={status === "DRAFT"}
                  />
                  <label htmlFor="draft">Draft</label>
                </div>
                <div className="radio-button-container">
                  <RadioButton
                    inputId="publish"
                    name="status"
                    value="PUBLISH"
                    onChange={(e) => setStatus(e.target.value)}
                    checked={status === "PUBLISH"}
                  />
                  <label htmlFor="publish">Publish</label>
                </div>
              </div>
              <div className="publish-options-bottom">
                <Button
                  label="Simpan"
                  raised
                  className="p-buttonadmin"
                  type="submit"
                />
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Lembaga;
