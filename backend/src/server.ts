import 'express-async-errors';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import { connect } from './connection/connectionDB';
import { middlewareError } from './middlewares/middlewareError';
import privateRouter from './routes/privateRoutes';
import publicRouter from './routes/publicRoutes';
//express
const app = express();
//json
app.use(express.json());
//fileUpload
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, 'temp')
}))
//cors
app.use(cors());
//dotenv
dotenv.config();
// rotas
app.use("/blog", publicRouter);
app.use("/users", privateRouter);
//Middleware de errors
app.use(middlewareError);
//conexão com banco de dados principal
connect();

app.listen(8000, () => {
  console.log("Servidor rodando na porta http://localhost:8000")
});