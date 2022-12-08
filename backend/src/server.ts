import cors from 'cors';
import dotenv from 'dotenv';
import express, { Router } from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import { connect } from './connection/connectionDB';
import { middlewareError } from './middlewares/middlewareError';
import privateRouter from './routes/privateRoutes';
import publicRouter from './routes/publicRoutes';

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

dotenv.config();

// rotas
const privateRouters: Router = privateRouter;
const publicRouters: Router = publicRouter;
app.use("/blog", publicRouter);
app.use("/users", privateRouter);
// errors
app.use(middlewareError);

// conexão com banco de dados principal
connect();

app.listen(8000, () => {
  console.log("Servidor rodando na porta 8000")
});