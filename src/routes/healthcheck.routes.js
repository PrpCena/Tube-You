import { Router } from "express";
import { healthCheck } from "../controllers/healthcheck.coltrollers.js";

const router = Router();

router.route("/").get(healthCheck);

export default router;
