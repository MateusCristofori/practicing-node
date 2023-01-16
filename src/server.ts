import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors';
import { connect } from './connection/connectionDB';
import privateRouter from './routes/AuthUserRoutes';
import publicRouter from './routes/publicRoutes';
//express
const app = express();
//json
app.use(express.json());
//cors
app.use(cors());
//dotenv
dotenv.config();
// rotas
app.use("/blog", publicRouter);
app.use("/users", privateRouter);
//conexão com banco de dados principal
connect();

app.listen(8000, () => {
  console.log("Servidor rodando na porta http://localhost:8000")
});