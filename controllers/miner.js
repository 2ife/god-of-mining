"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMiner = exports.upgradeMiner = exports.generateMiner = void 0;
const models_1 = require("../models");
const common_1 = require("./common");
const manager_1 = require("./manager");
const generateMiner = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const { amounts, type } = req.body;
        if (!Number.isInteger(amounts) ||
            amounts < 1 ||
            amounts > common_1.MINER_MAX_AMOUNTS) {
            const errorObj = {
                place: "controllers-miner-generateMiner",
                content: `invalid amounts! amounts: ${amounts}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        if (!["cash", "coin"].includes(type)) {
            const errorObj = {
                place: "controllers-miner-generateMiner",
                content: `invalid type! type: ${type}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const neededCash = common_1.LV1_MINER_CASH * amounts;
        if (type === "cash" && user.cash < neededCash) {
            const errorObj = {
                place: "controllers-miner-generateMiner",
                content: `cash insufficient! neededCash: ${neededCash} / cash: ${user.cash}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const neededCoin = common_1.LV1_MINER_COIN * amounts;
        if (type === "coin" && user.coin < neededCoin) {
            const errorObj = {
                place: "controllers-miner-generateMiner",
                content: `coin insufficient! neededCoin: ${neededCoin} / coin: ${user.coin}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const lv1MinerAmounts = parseInt(user.minersArray[0], common_1.MINER_MAX_AMOUNTS + 1);
        const nextLv1MinerAmounts = lv1MinerAmounts + amounts;
        if (nextLv1MinerAmounts > common_1.MINER_MAX_AMOUNTS) {
            const errorObj = {
                place: "controllers-miner-generateMiner",
                content: `exceed max amounts! lv1MinerAmounts + amounts: ${nextLv1MinerAmounts}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const nextMinersArray = `${nextLv1MinerAmounts.toString(common_1.MINER_MAX_AMOUNTS + 1)}${user.minersArray.slice(1)}`;
        const nextMinersTotalPerformance = (0, common_1.getMinersTotalPerformance)(nextMinersArray);
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
        const transaction = await models_1.sequelize.transaction();
        try {
            await user.save({ transaction });
            await transaction.commit();
        }
        catch (err) {
            await transaction.rollback();
            const errorObj = {
                place: "controllers-miner-generateMiner",
                content: `generateMiner transaction error`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, err.message);
        }
        res.json({ nextMinersArray, nextMinersTotalPerformance });
    }
    catch (err) {
        if (!err.place) {
            err.place = "controllers-miner-generateMiner";
            err.content = "generateMinerError";
            err.user = null;
        }
        next(err);
    }
};
exports.generateMiner = generateMiner;
const upgradeMiner = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const { level, amounts, type } = req.body;
        if (!Number.isInteger(level) || level < 1 || level >= common_1.MINER_MAX_LEVEL) {
            const errorObj = {
                place: "controllers-miner-upgradeMiner",
                content: `invalid level! level: ${level}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        if (!["normal", "safe"].includes(type)) {
            const errorObj = {
                place: "controllers-miner-upgradeMiner",
                content: `invalid type! type: ${type}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        if (!Number.isInteger(amounts) ||
            amounts < 1 ||
            (type === "normal" && amounts > common_1.MINER_MAX_AMOUNTS) ||
            (type === "safe" && amounts > common_1.MINER_MAX_AMOUNTS / 2)) {
            const errorObj = {
                place: "controllers-miner-upgradeMiner",
                content: `invalid amounts! type: ${type} / amounts: ${amounts}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const targetLvMinerAmounts = parseInt(user.minersArray[level - 1], common_1.MINER_MAX_AMOUNTS + 1);
        const neededAmounts = type === "normal" ? amounts : 2 * amounts;
        if (neededAmounts > targetLvMinerAmounts) {
            const errorObj = {
                place: "controllers-miner-upgradeMiner",
                content: `miner insufficient! amounts: ${targetLvMinerAmounts} / neededAmounts: ${neededAmounts}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const targetNextLvMinerAmounts = parseInt(user.minersArray[level], common_1.MINER_MAX_AMOUNTS + 1);
        if (targetNextLvMinerAmounts + amounts > common_1.MINER_MAX_AMOUNTS) {
            const errorObj = {
                place: "controllers-miner-upgradeMiner",
                content: "can exceed max amounts!",
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        let success = 0;
        let fail = 0;
        for (let i = 0; i < amounts; i++) {
            if (type === "safe" || Math.random() < 0.5) {
                success++;
            }
            else {
                fail++;
            }
        }
        let nextMinersArray = user.minersArray;
        if (success) {
            nextMinersArray = `${nextMinersArray.slice(0, level)}${(targetNextLvMinerAmounts + success).toString(common_1.MINER_MAX_AMOUNTS + 1)}${nextMinersArray.slice(level + 1)}`;
        }
        nextMinersArray = `${nextMinersArray.slice(0, level - 1)}${(targetLvMinerAmounts - neededAmounts).toString(common_1.MINER_MAX_AMOUNTS + 1)}${nextMinersArray.slice(level)}`;
        const nextMinersTotalPerformance = (0, common_1.getMinersTotalPerformance)(nextMinersArray);
        user.minersArray = nextMinersArray;
        user.minersTotalPerformance = nextMinersTotalPerformance;
        const transaction = await models_1.sequelize.transaction();
        try {
            await user.save({ transaction });
            await transaction.commit();
        }
        catch (err) {
            await transaction.rollback();
            const errorObj = {
                place: "controllers-miner-upgradeMiner",
                content: `upgradeMiner transaction error`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, err.message);
        }
        res.json({
            success,
            fail,
            nextMinersArray,
            nextMinersTotalPerformance,
        });
    }
    catch (err) {
        if (!err.place) {
            err.place = "controllers-miner-upgradeMiner";
            err.content = "upgradeMinerError";
            err.user = null;
        }
        next(err);
    }
};
exports.upgradeMiner = upgradeMiner;
const sendMiner = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const { level, amounts } = req.body;
        const receiverNick = `${req.body.receiverNick}`;
        if (!Number.isInteger(level) || level < 1 || level > common_1.MINER_MAX_LEVEL) {
            const errorObj = {
                place: "controllers-miner-sendMiner",
                content: `invalid level! level: ${level}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        if (!Number.isInteger(amounts) ||
            amounts < 1 ||
            amounts > common_1.MINER_MAX_AMOUNTS) {
            const errorObj = {
                place: "controllers-miner-sendMiner",
                content: `invalid amounts! amounts: ${amounts}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const receiverNickTest = (0, common_1.testLoginInfo)("nick", receiverNick);
        if (!receiverNickTest) {
            const errorObj = {
                place: "controllers-miner-sendMiner",
                content: `invalid receiverNick! receiverNick: ${receiverNick}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        if (receiverNick === user.nick) {
            const errorObj = {
                place: "controllers-miner-sendMiner",
                content: "send to self is ban!",
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const targetLvMinerAmounts = parseInt(user.minersArray[level - 1], common_1.MINER_MAX_AMOUNTS + 1);
        const nextTargetLvMinerAmounts = targetLvMinerAmounts - amounts;
        if (nextTargetLvMinerAmounts < 0) {
            const errorObj = {
                place: "controllers-miner-sendMiner",
                content: `targetLvMinerAmounts insufficient! targetLvMinerAmounts: ${targetLvMinerAmounts} / neededAmounts: ${amounts}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const lv1MinerAmounts = parseInt(user.minersArray[0], common_1.MINER_MAX_AMOUNTS + 1);
        if ((level === 1 && amounts + 1 > targetLvMinerAmounts) ||
            !lv1MinerAmounts) {
            const errorObj = {
                place: "controllers-miner-sendMiner",
                content: `no lv1Miner for fee!`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const receiver = await models_1.User.findOne({
            where: { nick: receiverNick, lockMemo: "" },
        });
        if (!receiver) {
            return res.json({ answer: "no receiver" });
        }
        const receiverTargetLvMinerAmounts = parseInt(receiver.minersArray[level - 1], common_1.MINER_MAX_AMOUNTS + 1);
        const nextReceiverTargetLvMinerAmounts = receiverTargetLvMinerAmounts + amounts;
        if (nextReceiverTargetLvMinerAmounts > common_1.MINER_MAX_AMOUNTS) {
            return res.json({
                receiver_max: common_1.MINER_MAX_AMOUNTS - receiverTargetLvMinerAmounts,
            });
        }
        let nextMinersArray = `${user.minersArray.slice(0, level - 1)}${nextTargetLvMinerAmounts.toString(common_1.MINER_MAX_AMOUNTS + 1)}${user.minersArray.slice(level)}`;
        nextMinersArray = `${(parseInt(nextMinersArray.slice(0, 1), common_1.MINER_MAX_AMOUNTS + 1) - 1).toString(common_1.MINER_MAX_AMOUNTS + 1)}${nextMinersArray.slice(1)}`;
        const nextMinersTotalPerformance = (0, common_1.getMinersTotalPerformance)(nextMinersArray);
        const nextReceiverMinersArray = `${receiver.minersArray.slice(0, level - 1)}${nextReceiverTargetLvMinerAmounts.toString(common_1.MINER_MAX_AMOUNTS + 1)}${receiver.minersArray.slice(level)}`;
        const nextReceiverMinersTotalPerformance = (0, common_1.getMinersTotalPerformance)(nextReceiverMinersArray);
        user.minersArray = nextMinersArray;
        user.minersTotalPerformance = nextMinersTotalPerformance;
        receiver.minersArray = nextReceiverMinersArray;
        receiver.minersTotalPerformance = nextReceiverMinersTotalPerformance;
        const transaction = await models_1.sequelize.transaction();
        try {
            if (!manager_1.managerIds.includes(user.loginId)) {
                await user.save({ transaction });
            }
            await receiver.save({ transaction });
            await models_1.SendLog.create({
                sender: user.nick,
                receiver: receiverNick,
                minerLevel: level,
                minerAmounts: amounts,
            });
            await transaction.commit();
        }
        catch (err) {
            await transaction.rollback();
            const errorObj = {
                place: "controllers-miner-sendMiner",
                content: `sendMiner transaction error`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, err.message);
        }
        res.json({
            nextMinersArray,
            nextMinersTotalPerformance,
        });
    }
    catch (err) {
        if (!err.place) {
            err.place = "controllers-miner-sendMiner";
            err.content = "sendMinerError";
            err.user = null;
        }
        next(err);
    }
};
exports.sendMiner = sendMiner;
