import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import { SendLog, User, sequelize } from "../models";
import {
  ReqError,
  MINER_MAX_AMOUNTS,
  MINER_MAX_LEVEL,
  LV1_MINER_CASH,
  LV1_MINER_COIN,
  getMinersTotalPerformance,
  testLoginInfo,
} from "./common";
import { managerIds } from "./manager";

const generateMiner: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user as User;
    const { amounts, type } = req.body;
    if (
      !Number.isInteger(amounts) ||
      amounts < 1 ||
      amounts > MINER_MAX_AMOUNTS
    ) {
      const errorObj = {
        place: "controllers-miner-generateMiner",
        content: `invalid amounts! amounts: ${amounts}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (!["cash", "coin"].includes(type)) {
      const errorObj = {
        place: "controllers-miner-generateMiner",
        content: `invalid type! type: ${type}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const neededCash = LV1_MINER_CASH * amounts;
    if (type === "cash" && user.cash < neededCash) {
      const errorObj = {
        place: "controllers-miner-generateMiner",
        content: `cash insufficient! neededCash: ${neededCash} / cash: ${user.cash}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const neededCoin = LV1_MINER_COIN * amounts;
    if (type === "coin" && user.coin < neededCoin) {
      const errorObj = {
        place: "controllers-miner-generateMiner",
        content: `coin insufficient! neededCoin: ${neededCoin} / coin: ${user.coin}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const lv1MinerAmounts = parseInt(
      user.minersArray[0],
      MINER_MAX_AMOUNTS + 1
    );
    const nextLv1MinerAmounts: number = lv1MinerAmounts + amounts;
    if (nextLv1MinerAmounts > MINER_MAX_AMOUNTS) {
      const errorObj = {
        place: "controllers-miner-generateMiner",
        content: `exceed max amounts! lv1MinerAmounts + amounts: ${nextLv1MinerAmounts}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const nextMinersArray = `${nextLv1MinerAmounts.toString(
      MINER_MAX_AMOUNTS + 1
    )}${user.minersArray.slice(1)}`;
    const nextMinersTotalPerformance =
      getMinersTotalPerformance(nextMinersArray);
    user.minersArray = nextMinersArray;
    user.minersTotalPerformance = nextMinersTotalPerformance;
    switch (type) {
      case "cash": {
        user.cash -= neededCash;
        break;
      }
      case "coin": {
        user.coin -= neededCoin;
        break;
      }
    }
    const transaction = await sequelize.transaction();
    try {
      await user.save({ transaction });
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-miner-generateMiner",
        content: `generateMiner transaction error`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, err.message);
    }
    res.json({ nextMinersArray, nextMinersTotalPerformance });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-miner-generateMiner";
      err.content = "generateMinerError";
      err.user = null;
    }
    next(err);
  }
};
const upgradeMiner: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user as User;
    const { level, amounts, type } = req.body;
    if (!Number.isInteger(level) || level < 1 || level >= MINER_MAX_LEVEL) {
      const errorObj = {
        place: "controllers-miner-upgradeMiner",
        content: `invalid level! level: ${level}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (!["normal", "safe"].includes(type)) {
      const errorObj = {
        place: "controllers-miner-upgradeMiner",
        content: `invalid type! type: ${type}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (
      !Number.isInteger(amounts) ||
      amounts < 1 ||
      (type === "normal" && amounts > MINER_MAX_AMOUNTS) ||
      (type === "safe" && amounts > MINER_MAX_AMOUNTS / 2)
    ) {
      const errorObj = {
        place: "controllers-miner-upgradeMiner",
        content: `invalid amounts! type: ${type} / amounts: ${amounts}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const targetLvMinerAmounts = parseInt(
      user.minersArray[level - 1],
      MINER_MAX_AMOUNTS + 1
    );
    const neededAmounts = type === "normal" ? amounts : 2 * amounts;
    if (neededAmounts > targetLvMinerAmounts) {
      const errorObj = {
        place: "controllers-miner-upgradeMiner",
        content: `miner insufficient! amounts: ${targetLvMinerAmounts} / neededAmounts: ${neededAmounts}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const targetNextLvMinerAmounts = parseInt(
      user.minersArray[level],
      MINER_MAX_AMOUNTS + 1
    );
    if (targetNextLvMinerAmounts + amounts > MINER_MAX_AMOUNTS) {
      const errorObj = {
        place: "controllers-miner-upgradeMiner",
        content: "can exceed max amounts!",
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    let success = 0;
    let fail = 0;
    for (let i = 0; i < amounts; i++) {
      if (type === "safe" || Math.random() < 0.5) {
        success++;
      } else {
        fail++;
      }
    }
    let nextMinersArray = user.minersArray;
    if (success) {
      nextMinersArray = `${nextMinersArray.slice(0, level)}${(
        targetNextLvMinerAmounts + success
      ).toString(MINER_MAX_AMOUNTS + 1)}${nextMinersArray.slice(level + 1)}`;
    }
    nextMinersArray = `${nextMinersArray.slice(0, level - 1)}${(
      targetLvMinerAmounts - neededAmounts
    ).toString(MINER_MAX_AMOUNTS + 1)}${nextMinersArray.slice(level)}`;
    const nextMinersTotalPerformance =
      getMinersTotalPerformance(nextMinersArray);
    user.minersArray = nextMinersArray;
    user.minersTotalPerformance = nextMinersTotalPerformance;
    const transaction = await sequelize.transaction();
    try {
      await user.save({ transaction });
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-miner-upgradeMiner",
        content: `upgradeMiner transaction error`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, err.message);
    }
    res.json({
      success,
      fail,
      nextMinersArray,
      nextMinersTotalPerformance,
    });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-miner-upgradeMiner";
      err.content = "upgradeMinerError";
      err.user = null;
    }
    next(err);
  }
};
const sendMiner: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user as User;
    const { level, amounts } = req.body;
    const receiverNick = `${req.body.receiverNick}`;
    if (!Number.isInteger(level) || level < 1 || level > MINER_MAX_LEVEL) {
      const errorObj = {
        place: "controllers-miner-sendMiner",
        content: `invalid level! level: ${level}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (
      !Number.isInteger(amounts) ||
      amounts < 1 ||
      amounts > MINER_MAX_AMOUNTS
    ) {
      const errorObj = {
        place: "controllers-miner-sendMiner",
        content: `invalid amounts! amounts: ${amounts}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const receiverNickTest = testLoginInfo("nick", receiverNick);
    if (!receiverNickTest) {
      const errorObj = {
        place: "controllers-miner-sendMiner",
        content: `invalid receiverNick! receiverNick: ${receiverNick}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    if (receiverNick === user.nick) {
      const errorObj = {
        place: "controllers-miner-sendMiner",
        content: "send to self is ban!",
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const targetLvMinerAmounts = parseInt(
      user.minersArray[level - 1],
      MINER_MAX_AMOUNTS + 1
    );
    const nextTargetLvMinerAmounts = targetLvMinerAmounts - amounts;
    if (nextTargetLvMinerAmounts < 0) {
      const errorObj = {
        place: "controllers-miner-sendMiner",
        content: `targetLvMinerAmounts insufficient! targetLvMinerAmounts: ${targetLvMinerAmounts} / neededAmounts: ${amounts}`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const lv1MinerAmounts = parseInt(
      user.minersArray[0],
      MINER_MAX_AMOUNTS + 1
    );
    if (
      (level === 1 && amounts + 1 > targetLvMinerAmounts) ||
      !lv1MinerAmounts
    ) {
      const errorObj = {
        place: "controllers-miner-sendMiner",
        content: `no lv1Miner for fee!`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, errorObj.content);
    }
    const receiver = await User.findOne({
      where: { nick: receiverNick, lockMemo: "" },
    });
    if (!receiver) {
      return res.json({ answer: "no receiver" });
    }
    const receiverTargetLvMinerAmounts = parseInt(
      receiver.minersArray[level - 1],
      MINER_MAX_AMOUNTS + 1
    );
    const nextReceiverTargetLvMinerAmounts =
      receiverTargetLvMinerAmounts + amounts;
    if (nextReceiverTargetLvMinerAmounts > MINER_MAX_AMOUNTS) {
      return res.json({
        receiver_max: MINER_MAX_AMOUNTS - receiverTargetLvMinerAmounts,
      });
    }
    let nextMinersArray = `${user.minersArray.slice(
      0,
      level - 1
    )}${nextTargetLvMinerAmounts.toString(
      MINER_MAX_AMOUNTS + 1
    )}${user.minersArray.slice(level)}`;
    nextMinersArray = `${(
      parseInt(nextMinersArray.slice(0, 1), MINER_MAX_AMOUNTS + 1) - 1
    ).toString(MINER_MAX_AMOUNTS + 1)}${nextMinersArray.slice(1)}`;
    const nextMinersTotalPerformance =
      getMinersTotalPerformance(nextMinersArray);
    const nextReceiverMinersArray = `${receiver.minersArray.slice(
      0,
      level - 1
    )}${nextReceiverTargetLvMinerAmounts.toString(
      MINER_MAX_AMOUNTS + 1
    )}${receiver.minersArray.slice(level)}`;
    const nextReceiverMinersTotalPerformance = getMinersTotalPerformance(
      nextReceiverMinersArray
    );
    user.minersArray = nextMinersArray;
    user.minersTotalPerformance = nextMinersTotalPerformance;
    receiver.minersArray = nextReceiverMinersArray;
    receiver.minersTotalPerformance = nextReceiverMinersTotalPerformance;
    const transaction = await sequelize.transaction();
    try {
      if (!managerIds.includes(user.loginId)) {
        await user.save({ transaction });
      }
      await receiver.save({ transaction });
      await SendLog.create({
        sender: user.nick,
        receiver: receiverNick,
        minerLevel: level,
        minerAmounts: amounts,
      });
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      const errorObj = {
        place: "controllers-miner-sendMiner",
        content: `sendMiner transaction error`,
        user: user.loginId,
      };
      throw new ReqError(errorObj, err.message);
    }
    res.json({
      nextMinersArray,
      nextMinersTotalPerformance,
    });
  } catch (err: any) {
    if (!err.place) {
      err.place = "controllers-miner-sendMiner";
      err.content = "sendMinerError";
      err.user = null;
    }
    next(err);
  }
};

export { generateMiner, upgradeMiner, sendMiner };
