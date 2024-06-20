import express from "express";
import { checkIp, apiLimiter, isLoggedIn, isNotLoggedIn } from "./middleware";
import { renderHome } from "./controllers/page";
import {
  checkLoginCode,
  login,
  join,
  leave,
  changeNick,
  changePassword,
} from "./controllers/auth";
import { generateMiner, upgradeMiner, sendMiner } from "./controllers/miner";

const router = express.Router();
/* pageRouter */
router.get("/", checkIp, apiLimiter, renderHome);
/* authRouter */
router.post("/auth/checkLoginCode", checkIp, apiLimiter, checkLoginCode);
router.post("/auth/login", checkIp, apiLimiter, isNotLoggedIn, login);
router.post("/auth/join", checkIp, apiLimiter, isNotLoggedIn, join);
router.post("/auth/leave", checkIp, apiLimiter, isLoggedIn, leave);
router.post("/auth/changeNick", checkIp, apiLimiter, isLoggedIn, changeNick);
router.post(
  "/auth/changePassword",
  checkIp,
  apiLimiter,
  isLoggedIn,
  changePassword
);
/* minerRouter */
router.post(
  "/miner/generateMiner",
  checkIp,
  apiLimiter,
  isLoggedIn,
  generateMiner
);
router.post(
  "/miner/upgradeMiner",
  checkIp,
  apiLimiter,
  isLoggedIn,
  upgradeMiner
);
router.post("/miner/sendMiner", checkIp, apiLimiter, isLoggedIn, sendMiner);

export default router;
