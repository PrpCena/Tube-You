import dotenv from "dotenv"
import { app } from "./app.js"
import connectDB from "./db/index.js"


dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 4000

connectDB()
.then(PORT, () => {
    console.log(`server is running on prot ${PORT}`)
})
.catch((err)=> { 
    console.log(`mongodb connection error`, err)
})

app.listen(PORT, () => {
  console.log(`The server is up and running on ${PORT}`);
});
  