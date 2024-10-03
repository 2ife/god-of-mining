"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testLoginInfo = exports.getDateStr = exports.getMinersTotalPerformance = exports.LV1_MINER_COIN = exports.LV1_MINER_CASH = exports.MINER_MAX_LEVEL = exports.MINER_MAX_AMOUNTS = exports.ReqError = void 0;
class ReqError extends Error {
    constructor(obj, msg) {
        super(msg);
        this.place = obj.place;
        this.content = obj.content;
        this.user = obj.user ? obj.user : null;
    }
}
exports.ReqError = ReqError;
const MINER_MAX_AMOUNTS = 32;
exports.MINER_MAX_AMOUNTS = MINER_MAX_AMOUNTS;
const MINER_MAX_LEVEL = 20;
exports.MINER_MAX_LEVEL = MINER_MAX_LEVEL;
const LV1_MINER_CASH = 1;
exports.LV1_MINER_CASH = LV1_MINER_CASH;
const LV1_MINER_COIN = 4000;
exports.LV1_MINER_COIN = LV1_MINER_COIN;
const getMinersTotalPerformance = (minersArray) => {
    let minersTotalPerformance = 1;
    Array.from(minersArray).forEach((amountStr, index) => {
        const minerLevel = index + 1;
        const minerAmounts = parseInt(amountStr, MINER_MAX_AMOUNTS + 1);
        minersTotalPerformance += 2 ** (minerLevel - 1) * minerAmounts;
    });
    return minersTotalPerformance;
};
exports.getMinersTotalPerformance = getMinersTotalPerformance;
const getDateStr = (date) => {
    const currentYear = date.getUTCFullYear();
    const currentMonth = date.getUTCMonth() + 1;
    const currentDate = date.getUTCDate();
    const dateStr = `${currentYear}${currentMonth
        .toString()
        .padStart(2, "0")}${currentDate.toString().padStart(2, "0")}`;
    return dateStr;
};
exports.getDateStr = getDateStr;
const testLoginInfo = (category, text) => {
    let tester = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$/;
    switch (category) {
        case "id": {
            tester = /^(?=.*[a-z0-9])[a-z0-9]{6,16}$/;
            break;
        }
        case "password": {
            tester = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()._-]{6,16}$/;
            break;
        }
        case "name": {
            tester = /^[a-zA-Z가-힣]{2,20}$/;
            break;
        }
        case "DOB": {
            const currentDate = new Date();
            const currentYear = currentDate.getUTCFullYear();
            if (text.length === 8 &&
                (Number(text.slice(0, 4)) > 1900 ||
                    Number(text.slice(0, 4)) <= currentYear) &&
                (Number(text.slice(4, 6)) > 0 || Number(text.slice(4, 6)) < 13) &&
                (Number(text.slice(6)) > 0 || Number(text.slice(6)) < 32)) {
                return true;
            }
            return false;
        }
        case "email": {
            if (text.length <= 35 && text.includes("@") && text.includes(".")) {
                return true;
            }
            return false;
        }
    }
    return tester.test(text);
};
exports.testLoginInfo = testLoginInfo;
