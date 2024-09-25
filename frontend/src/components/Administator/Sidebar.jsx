import React, { useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import Tentang from "./Profil/Tentang";
import Sejarah from "./Profil/Sejarah";
import Demografi from "./Profil/Demografi";

const Dashboard = () => {
  const [visible, setVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Tentang");

  const renderContent = () => {
    switch (activeMenu) {
      case "Tentang":
        return <Tentang />;
      case "Sejarah":
        return <Sejarah />;
      case "Demografi":
        return <Demografi />;
      default:
        return <Tentang />;
    }
  };

  return (
    <div className="dashboard">
      <Button
        icon="pi pi-bars"
        onClick={() => setVisible(true)}
        className="p-mr-2"
      />
      <Sidebar visible={visible} onHide={() => setVisible(false)}>
        <h3>Profil</h3>
        <ul>
          <li onClick={() => setActiveMenu("Tentang")}>Tentang</li>
          <li onClick={() => setActiveMenu("Sejarah")}>Sejarah</li>
          <li onClick={() => setActiveMenu("Demografi")}>Demografi</li>
        </ul>
      </Sidebar>

      <div className="content">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
