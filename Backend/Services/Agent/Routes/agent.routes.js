import express, { Router } from "express";
import { agent } from "../Controllers/agent.controllers.js";

const router =  express.Router();

router.post("/chat",agent);

export default router;
