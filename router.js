"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("./middleware");
const page_1 = require("./controllers/page");
const auth_1 = require("./controllers/auth");
const miner_1 = require("./controllers/miner");
const router = express_1.default.Router();
/* pageRouter */
router.get("/", middleware_1.apiLimiter, page_1.renderHome);
/* authRouter */
router.post("/auth/checkLoginCode", middleware_1.apiLimiter, auth_1.checkLoginCode);
router.post("/auth/login", middleware_1.apiLimiter, middleware_1.isNotLoggedIn, auth_1.login);
router.post("/auth/join", middleware_1.apiLimiter, middleware_1.isNotLoggedIn, auth_1.join);
router.post("/auth/leave", middleware_1.apiLimiter, middleware_1.isLoggedIn, auth_1.leave);
router.post("/auth/changeNick", middleware_1.apiLimiter, middleware_1.isLoggedIn, auth_1.changeNick);
router.post("/auth/changePassword", middleware_1.apiLimiter, middleware_1.isLoggedIn, auth_1.changePassword);
/* minerRouter */
router.post("/miner/generateMiner", middleware_1.apiLimiter, middleware_1.isLoggedIn, miner_1.generateMiner);
router.post("/miner/upgradeMiner", middleware_1.apiLimiter, middleware_1.isLoggedIn, miner_1.upgradeMiner);
router.post("/miner/sendMiner", middleware_1.apiLimiter, middleware_1.isLoggedIn, miner_1.sendMiner);
exports.default = router;
