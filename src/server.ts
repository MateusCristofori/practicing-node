import dotenv from 'dotenv';
import express, { Router } from 'express';
import { connect } from './connection/connectionDB';
import router from './routes/route';

const app = express();

app.use(express.json());

dotenv.config();

// rotas
const usersRoutes: Router = router;
app.use("/users", usersRoutes);

// conectar com banco de dados
connect();
  
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000")
});
