import express from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import loginRoute from "./routes/loginRoute.js";
import profileRoute from "./routes/profileRoute.js";
import serviceRoute from "./routes/serviceRoute.js";
import transparentRoute from "./routes/transparentRoute.js";
dotenv.config();

const app = express();

app.use(cookieParser());
app.use("/uploads", express.static(path.resolve("uploads")));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(loginRoute);
app.use(profileRoute);
app.use(serviceRoute);
app.use(transparentRoute);

app.listen(5000, () => console.log("Server runing"));
