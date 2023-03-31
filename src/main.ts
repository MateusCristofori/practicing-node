/* eslint-disable @typescript-eslint/ban-types */
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import "reflect-metadata";
//import container from "./container/container";
import authUserRoutes from "./routes/AuthUser.routes";
import newsRoutes from "./routes/News.routes";
import publicRouter from "./routes/public.routes";
//import TYPES from "./container/types";

//express
const app = express();
//json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//cors
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
//rotas
app.use(publicRouter);
app.use(authUserRoutes);
app.use(newsRoutes);
//dotenv
dotenv.config();

app.listen(8000, () => {
  console.log("Servidor rodando -> http://localhost:8000");
});
