import { RequestHandler } from "express";
import { ReqError } from "./controllers/common";
import { User } from "./models/index";
import { rateLimit } from "express-rate-limit";
import { logger } from "./logger";
import dotenv from "dotenv";

dotenv.config();

const getIp = (req: any): string => {
  return req.headers["x-forwarded-for"]
    ? `${req.headers["x-forwarded-for"].split(",")[0]}`
    : "X";
};

const getBannedIpArr = () => {
  let bannedIpArrStr = process.env.BANNED_IP!;
  bannedIpArrStr = bannedIpArrStr.replace(/[\[\]]/g, ""); // 대괄호 제거
  const bannedIpArr = bannedIpArrStr.split(",").map((bannedIp) => {
    return bannedIp.trim();
  });
  return bannedIpArr;
};

const checkIp: RequestHandler = async (req, res, next) => {
  const ip = getIp(req);
  if (ip === "X") {
    return res.send("해당 ip에서는 접속이 불가합니다.");
  }
  const bannedIpArr = getBannedIpArr();
  if (bannedIpArr.includes(ip)) {
    return res.send(
      `해당 ip는 과도한 요청으로 인해 현재 접속이 차단된 상태입니다. 문제 해결 희망 시, 2ife1601@gmail.com으로 문의 바랍니다. (문의 시, 해당 ip를 알려주시길 바랍니다. ip: ${ip})`
    );
  }
  next();
};

const apiLimiter = rateLimit({
  windowMs: 20000,
  max: 20,
  handler(req, res) {
    const ip = getIp(req);
    logger.info(`rateLimit over (ip: ${ip})`);
    res.send("단기간 내 너무 많은 데이터를 요청하여 잠시 후에 접속 바랍니다.");
  },
});

const isLoggedIn: RequestHandler = async (req, res, next) => {
  try {
    const { loginCode } = req.body;
    if (!loginCode) {
      const errorObj = {
        place: "middlewares-isLoggedIn",
        content: "no loginCode!",
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const user = await User.findOne({ where: { loginCode } });
    if (!user) {
      const errorObj = {
        place: "middlewares-isLoggedIn",
        content: "no user!",
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (user.lockMemo) {
      const errorObj = {
        place: "middlewares-isLoggedIn",
        content: "user locked!",
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    res.locals.user = user;
    next();
  } catch (err: any) {
    next(err);
  }
};

const isNotLoggedIn: RequestHandler = async (req, res, next) => {
  try {
    const { loginCode } = req.body;
    if (loginCode) {
      const user = await User.findOne({ where: { loginCode } });
      if (user) {
        const errorObj = {
          place: "middlewares-isNotLoggedIn",
          content: `already loggedIn! user id: ${user.id}`,
          user: user.loginId,
        };
        throw new ReqError(errorObj, errorObj.content);
      }
    }
    next();
  } catch (err: any) {
    next(err);
  }
};

export { checkIp, apiLimiter, isLoggedIn, isNotLoggedIn };
