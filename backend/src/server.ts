import dotenv from 'dotenv';
import express, { Router } from 'express';
import { connect } from './connection/connectionDB';
import privateRouter from './routes/privateRoutes';
import publicRouter from './routes/publicRoutes';
import { middlewareError } from './middlewares/middlewareError';
import { ApiError } from './helpers/api_error';

const app = express();

app.use(express.json());

dotenv.config();


app.get("/testando", () => {
  throw new ApiError("Endpoint de teste do middleware de erros.", 404);
});

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