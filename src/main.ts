import "reflect-metadata";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import authUserRoutes from "./routes/AuthUser.routes";
import newsRoutes from "./routes/News.routes";
import publicRouter from "./routes/public.routes";
//express
const app = express();
//json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//cors
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
//dotenv
dotenv.config();
// rotas
app.use(publicRouter);
app.use(authUserRoutes);
app.use(newsRoutes);
//conexão com banco de dados principal

app.listen(8000, () => {
  console.log("Servidor rodando -> http://localhost:8000");
});
