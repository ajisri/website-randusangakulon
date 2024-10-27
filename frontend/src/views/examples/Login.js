import React, { useState } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { useNavigate } from "react-router-dom";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const Auth = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/login", {
        username: username,
        password: password,
      });
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
        console.error("Error during login:", error.response.data.msg);
      }
    }
  };

  return (
    <div className="flex align-items-center justify-content-center h-screen">
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
        <div className="text-center mb-5">
          <img
            src="../../assets/img/theme/Lambang_Kabupaten_Brebes.png"
            alt="logo"
            height={50}
            className="mb-3"
          />
          <div className="text-900 text-3xl font-medium mb-3">
            Selamat Datang
          </div>
        </div>

        <div>
          <form onSubmit={Auth}>
            <p className="has-text-centered">{msg}</p>
            <label
              htmlFor="username"
              className="block text-900 font-medium mb-2"
            >
              Username
            </label>
            <InputText
              id="username"
              type="text"
              placeholder="Username address"
              className="w-full mb-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label
              htmlFor="password"
              className="block text-900 font-medium mb-2"
            >
              Password
            </label>
            <InputText
              id="password"
              type="password"
              placeholder="Password"
              className="w-full mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex align-items-center justify-content-between mb-6">
              <div className="flex align-items-center">
                <Checkbox
                  inputId="rememberme"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.checked)}
                  className="mr-2"
                />
                <label htmlFor="rememberme">Remember me</label>
              </div>
              <a
                href="/landing-page"
                className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer"
              >
                Lupa password?
              </a>
            </div>

            <Button label="Sign In" icon="pi pi-user" className="w-full" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
