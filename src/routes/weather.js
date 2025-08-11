import express from "express";
import passport from "passport";
import { isLoggedIn, isNotLoggedIn } from "../middlewares/index.js";
import {
 fetchUltraNowcast, fetchUltraNowcastAt
} from "../controller/weatherController.js";

const router = express.Router();


router.get("/weather/nowcast", fetchUltraNowcast);  

router.get("/weather/nowcast/at", fetchUltraNowcastAt);

export default router;
