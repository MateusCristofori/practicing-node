/* eslint-disable @typescript-eslint/ban-types */
import "reflect-metadata";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import { InversifyExpressServer } from "inversify-express-utils";
//import container from "./container/container";
import authUserRoutes from "./routes/AuthUser.routes";
import newsRoutes from "./routes/News.routes";
import publicRouter from "./routes/public.routes";
import { IUserRepository } from "./infra/repositories/interfaces/IUserRepository";
//import TYPES from "./container/types";
import { UserRepository } from "./infra/repositories/UserRepository";
import { UserController } from "./controllers/User.controller";
import { User } from "@prisma/client";
import { db } from "./database/prisma";

// class Server {
//   constructor() {
//     this.createServer();
//     this.configDependecies();
//   }

//   configDependecies() {
//     container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
//   }

//   createServer() {
//     const server = new InversifyExpressServer(container);
//     server.setConfig((app) => {
//       app.use(express.json());
//       app.use(express.urlencoded({ extended: true }));
//       app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
//       app.use(publicRouter);
//       app.use(authUserRoutes);
//       app.use(newsRoutes);
//     });
//     const app = server.build();
//     app.listen(8000, () => {
//       console.log("Servidor rodando -> http://localhost:8000");
//     });
//   }
// }

// new Server();

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
