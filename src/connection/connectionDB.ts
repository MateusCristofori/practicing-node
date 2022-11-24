import mongoose from "mongoose"

export const connect = () => {
  mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@node.epspoql.mongodb.net/?retryWrites=true&w=majority`).catch((error) => {console.log(error)})
}