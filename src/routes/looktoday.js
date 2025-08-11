import express from "express";
import passport from "passport";
import { isLoggedIn, isNotLoggedIn } from "../middlewares/index.js";

import { createLooktoday } from "../controller/looktodayController.js";

const router = express.Router();

//looktoday 저장
router.post("/looktoday/create", isLoggedIn, createLooktoday);

export default router;
