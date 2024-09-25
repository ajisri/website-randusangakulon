import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ToastContainer from "./components/ToastContainer";

//administrator
import Dashboard from "./components/Administator/Dashboard";
// import Sidebar from "./components/Administator/Sidebar";
import "components/App.css";

import KeuanganDesa from "views/examples/KeuanganDesa";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss?v1.1.0";

import Index from "views/Index.js";
import Landing from "views/examples/Landing.js";
import Landingpr from "views/examples/Landingpr.js";
import Login from "views/examples/Login.js";
import Profile from "views/examples/Profile.js";
import Register from "views/examples/Register.js";

import axios from "axios";
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById("root"));
class App extends React.Component {
  constructor(props) {
    super(props);
    this.toastRef = React.createRef();
  }

  showToast = (severity, summary, detail) => {
    if (this.toastRef.current) {
      this.toastRef.current.showToast(severity, summary, detail);
    }
  };

  render() {
    return (
      <BrowserRouter>
        <ToastContainer ref={this.toastRef} />
        <Routes>
          <Route path="/" exact element={<Index />} />
          <Route path="/landing-page" exact element={<Landing />} />
          <Route path="/landingpr" exact element={<Landingpr />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/profile-page" exact element={<Profile />} />
          <Route path="/register-page" exact element={<Register />} />
          <Route path="/keuangan-desa" element={<KeuanganDesa />} />
          <Route
            path="/Dashboard"
            element={<Dashboard showToast={this.showToast} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

root.render(<App />);
