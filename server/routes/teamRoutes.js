import express from "express"
import { getTeamStatus, refreshTeam } from "../controllers/teamController.js";

const router = express.Router();

router.get("/api/:fplName",getTeamStatus);

router.post("/api/:fplName/refresh",refreshTeam);

export default router;