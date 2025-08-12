import express from "express";
import passport from "passport";
import { isLoggedIn, isNotLoggedIn } from "../middlewares/index.js";
import { fetchUltraNowcast } from "../controller/weatherController.js";

const router = express.Router();

router.get("/weather/nowcast", fetchUltraNowcast);

//얘 필요 없음..
//router.get("/weather/nowcast/at", fetchUltraNowcastAt);

export default router;
