type errorObj = {
  place: string;
  content: string;
  user?: string;
};
class ReqError extends Error {
  declare place: string;
  declare content: string;
  declare user: string | null;
  constructor(obj: errorObj, msg: any) {
    super(msg);
    this.place = obj.place;
    this.content = obj.content;
    this.user = obj.user ? obj.user : null;
  }
}
const MINER_MAX_AMOUNTS = 32;
const MINER_MAX_LEVEL = 30;
const LV1_MINER_CASH = 20;
const LV1_MINER_COIN = 4000;
const getMinersTotalPerformance = (minersArray: string) => {
  let minersTotalPerformance = 1;
  Array.from(minersArray).forEach((amountStr, index) => {
    const minerLevel = index + 1;
    const minerAmounts = parseInt(amountStr, MINER_MAX_AMOUNTS + 1);
    minersTotalPerformance += 2 ** (minerLevel - 1) * minerAmounts;
  });
  return minersTotalPerformance;
};
const getDateStr = (date: Date) => {
  const currentYear = date.getUTCFullYear();
  const currentMonth = date.getUTCMonth() + 1;
  const currentDate = date.getUTCDate();
  const dateStr = `${currentYear}${currentMonth
    .toString()
    .padStart(2, "0")}${currentDate.toString().padStart(2, "0")}`;
  return dateStr;
};
const testLoginInfo = (
  category: "nick" | "id" | "password" | "name" | "DOB" | "email",
  text: string
) => {
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
      if (
        text.length === 8 &&
        (Number(text.slice(0, 4)) > 1900 ||
          Number(text.slice(0, 4)) <= currentYear) &&
        (Number(text.slice(4, 6)) > 0 || Number(text.slice(4, 6)) < 13) &&
        (Number(text.slice(6)) > 0 || Number(text.slice(6)) < 32)
      ) {
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
export {
  ReqError,
  MINER_MAX_AMOUNTS,
  MINER_MAX_LEVEL,
  LV1_MINER_CASH,
  LV1_MINER_COIN,
  getMinersTotalPerformance,
  getDateStr,
  testLoginInfo,
};
