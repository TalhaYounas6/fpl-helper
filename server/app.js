import express from "express";
import cors from "cors";
import "dotenv/config";
import router from "./routes/teamRoutes.js";
import "./cron/scheduler.js";

const app = express();

app.use(cors({
 origin: ['http://localhost:5173'],["https://premier-league-press-pass.vercel.app/"]
  credentials: true
}))

app.use(express.json());
app.use(router);

app.get("/",(req,res)=>{
    res.send("Server is Live.")
});

export default app;
