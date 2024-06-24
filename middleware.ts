import { RequestHandler } from "express";
import { ReqError } from "./controllers/common";
import { User } from "./models/index";
import { rateLimit } from "express-rate-limit";
import { logger } from "./logger";
import { bannedIp } from "./bannedIp";
import dotenv from "dotenv";

dotenv.config();

function validateXForwardedFor(header: string) {
  // IP 주소 형식 검증 로직 추가
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  return ipRegex.test(header.split(",")[0].trim());
}

const getIp = (req: any): string => {
  let ip = "X";
  if (process.env.DB_HOST === "127.0.0.1") {
    ip = "O";
  } else {
    const xForwardedFor = req.headers["x-forwarded-for"];
    if (
      xForwardedFor &&
      typeof xForwardedFor === "string" &&
      validateXForwardedFor(xForwardedFor)
    ) {
      ip = xForwardedFor.split(",")[0];
    }
  }
  return ip;
};

const checkIp: RequestHandler = async (req, res, next) => {
  const ip = getIp(req);
  if (ip === "X") {
    return res.send("해당 ip에서는 접속이 불가합니다.");
  }
  if (bannedIp.includes(ip)) {
    return res.send(
      `해당 ip는 과도한 요청으로 인해 현재 접속이 차단된 상태입니다. 문제 해결 희망 시, https://open.kakao.com/me/godofmining 으로 문의 바랍니다. (문의 시, 해당 ip를 알려주시길 바랍니다. ip: ${ip})`
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
