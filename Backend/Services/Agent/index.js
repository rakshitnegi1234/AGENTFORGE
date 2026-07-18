import express from "express"
import dotenv from "dotenv"
import connectDB from "./Config/db.js";
import { agent } from "./Controllers/agent.controllers.js";
import router from "./Routes/agent.routes.js";
dotenv.config();

const port = process.env.PORT;
const app = express();
app.use(express.json()); 
app.use("/", router);


app.listen(port,()=>
{
   console.log(`AGENT SERVER listening at port ${port}`);
     connectDB();
});

app.get("/", (req,res)=>
{
   res.send("AGENT SERVICE");
})
