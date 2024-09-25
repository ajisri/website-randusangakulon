import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode as jwt_decode } from "jwt-decode";
import { useNavigate, NavLink } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Panel } from "primereact/panel";
import { Editor } from "primereact/editor";
// import { Button } from 'primereact/button';

import "primereact/resources/themes/saga-blue/theme.css"; // Atau pilih tema lainnya
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const Dashboard = () => {
  const [activePanel, setActivePanel] = useState("Home");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.name);
      setRole(decoded.role);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("http://localhost:5000/token");
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        // setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setName(decoded.name);
        setRole(decoded.role);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const menuItems = [
    {
      label: "Home",
      icon: "pi pi-fw pi-home",
      command: () => setActivePanel("Home"),
    },
    {
      label: "Profil",
      icon: "pi pi-fw pi-user",
      items: [
        {
          label: "Tentang",
          icon: "pi pi-fw pi-info",
          command: () => setActivePanel("Tentang"),
        },
        {
          label: "Sejarah",
          icon: "pi pi-fw pi-calendar",
          command: () => setActivePanel("Sejarah"),
        },
        {
          label: "Visi dan Misi",
          icon: "pi pi-fw pi-flag",
          command: () => setActivePanel("VisiMisi"),
        },
        {
          label: "Struktur Organisasi",
          icon: "pi pi-fw pi-sitemap",
          command: () => setActivePanel("StrukturOrganisasi"),
        },
        {
          label: "Lembaga",
          icon: "pi pi-fw pi-building",
          command: () => setActivePanel("Lembaga"),
        },
        {
          label: "Geografi",
          icon: "pi pi-fw pi-globe",
          command: () => setActivePanel("Geografi"),
        },
      ],
    },
    {
      label: "Settings",
      icon: "pi pi-fw pi-cog",
      command: () => setActivePanel("Settings"),
    },
    {
      label: "Admin",
      icon: "pi pi-fw pi-lock",
      command: () => setActivePanel("Admin"),
      visible: role === "admin",
    },
  ];

  const renderContent = () => {
    switch (activePanel) {
      case "Tentang":
        return (
          <Editor
            value={content}
            onTextChange={(e) => setContent(e.htmlValue)}
          />
        );
      case "Sejarah":
        return (
          <Editor
            value={content}
            onTextChange={(e) => setContent(e.htmlValue)}
          />
        );
      case "VisiMisi":
        return (
          <Editor
            value={content}
            onTextChange={(e) => setContent(e.htmlValue)}
          />
        );
      case "StrukturOrganisasi":
        return (
          <Editor
            value={content}
            onTextChange={(e) => setContent(e.htmlValue)}
          />
        );
      case "Lembaga":
        return (
          <Editor
            value={content}
            onTextChange={(e) => setContent(e.htmlValue)}
          />
        );
      case "Geografi":
        return (
          <Editor
            value={content}
            onTextChange={(e) => setContent(e.htmlValue)}
          />
        );
      case "Home":
        return <div>Welcome to the Home page, {name}!</div>;
      case "Settings":
        return <div>Adjust your settings here.</div>;
      case "Admin":
        return <div>Admin content for role: {role}</div>;
      default:
        return null;
    }
  };

  return (
    <div className="p-grid">
      <div className="p-col-12 p-md-2">
        <Menubar model={menuItems} />
      </div>

      <div className="p-col-12 p-md-10">
        <Panel header={activePanel}>{renderContent()}</Panel>
      </div>
    </div>
  );
};

export default Dashboard;
