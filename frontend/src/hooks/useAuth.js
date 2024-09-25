import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode as jwt_decode } from "jwt-decode";

const useAuth = (navigate) => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await axios.get("http://localhost:5000/token");
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setExpire(decoded.exp);
      } catch (error) {
        navigate("/");
      }
    };

    refreshToken();
  }, [navigate]);

  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("http://localhost:5000/token");
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setExpire(decoded.exp);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return axiosJWT;
};

export default useAuth;
