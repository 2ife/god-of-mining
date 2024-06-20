"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNotLoggedIn = exports.isLoggedIn = exports.apiLimiter = exports.checkIp = void 0;
const common_1 = require("./controllers/common");
const index_1 = require("./models/index");
const express_rate_limit_1 = require("express-rate-limit");
const logger_1 = require("./logger");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function validateXForwardedFor(header) {
    // IP 주소 형식 검증 로직 추가
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipRegex.test(header.split(",")[0].trim());
}
const getIp = (req) => {
    let ip = "X";
    if (process.env.DB_HOST === "127.0.0.1") {
        ip = "O";
    }
    else {
        const xForwardedFor = req.headers["x-forwarded-for"];
        if (xForwardedFor &&
            typeof xForwardedFor === "string" &&
            validateXForwardedFor(xForwardedFor)) {
            ip = xForwardedFor.split(",")[0];
        }
    }
    return ip;
};
const getBannedIpArr = () => {
    let bannedIpArrStr = process.env.BANNED_IP;
    bannedIpArrStr = bannedIpArrStr.replace(/[\[\]]/g, ""); // 대괄호 제거
    const bannedIpArr = bannedIpArrStr.split(",").map((bannedIp) => {
        return bannedIp.trim();
    });
    return bannedIpArr;
};
const checkIp = async (req, res, next) => {
    const ip = getIp(req);
    if (ip === "X") {
        return res.send("해당 ip에서는 접속이 불가합니다.");
    }
    const bannedIpArr = getBannedIpArr();
    if (bannedIpArr.includes(ip)) {
        return res.send(`해당 ip는 과도한 요청으로 인해 현재 접속이 차단된 상태입니다. 문제 해결 희망 시, 2ife1601@gmail.com으로 문의 바랍니다. (문의 시, 해당 ip를 알려주시길 바랍니다. ip: ${ip})`);
    }
    next();
};
exports.checkIp = checkIp;
const apiLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 20000,
    max: 20,
    handler(req, res) {
        const ip = getIp(req);
        logger_1.logger.info(`rateLimit over (ip: ${ip})`);
        res.send("단기간 내 너무 많은 데이터를 요청하여 잠시 후에 접속 바랍니다.");
    },
});
exports.apiLimiter = apiLimiter;
const isLoggedIn = async (req, res, next) => {
    try {
        const { loginCode } = req.body;
        if (!loginCode) {
            const errorObj = {
                place: "middlewares-isLoggedIn",
                content: "no loginCode!",
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const user = await index_1.User.findOne({ where: { loginCode } });
        if (!user) {
            const errorObj = {
                place: "middlewares-isLoggedIn",
                content: "no user!",
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        if (user.lockMemo) {
            const errorObj = {
                place: "middlewares-isLoggedIn",
                content: "user locked!",
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        res.locals.user = user;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.isLoggedIn = isLoggedIn;
const isNotLoggedIn = async (req, res, next) => {
    try {
        const { loginCode } = req.body;
        if (loginCode) {
            const user = await index_1.User.findOne({ where: { loginCode } });
            if (user) {
                const errorObj = {
                    place: "middlewares-isNotLoggedIn",
                    content: `already loggedIn! user id: ${user.id}`,
                    user: user.loginId,
                };
                throw new common_1.ReqError(errorObj, errorObj.content);
            }
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.isNotLoggedIn = isNotLoggedIn;
