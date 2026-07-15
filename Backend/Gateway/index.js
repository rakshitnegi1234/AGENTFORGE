import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy";
import cors from "cors";
import cookieParser from "cookie-parser";
import protect from "./Middleware/auth.middleware.js";
import { getCurrentUser } from "./Controller/user.controller.js";
dotenv.config();

// GATEWAY  pkg express-http-proxy

const port = process.env.PORT;
const app = express();
app.use(cookieParser());

app.use(cors({
   origin:process.env.FRONTEND_URL,
   credentials:true
}));



app.use("/api/v1/youridentity" , protect, getCurrentUser );
app.use("/api/v1/auth", proxy(process.env.AUTH_SERVICE));

app.listen(port,()=>
{
   console.log(`GATEWAY SERVER listening at port ${port}`);
});

app.get("/", (req,res)=>
{
   res.send("GATEWAY SERVER");
})