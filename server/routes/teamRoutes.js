import express from "express"
import { getTeamStatus, refreshTeam } from "../controllers/teamController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/api/:fplName",getTeamStatus);

router.post("/api/:fplName/refresh",verifyAdmin,refreshTeam);

export default router;