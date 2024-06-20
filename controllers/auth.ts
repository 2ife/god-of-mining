import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import { SendLog, User, sequelize } from "../models";
import { ReqError, getDateStr, testLoginInfo } from "./common";
import { Op } from "sequelize";

const checkLoginCode: RequestHandler = async (req, res, next) => {
  try {
    let { loginCode } = req.body;
    loginCode = `${loginCode}`;
    const user = await User.findOne({ where: { loginCode } });
    if (!user) {
      return res.json({ answer: "no user" });
    }
    if (user.lockMemo) {
      const errorObj = {
        place: "controllers-auth-checkLoginCode",
        content: `user locked!`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const currentDate = new Date();
    const currentDateStr = getDateStr(currentDate);
    let mine = false;
    if (currentDateStr !== user.lastMineDate) {
      user.coin += user.minersTotalPerformance;
      user.lastMineDate = currentDateStr;
      mine = true;
    }
    const newLoginCode = await bcrypt.hash(`${user.id}${Date.now()}`, 2);
    user.loginCode = newLoginCode;
    const userData = {
      nick: user.nick,
      loginId: user.loginId,
      minersArray: user.minersArray,
      minersTotalPerformance: user.minersTotalPerformance,
      cash: user.cash,
      coin: user.coin,
    };
    const oneWeekAgo_time = currentDate.getTime() - 86400000 * 7;
    const oneWeekAgo =
      oneWeekAgo_time > user.createdAt.getTime()
        ? new Date(oneWeekAgo_time)
        : user.createdAt;
    const sendLogs = await SendLog.findAll({
      where: {
        [Op.or]: [
          {
            sender: user.nick,
          },
          {
            receiver: user.nick,
          },
        ],
        createdAt: {
          [Op.gte]: oneWeekAgo,
        },
      },
      order: [["createdAt", "DESC"]],
    });
    const sendLogsData = sendLogs.map((log) => {
      return {
        sender: log.sender,
        receiver: log.receiver,
        minerLevel: log.minerLevel,
        minerAmounts: log.minerAmounts,
        time: log.createdAt.getTime(),
      };
    });
    const transaction = await sequelize.transaction();
    try {
      await user.save({ transaction });
      if (mine) {
        await SendLog.destroy({
          where: {
            [Op.or]: [{ sender: user.nick }, { receiver: user.nick }],
            createdAt: {
              [Op.lt]: oneWeekAgo,
            },
          },
          transaction,
        });
      }
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-auth-checkLoginCode",
        content: "checkLoginCode transaction error",
        user: user.loginId,
      };
      throw new ReqError(errorObj, err.message);
    }
    res.json({
      newLoginCode,
      userData,
      sendLogsData,
      mine,
    });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-auth-checkLoginCode";
      err.content = "checkLoginCodeError";
      err.user = null;
    }
    next(err);
  }
};
const join: RequestHandler = async (req, res, next) => {
  try {
    const { name, DOB, nick, loginId, password, email } = req.body;
    const nameTest = testLoginInfo("name", name);
    const DOBTest = testLoginInfo("DOB", DOB);
    const nickTest = testLoginInfo("nick", nick);
    const idTest = testLoginInfo("id", loginId);
    const passwordTest = testLoginInfo("password", password);
    const emailTest = testLoginInfo("email", email);
    if (
      !name ||
      !DOB ||
      !nick ||
      !loginId ||
      !password ||
      !email ||
      !nameTest ||
      !DOBTest ||
      !nickTest ||
      !idTest ||
      !passwordTest ||
      !emailTest
    ) {
      const errorObj = {
        place: "controllers-auth-join",
        content: "banned join!",
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const exNick = await User.findOne({ where: { nick } });
    const exId = await User.findOne({ where: { loginId } });
    if (exNick || exId) {
      return res.json({
        nickExist: exNick === null ? false : true,
        idExist: exId === null ? false : true,
      });
    }
    const hash = await bcrypt.hash(password, 12);

    const transaction = await sequelize.transaction();
    try {
      await User.create(
        {
          nick,
          loginId,
          password: hash,
          lastMineDate: getDateStr(new Date()),
          name,
          dob: DOB,
          email,
        },
        { transaction }
      );
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-auth-join",
        content: "join transaction error",
      };
      throw new ReqError(errorObj, err.message);
    }
    return res.json({ answer: "join success" });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-auth-join";
      err.content = "joinError";
      err.user = null;
    }
    next(err);
  }
};

