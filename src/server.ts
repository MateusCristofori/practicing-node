import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors';
import authUserRoutes from './routes/AuthUserRoutes';
import newsRoutes from './routes/NewsRoutes';
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
app.use(publicRouter);
app.use(authUserRoutes);
app.use(newsRoutes);
//conexão com banco de dados principal

app.listen(8000, () => {
  console.log("Servidor rodando na porta http://localhost:8000")
});