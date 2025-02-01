import express from "express"
import cors from 'cors'
import { mainRouter } from "./routes/index.js"
import bodyParser from 'body-parser'
const app=express()
app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
app.use(express.json())
app.use("/api/v1",mainRouter);
app.listen(8800,()=>{
    console.log("server is running on port 8800")
})