const login: RequestHandler = async (req, res, next) => {
  try {
    let { loginId, password } = req.body;
    loginId = `${loginId}`;
    password = `${password}`;
    const user = await User.findOne({ where: { loginId } });
    if (!user) {
      return res.json({ answer: "no user" });
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.json({ answer: "no user" });
    }
    if (user.lockMemo) {
      return res.json({ answer: "lock" });
    }
    const loginCode = await bcrypt.hash(`${loginId}${Date.now()}`, 2);
    user.loginCode = loginCode;
    await user.save();
    res.json({ loginCode });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-auth-login";
      err.content = "loginError";
      err.user = null;
    }
    next(err);
  }
};
const leave: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user as User;
    const { password } = req.body;
    const passwordTester =
      /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()._-]{6,16}$/;
    if (!passwordTester.test(password)) {
      const errorObj = {
        place: "controllers-auth-leave",
        content: `invalid password! password: ${password}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.json({ answer: "no user" });
    }
    const transaction = await sequelize.transaction();
    try {
      await user.destroy({ transaction });
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-auth-leave",
        content: `leave transaction error`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, err.message);
    }
    res.json({ answer: "leave success" });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-auth-leave";
      err.content = "leaveError";
      err.user = null;
    }
    next(err);
  }
};
const changeNick: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user as User;
    const { newNick } = req.body;
    const nickTester = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$/;
    if (!nickTester.test(newNick)) {
      const errorObj = {
        place: "controllers-auth-changeNick",
        content: `invalid newNick! newNick: ${newNick}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (newNick === user.nick) {
      const errorObj = {
        place: "controllers-auth-changeNick",
        content: `try changing to original!`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const now = Date.now();
    const oneWeekAgo = new Date(now - 86400000 * 7);
    const sendLogWeekAgo = await SendLog.findOne({
      where: {
        [Op.or]: [
          {
            sender: user.nick,
          },
          {
            receiver: user.nick,
          },
        ],
        createdAt: {
          [Op.gte]: oneWeekAgo,
        },
      },
    });
    if (sendLogWeekAgo) {
      const errorObj = {
        place: "controllers-auth-changeNick",
        content: "recent sendLog exist!",
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const nickExist = await User.findOne({ where: { nick: newNick } });
    if (nickExist) {
      return res.json({ answer: "nick exist" });
    }
    user.nick = newNick;
    const transaction = await sequelize.transaction();
    try {
      await user.save({ transaction });
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-auth-changeNick",
        content: `changeNick transaction error`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, err.message);
    }
    res.json({ answer: "changeNick success" });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-auth-changeNick";
      err.content = "changeNickError";
      err.user = null;
    }
    next(err);
  }
};
const changePassword: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user as User;
    const { newPassword } = req.body;
    const passwordTester =
      /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()._-]{6,16}$/;
    if (!passwordTester.test(newPassword)) {
      const errorObj = {
        place: "controllers-auth-changePassword",
        content: `invalid newPassword! newPassword: ${newPassword}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const hash = await bcrypt.hash(newPassword, 12);
    user.password = hash;
    const transaction = await sequelize.transaction();
    try {
      await user.save({ transaction });
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-auth-changePassword",
        content: `changePassword transaction error`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, err.message);
    }
    res.json({ answer: "changePassword success" });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-auth-changePassword";
      err.content = "changePasswordError";
      err.user = null;
    }
    next(err);
  }
};
export { checkLoginCode, join, login, leave, changeNick, changePassword };
