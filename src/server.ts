import express, { Router } from 'express'
import router from './routes/route'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { connect } from './connection/connectionDB'



const app = express()

app.use(express.json())

dotenv.config()

// rotas
const routes: Router = router

app.use("/users", routes)

// conectar com banco de dados
connect()
  
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000")
  
})
