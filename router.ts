import express from "express";
import {
  apiLimiter,
  isLoggedIn,
  isNotLoggedIn,
} from "./middleware";
import { renderHome } from "./controllers/page";
import {
  checkLoginCode,
  login,
  join,
  leave,
  changeNick,
  changePassword,
} from "./controllers/auth";
import {
  generateMiner,
upgradeMiner,
sendMiner
} from "./controllers/miner";


const router = express.Router();
/* pageRouter */
router.get("/", apiLimiter, renderHome);
/* authRouter */
router.post("/auth/checkLoginCode", apiLimiter, checkLoginCode);
router.post("/auth/login", apiLimiter, isNotLoggedIn, login);
router.post("/auth/join", apiLimiter, isNotLoggedIn, join);
router.post("/auth/leave", apiLimiter, isLoggedIn, leave);
router.post("/auth/changeNick", apiLimiter, isLoggedIn, changeNick);
router.post("/auth/changePassword", apiLimiter, isLoggedIn, changePassword);
/* minerRouter */
router.post("/miner/generateMiner", apiLimiter, isLoggedIn, generateMiner);
router.post("/miner/upgradeMiner", apiLimiter, isLoggedIn, upgradeMiner);
router.post("/miner/sendMiner", apiLimiter, isLoggedIn, sendMiner);

export default router;
