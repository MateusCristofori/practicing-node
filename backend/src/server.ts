import dotenv from 'dotenv';
import express, { Router } from 'express';
import { connect } from './connection/connectionDB';
import privateRouter from './routes/privateRoutes';
import publicRouter from './routes/publicRoutes';

const app = express();

app.use(express.json());

dotenv.config();

// rotas
const privateRouters: Router = privateRouter;
const publicRouters: Router = publicRouter;
app.use("/blog", publicRouter);
app.use("/users", privateRouter)

// conexão com banco de dados principal
connect();

app.listen(8000, () => {
  console.log("Servidor rodando na porta 8000")
});