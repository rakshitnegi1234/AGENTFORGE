import express from "express"
import dotenv from "dotenv"
import connectDB from "./Config/db.js";
import router from "./Routes/auth.routes.js";
import cors from "cors";
dotenv.config();

const port = process.env.PORT;
const app = express();
app.use(express.json()); 

app.use("/",router);  

app.listen(port,()=>
{
   console.log(`AUTH SERVER listening at port ${port}`);
     connectDB();
});

app.get("/", (req,res)=>
{
   res.send("AUTH SERVICE");
})