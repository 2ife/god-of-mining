import axios from "axios";

// html
const loginContainer = document.querySelector(
  "#loginContainer"
) as HTMLFormElement;
const loginContainer_loginIdInput = loginContainer.querySelector(
  "#loginContainer_loginIdInput"
) as HTMLInputElement;
const loginContainer_passwordInput = loginContainer.querySelector(
  "#loginContainer_passwordInput"
) as HTMLInputElement;
const loginBtn = loginContainer.querySelector("#loginBtn") as HTMLButtonElement;
const joinModeBtn = loginContainer.querySelector(
  "#joinModeBtn"
) as HTMLButtonElement;

const joinContainer = document.querySelector(
  "#joinContainer"
) as HTMLFormElement;
const joinContainer_nameInput = joinContainer.querySelector(
  "#joinContainer_nameInput"
) as HTMLInputElement;
const joinContainer_DOBInput = joinContainer.querySelector(
  "#joinContainer_DOBInput"
) as HTMLInputElement;
const joinContainer_nickInput = joinContainer.querySelector(
  "#joinContainer_nickInput"
) as HTMLInputElement;
const joinContainer_loginIdInput = joinContainer.querySelector(
  "#joinContainer_loginIdInput"
) as HTMLInputElement;
const joinContainer_passwordInput = joinContainer.querySelector(
  "#joinContainer_passwordInput"
) as HTMLInputElement;
const joinContainer_passwordCheckInput = joinContainer.querySelector(
  "#joinContainer_passwordCheckInput"
) as HTMLInputElement;
const joinContainer_emailInput = joinContainer.querySelector(
  "#joinContainer_emailInput"
) as HTMLInputElement;
const joinContainer_termsCheckbox = joinContainer.querySelector(
  "#joinContainer_termsCheckbox"
) as HTMLInputElement;
const joinBtn = joinContainer.querySelector("#joinBtn") as HTMLButtonElement;
const loginModeBtn = joinContainer.querySelector(
  "#loginModeBtn"
) as HTMLButtonElement;

const gamePart = document.querySelector("#gamePart") as HTMLDivElement;

const menuBtnContainer = gamePart.querySelector(
  "#menuBtnContainer"
) as HTMLDivElement;
const profileModalBtn = menuBtnContainer.querySelector(
  "#profileModalBtn"
) as HTMLButtonElement;
const sendLogModalBtn = menuBtnContainer.querySelector(
  "#sendLogModalBtn"
) as HTMLButtonElement;

const minersContainer = gamePart.querySelector(
  "#minersContainer"
) as HTMLDivElement;
const minerContainers = minersContainer.querySelectorAll(
  ".minerContainer"
) as NodeListOf<HTMLDivElement>;
const minerImgs = minersContainer.querySelectorAll(
  ".minerImg"
) as NodeListOf<HTMLImageElement>;
const minerCores = minersContainer.querySelectorAll(
  ".minerCore"
) as NodeListOf<HTMLDivElement>;
const minerAmountContainers = minersContainer.querySelectorAll(
  ".minerAmountContainer"
) as NodeListOf<HTMLDivElement>;
const minerContainer_btnContainers = minersContainer.querySelectorAll(
  ".minerContainer_btnContainer"
) as NodeListOf<HTMLDivElement>;
const minerUpgradeModalBtns = minersContainer.querySelectorAll(
  ".minerUpgradeModalBtn"
) as NodeListOf<HTMLDivElement>;
const minerSendModalBtns = minersContainer.querySelectorAll(
  ".minerSendModalBtn"
) as NodeListOf<HTMLDivElement>;

const minerGenerateBtnContainer = gamePart.querySelector(
  "#minerGenerateBtnContainer"
) as HTMLDivElement;
const minerGeneraterByCash_amountInput =
  minerGenerateBtnContainer.querySelector(
    "#minerGeneraterByCash_amountInput"
  ) as HTMLInputElement;
const minerGeneraterByCash_minerGenerateBtn =
  minerGenerateBtnContainer.querySelector(
    "#minerGeneraterByCash_minerGenerateBtn"
  ) as HTMLButtonElement;
const minerGeneraterByCoin_amountInput =
  minerGenerateBtnContainer.querySelector(
    "#minerGeneraterByCoin_amountInput"
  ) as HTMLInputElement;
const minerGeneraterByCoin_minerGenerateBtn =
  minerGenerateBtnContainer.querySelector(
    "#minerGeneraterByCoin_minerGenerateBtn"
  ) as HTMLButtonElement;

const cashCoinContainer = gamePart.querySelector(
  "#cashCoinContainer"
) as HTMLDivElement;
const cashContainer = cashCoinContainer.querySelector(
  "#cashContainer"
) as HTMLDivElement;
const coinContainer = cashCoinContainer.querySelector(
  "#coinContainer"
) as HTMLDivElement;

const minersPerformanceContainer = gamePart.querySelector(
  "#minersPerformanceContainer"
) as HTMLDivElement;

const out_profileModal = document.querySelector(
  "#out_profileModal"
) as HTMLDivElement;
const profileModal = document.querySelector("#profileModal") as HTMLDivElement;
const profileModal_closeBtn = profileModal.querySelector(
  ".modal_closeBtn"
) as HTMLButtonElement;
const profileModal_contentContainer = profileModal.querySelector(
  ".modal_contentContainer"
) as HTMLDivElement;
const profileModal_nickInput = profileModal.querySelector(
  "#profileModal_nickInput"
) as HTMLInputElement;
const profileModal_nickChangeBtn = profileModal.querySelector(
  "#profileModal_nickChangeBtn"
) as HTMLButtonElement;
const profileModal_loginIdInput = profileModal.querySelector(
  "#profileModal_loginIdInput"
) as HTMLInputElement;
const logoutBtn = profileModal.querySelector("#logoutBtn") as HTMLButtonElement;
const profileModal_passwordInput = profileModal.querySelector(
  "#profileModal_passwordInput"
) as HTMLInputElement;
const profileModal_passwordChangeBtn = profileModal.querySelector(
  "#profileModal_passwordChangeBtn"
) as HTMLButtonElement;
const leaveBtn = profileModal.querySelector("#leaveBtn") as HTMLButtonElement;
const tutorialLink = profileModal.querySelector(
  "#tutorialLink"
) as HTMLAnchorElement;

const out_sendLogModal = document.querySelector(
  "#out_sendLogModal"
) as HTMLDivElement;
const sendLogModal = document.querySelector("#sendLogModal") as HTMLDivElement;
const sendLogModal_closeBtn = sendLogModal.querySelector(
  ".modal_closeBtn"
) as HTMLButtonElement;
const sendLogModal_contentContainer = sendLogModal.querySelector(
  ".modal_contentContainer"
) as HTMLDivElement;
const sendLogList = sendLogModal.querySelector(
  "#sendLogList"
) as HTMLDivElement;

const out_minerUpgradeModal = document.querySelector(
  "#out_minerUpgradeModal"
) as HTMLDivElement;
const minerUpgradeModal = document.querySelector(
  "#minerUpgradeModal"
) as HTMLDivElement;
const minerUpgradeModal_closeBtn = minerUpgradeModal.querySelector(
  ".modal_closeBtn"
) as HTMLButtonElement;
const minerUpgradeModal_contentContainer = minerUpgradeModal.querySelector(
  ".modal_contentContainer"
) as HTMLDivElement;
const minerUpgradeModal_title = minerUpgradeModal.querySelector(
  "#minerUpgradeModal_title"
) as HTMLDivElement;
const normalUpgradeContainer_amountInput = minerUpgradeModal.querySelector(
  "#normalUpgradeContainer_amountInput"
) as HTMLInputElement;
const normalUpgradeContainer_upgradeBtn = minerUpgradeModal.querySelector(
  "#normalUpgradeContainer_upgradeBtn"
) as HTMLButtonElement;
const safeUpgradeContainer_amountInput = minerUpgradeModal.querySelector(
  "#safeUpgradeContainer_amountInput"
) as HTMLInputElement;
const safeUpgradeContainer_minerUpgradeBtn = minerUpgradeModal.querySelector(
  "#safeUpgradeContainer_minerUpgradeBtn"
) as HTMLButtonElement;

const out_minerSendModal = document.querySelector(
  "#out_minerSendModal"
) as HTMLDivElement;
const minerSendModal = document.querySelector(
  "#minerSendModal"
) as HTMLDivElement;
const minerSendModal_closeBtn = minerSendModal.querySelector(
  ".modal_closeBtn"
) as HTMLButtonElement;
const minerSendModal_contentContainer = minerSendModal.querySelector(
  ".modal_contentContainer"
) as HTMLDivElement;
const minerSendModal_title = minerSendModal.querySelector(
  "#minerSendModal_title"
) as HTMLDivElement;
const minerSendModal_receiverInput = minerSendModal.querySelector(
  "#minerSendModal_receiverInput"
) as HTMLInputElement;
const minerSendModal_amountInput = minerSendModal.querySelector(
  "#minerSendModal_amountInput"
) as HTMLInputElement;
const minerSendBtn = minerSendModal.querySelector(
  "#minerSendBtn"
) as HTMLButtonElement;

const out_alertModal = document.querySelector(
  "#out_alertModal"
) as HTMLDivElement;
const alertModal = document.querySelector("#alertModal") as HTMLDivElement;
const alertModal_closeBtn = alertModal.querySelector(
  ".modal_closeBtn"
) as HTMLButtonElement;
const alertModal_contentContainer = alertModal.querySelector(
  ".modal_contentContainer"
) as HTMLDivElement;

const out_loadingModal = document.querySelector(
  "#out_loadingModal"
) as HTMLDivElement;
const loadingModal = document.querySelector("#loadingModal") as HTMLDivElement;

// variable
const MINER_MAX_AMOUNTS = 32;
const MINER_MAX_LEVEL = 20;
const LV1_MINER_CASH = 1;
const LV1_MINER_COIN = 4000;
let loadInterval: any = null;
let reload = false;
// let minersWorkInterval: any = null;
let user = {
  nick: "",
  loginId: "",
  minersArray: "000000000000000000000000000000",
  minersTotalPerformance: 0,
  cash: 0,
  coin: 0,
};
let sendLogs: {
  sender: string;
  receiver: string;
  minerLevel: number;
  minerAmounts: number;
  time: number;
}[] = [];
const targetMiner = { level: 0, amounts: 0 };

// func - change variable
const updateUserProfile = (nick: string, loginId: string) => {
  user.nick = nick;
  user.loginId = loginId;
  profileModal_nickInput.value = nick;
  profileModal_loginIdInput.value = loginId;
};

const updateMiners = (
  nextMinersArray: string,
  nextMinersTotalPerformance: number
) => {
  // if (minersWorkInterval) {
  //   clearInterval(minersWorkInterval);
  //   minersWorkInterval = null;
  // }
  user.minersArray = nextMinersArray;
  user.minersTotalPerformance = nextMinersTotalPerformance;
  Array.from(nextMinersArray).forEach((amountStr, index) => {
    const minerAmounts = parseInt(amountStr, MINER_MAX_AMOUNTS + 1);
    minerAmountContainers[index].innerText = `${minerAmounts}`;
    if (minerAmounts) {
      minerCores[index].style.backgroundColor = `rgb(${
        190 - index * 10
      },255,255)`;
    } else {
      minerCores[index].style.backgroundColor = "rgba(0,0,0,0)";
    }
  });
  minersPerformanceContainer.innerText = `출석 보상 (${nextMinersTotalPerformance.toLocaleString(
    "ko-KR"
  )}◇)`;

  // let i = 0;
  // minersWorkInterval = setInterval(() => {
  //   Array.from(user.minersArray).forEach((amountStr, index) => {
  //     const amounts = parseInt(amountStr, 33);
  //     if (amounts) {
  //       minerImgs[index].style.transform = `rotate( ${(10 * i) % 360}deg )`;
  //     }
  //   });
  //   i++;
  // }, 50);
};

const changeCoin = (coinChange: number) => {
  user.coin += coinChange;
  coinContainer.innerText = `◇ ${user.coin.toLocaleString("ko-KR")}`;
};

const changeCash = (cashChange: number) => {
  user.cash += cashChange;
  cashContainer.innerText = `◆ ${user.cash.toLocaleString("ko-KR")}`;
};

const getSendLogs = (
  nextSendLogs: {
    sender: string;
    receiver: string;
    minerLevel: number;
    minerAmounts: number;
    time: number;
  }[]
) => {
  sendLogs = nextSendLogs;
  nextSendLogs.forEach((log) => {
    const { sender, receiver, minerLevel, minerAmounts, time } = log;
    sendLogList.innerHTML += `<br><br>발송인: ${sender}<br>수령인: ${receiver}<br>창조자 레벨: ${minerLevel}<br>창조자 수량: ${minerAmounts}<br>${new Date(
      time
    ).toLocaleString("ko-KR")}`;
  });
};
const setTargetMiner = (index: number) => {
  const minerLevel = index + 1;
  const minerAmounts = parseInt(user.minersArray[index], MINER_MAX_AMOUNTS + 1);
  targetMiner.level = minerLevel;
  targetMiner.amounts = minerAmounts;
  minerUpgradeModal_title.innerText = `LV${minerLevel} 창조자 진화`;
  normalUpgradeContainer_amountInput.placeholder = !minerAmounts
    ? "창조자 없음"
    : minerAmounts === 1
    ? "1"
    : `1~${minerAmounts}`;
  safeUpgradeContainer_amountInput.placeholder =
    minerAmounts < 2
      ? "창조자 부족"
      : minerAmounts === 2
      ? "1"
      : `1~${Math.floor(minerAmounts / 2)}`;
  minerSendModal_title.innerText = `LV${minerLevel} 창조자 워프`;
  minerSendModal_amountInput.placeholder = !minerAmounts
    ? "창조자 없음"
    : minerAmounts === 1
    ? "1"
    : `1~${minerAmounts}`;
};

// func - inner func
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
const processError = () => {
  stopLoading();
  reload = true;
  alertByModal("오류가 발생하여 재접속합니다!");
};

// func - auth
const checkLoginCode = async () => {
  try {
    const loginCode = localStorage.getItem("LOGIN_CODE");
    if (!loginCode) {
      loginContainer.style.display = "";
      return;
    }
    showLoading();
    const res = await axios.post("/auth/checkLoginCode", {
      loginCode,
    });
    const { data } = res;
    const { answer } = data;
    if (answer === "error") {
      throw new Error();
    }
    stopLoading();
    if (answer === "no user") {
      localStorage.removeItem("LOGIN_CODE");
      loginContainer.style.display = "";
      return;
    }
    const { newLoginCode, userData, sendLogsData, mine } = data;
    localStorage.setItem("LOGIN_CODE", newLoginCode);
    updateUserProfile(userData.nick, userData.loginId);
    updateMiners(userData.minersArray, userData.minersTotalPerformance);
    changeCoin(userData.coin);
    changeCash(userData.cash);
    getSendLogs(sendLogsData);
    gamePart.style.display = "";
    if (mine) {
      alertByModal(
        `${user.minersTotalPerformance.toLocaleString("ko-KR")}◇ 획득!`
      );
    }
  } catch (err) {
    localStorage.removeItem("LOGIN_CODE");
    processError();
  }
};

const login = async (event: MouseEvent) => {
  event.preventDefault();
  try {
    if (loadInterval) {
      return;
    }
    const id = loginContainer_loginIdInput.value;
    const password = loginContainer_passwordInput.value;
    const loginFailMessage =
      "해당 아이디가 존재하지 않거나, 비밀번호가 일치하지 않습니다.";
    const idTest = testLoginInfo("id", id);
    const passwordTest = testLoginInfo("password", password);
    if (!idTest || !passwordTest) {
      return alertByModal(loginFailMessage);
    }
    showLoading();
    const res = await axios.post("/auth/login", { loginId: id, password });
    const { data } = res;
    const { answer } = data;
    if (answer === "error") {
      throw new Error();
    }
    stopLoading();
    if (answer === "no user") {
      alertByModal(loginFailMessage);
    } else if (answer === "lock") {
      alertByModalByHTML(
        "정지된 ID입니다!<br><br><a href='https://cafe.naver.com/godofmining/3'>정지 사유 문의</a>"
      );
    }
    const { newLoginCode, userData, sendLogsData, mine } = data;
    localStorage.setItem("LOGIN_CODE", newLoginCode);
    updateUserProfile(userData.nick, userData.loginId);
    updateMiners(userData.minersArray, userData.minersTotalPerformance);
    changeCoin(userData.coin);
    changeCash(userData.cash);
    getSendLogs(sendLogsData);
    loginContainer.style.display = "none";
    joinContainer.style.display = "none";
    gamePart.style.display = "";
    if (mine) {
      alertByModal(
        `${user.minersTotalPerformance.toLocaleString("ko-KR")}◇ 획득!`
      );
    }
  } catch (err) {
    processError();
  }
};

const join = async (event: MouseEvent) => {
  event.preventDefault();
  try {
    if (loadInterval) {
      return;
    }
    const name = joinContainer_nameInput.value;
    const DOB = joinContainer_DOBInput.value;
    const nick = joinContainer_nickInput.value;
    const id = joinContainer_loginIdInput.value;
    const password = joinContainer_passwordInput.value;
    const passwordCheck = joinContainer_passwordCheckInput.value;
    const email = joinContainer_emailInput.value;
    const termsAgree = joinContainer_termsCheckbox.checked;
    const nameTest = testLoginInfo("name", name);
    const DOBTest = testLoginInfo("DOB", DOB);
    const nickTest = testLoginInfo("nick", nick);
    const idTest = testLoginInfo("id", id);
    const passwordTest = testLoginInfo("password", password);
    const emailTest = testLoginInfo("email", email);
    if (
      !nameTest ||
      !DOBTest ||
      !nickTest ||
      !idTest ||
      !passwordTest ||
      !emailTest ||
      password !== passwordCheck ||
      !termsAgree
    ) {
      return alertByModal(
        `해당 부분들을 다시 확인해주세요.
        ${!nameTest ? "\n•이름" : ""}${!DOBTest ? "\n•생년월일" : ""}${
          !emailTest ? "\n•이메일" : ""
        }${!nickTest ? "\n•닉네임: 영어 소문자, 한글, 숫자 (2~8자)" : ""}${
          !idTest ? "\n•ID: 영어 소문자, 숫자 (6~16자)" : ""
        }${
          !passwordTest
            ? "\n•비밀번호: 영어 대소문자, 숫자, 허용된 특수문자(!@#$%^&*()._-) (6~16자)"
            : ""
        }${
          password !== passwordCheck
            ? "\n•비밀번호 확인: 비밀번호와 일치해야함"
            : ""
        }${!termsAgree ? "\n•약관 동의 필요" : ""}`
      );
    }
    showLoading();
    const res = await axios.post("/auth/join", {
      name,
      DOB,
      nick,
      loginId: id,
      password,
      email,
    });
    const { data } = res;
    const { answer, nickExist, idExist } = data;
    if (answer === "error") {
      throw new Error();
    }
    stopLoading();
    if (answer === "join success") {
      loginContainer_loginIdInput.value = id;
      loginContainer_passwordInput.value = password;
      loginBtn.click();
    }
    if (nickExist || idExist) {
      return alertByModal(
        `해당 ${
          nickExist && idExist
            ? "닉네임과 ID가"
            : nickExist
            ? "닉네임이"
            : "ID가"
        } 존재합니다`
      );
    }
  } catch (err) {
    processError();
  }
};

const switchBetweenLoginAndJoin = (to: "login" | "join") => {
  switch (to) {
    case "login": {
      loginContainer.style.display = "";
      joinContainer.style.display = "none";
      break;
    }
    case "join": {
      loginContainer.style.display = "none";
      joinContainer.style.display = "";
      break;
    }
  }
};

// func - gamePart
const openOrCloseModal = (
  type: "profile" | "sendLog" | "minerUpgrade" | "minerSend" | "alert",
  action: "open" | "close"
) => {
  if (loadInterval) return;
  let modal;
  let out_modal;
  switch (type) {
    case "profile": {
      modal = profileModal;
      out_modal = out_profileModal;
      break;
    }
    case "sendLog": {
      modal = sendLogModal;
      out_modal = out_sendLogModal;
      break;
    }
    case "minerUpgrade": {
      modal = minerUpgradeModal;
      out_modal = out_minerUpgradeModal;
      normalUpgradeContainer_amountInput.value = "";
      safeUpgradeContainer_amountInput.value = "";
      break;
    }
    case "minerSend": {
      modal = minerSendModal;
      out_modal = out_minerSendModal;
      minerSendModal_receiverInput.value = "";
      minerSendModal_amountInput.value = "";
      break;
    }
    case "alert": {
      modal = alertModal;
      out_modal = out_alertModal;
      break;
    }
  }
  modal.style.display = action === "open" ? "" : "none";
  out_modal.style.display = action === "open" ? "" : "none";
};

const clickMinerContainer = (index: number) => {
  if (loadInterval) return;
  minerContainer_btnContainers.forEach((btnContainer) => {
    if (btnContainer.style.display !== "none") {
      btnContainer.style.display = "none";
    }
  });
  const targetBtnContainer = minerContainer_btnContainers[index];
  targetBtnContainer.style.display = "";
  setTargetMiner(index);
};

const generateMiner = async (type: "cash" | "coin") => {
  try {
    if (loadInterval) return;
    const amountInput =
      type === "cash"
        ? minerGeneraterByCash_amountInput
        : minerGeneraterByCoin_amountInput;
    const lv1MinerAmounts = parseInt(
      user.minersArray[0],
      MINER_MAX_AMOUNTS + 1
    );
    if (lv1MinerAmounts === 32) {
      return alertByModal(
        "각 단계별 창조자는 최대 32기까지만 보유 가능합니다."
      );
    }
    const generateAmounts = Number(amountInput.value);
    if (
      !Number.isInteger(generateAmounts) ||
      generateAmounts < 1 ||
      generateAmounts > 32 - lv1MinerAmounts
    ) {
      return alertByModal(
        `현재 Lv1 창조자 소환 가능: 1~${32 - lv1MinerAmounts}`
      );
    }
    if (type === "cash" && user.cash < generateAmounts * LV1_MINER_CASH) {
      return alertByModal(
        `◆ 부족! (필요 ◆: ${(generateAmounts * LV1_MINER_CASH).toLocaleString(
          "ko-KR"
        )})`
      );
    } else if (
      type === "coin" &&
      user.coin < generateAmounts * LV1_MINER_COIN
    ) {
      return alertByModal(
        `◇ 부족! (필요 ◇: ${(generateAmounts * LV1_MINER_COIN).toLocaleString(
          "ko-KR"
        )})`
      );
    }
    showLoading();
    const loginCode = localStorage.getItem("LOGIN_CODE");
    const res = await axios.post("/miner/generateMiner", {
      loginCode,
      type,
      amounts: generateAmounts,
    });
    const { data } = res;
    const { answer, nextMinersArray, nextMinersTotalPerformance } = data;
    if (answer === "error") {
      throw new Error();
    }
    stopLoading();
    updateMiners(nextMinersArray, nextMinersTotalPerformance);
    switch (type) {
      case "cash": {
        changeCash(-generateAmounts * LV1_MINER_CASH);
        break;
      }
      case "coin": {
        changeCoin(-generateAmounts * LV1_MINER_COIN);
        break;
      }
    }
    amountInput.value = "";
    alertByModal(`Lv1 창조자 ${generateAmounts}기 소환 완료`);
  } catch (err) {
    processError();
  }
};

// func - profile
const changeNick = async () => {
  try {
    if (loadInterval) return;
    const nick = profileModal_nickInput.value;
    const nickTest = testLoginInfo("nick", nick);
    if (!nickTest) {
      return alertByModal(
        "닉네임은 영어 소문자, 한글, 숫자로 구성된 2~8자로만 변경 가능합니다."
      );
    }
    if (nick === user.nick) {
      return alertByModal("현재 사용 중인 닉네임입니다.");
    }
    if (sendLogs.length) {
      return alertByModal(
        "1주일 이내에 워프하거나 워프 받은 기록이 있으면, 닉네임 변경이 불가능합니다."
      );
    }
    showLoading();
    const loginCode = localStorage.getItem("LOGIN_CODE");
    const res = await axios.post("/auth/changeNick", {
      loginCode,
      newNick: nick,
    });
    const { data } = res;
    const { answer } = data;
    if (answer === "error") {
      throw new Error();
    }
    stopLoading();
    if (answer === "nick exist") {
      return alertByModal("이미 존재하는 닉네임입니다.");
    }
    updateUserProfile(nick, user.loginId);
    alertByModal("닉네임 변경 완료!");
  } catch (err) {
    processError();
  }
};
const changePassword = async () => {
  try {
    if (loadInterval) return;
    const password = profileModal_passwordInput.value;
    const passwordTest = testLoginInfo("password", password);
    if (!passwordTest) {
      return alertByModal(
        "비밀번호는 영어 대소문자, 숫자, 허용된 특수문자(!@#$%^&*()._-)로 구성된 6~16자로만 변경 가능합니다."
      );
    }
    showLoading();
    const loginCode = localStorage.getItem("LOGIN_CODE");
    const res = await axios.post("/auth/changePassword", {
      loginCode,
      newPassword: password,
    });
    const { data } = res;
    const { answer } = data;
    if (answer === "error") {
      throw new Error();
    }
    stopLoading();
    alertByModal("비밀번호 변경 완료!");
  } catch (err) {
    processError();
  }
};
const leave = async () => {
  try {
    if (loadInterval) return;
    const password = profileModal_passwordInput.value;
    const passwordTest = testLoginInfo("password", password);
    const passwordWrongMessage =
      "비밀번호 란에 비밀번호를 입력해주시길 바랍니다.\n\n탈퇴한 회원 정보는 복구할 수 없으니, 이 점 주의 바랍니다.";
    if (!passwordTest) {
      return alertByModal(passwordWrongMessage);
    }
    showLoading();
    const loginCode = localStorage.getItem("LOGIN_CODE");
    const res = await axios.post("/auth/leave", {
      loginCode,
      password,
    });
    const { data } = res;
    const { answer } = data;
    if (answer === "error") {
      throw new Error();
    }
    stopLoading();
    if (answer === "no user") {
      return alertByModal(passwordWrongMessage);
    }
    localStorage.removeItem("LOGIN_CODE");
    reload = true;
    alertByModal("회원 탈퇴 완료!");
  } catch (err) {
    processError();
  }
};

// func - minerUpgrade
const upgradeMiner = async (type: "normal" | "safe") => {
  try {
    if (loadInterval) return;
    let amountInput = normalUpgradeContainer_amountInput;
    let maxAmounts = targetMiner.amounts;
    if (type === "safe") {
      amountInput = safeUpgradeContainer_amountInput;
      maxAmounts = Math.floor(targetMiner.amounts / 2);
    }
    if (!maxAmounts) {
      return alertByModal("창조자 부족");
    }
    const upgradeAmounts = Number(amountInput.value);
    const nextLvMinerAmounts = parseInt(
      user.minersArray[targetMiner.level],
      MINER_MAX_AMOUNTS + 1
    );
    if (
      !Number.isInteger(upgradeAmounts) ||
      upgradeAmounts < 1 ||
      upgradeAmounts > maxAmounts ||
      upgradeAmounts + nextLvMinerAmounts > MINER_MAX_AMOUNTS
    ) {
      return alertByModal(
        `최대 ${
          upgradeAmounts + nextLvMinerAmounts > MINER_MAX_AMOUNTS
            ? MINER_MAX_AMOUNTS - nextLvMinerAmounts
            : maxAmounts
        }기 진화 가능`
      );
    }

    showLoading();
    const loginCode = localStorage.getItem("LOGIN_CODE");
    const res = await axios.post("/miner/upgradeMiner", {
      loginCode,
      level: targetMiner.level,
      amounts: upgradeAmounts,
      type,
    });
    const { data } = res;
    const {
      answer,
      success,
      fail,
      nextMinersArray,
      nextMinersTotalPerformance,
    } = data;
    if (answer === "error") {
      throw new Error();
    }
    stopLoading();
    updateMiners(nextMinersArray, nextMinersTotalPerformance);
    minerUpgradeModal_closeBtn.click();
    alertByModal(`창조자 진화\n\n성공: ${success}\n실패: ${fail}`);
  } catch (err) {
    processError();
  }
};

// func - minerSend
const sendMiner = async () => {
  try {
    if (loadInterval) return;
    const receiverNick = minerSendModal_receiverInput.value;
    const receiverNickTest = testLoginInfo("nick", receiverNick);
    if (!receiverNickTest || receiverNick === user.nick) {
      return alertByModal("유효하지 않은 닉네임입니다.");
    }
    const lv1MinerAmounts = parseInt(
      user.minersArray[0],
      MINER_MAX_AMOUNTS + 1
    );
    if (!lv1MinerAmounts) {
      return alertByModal("Lv1 창조자 1기 필요");
    }
    const sendAmounts = Number(minerSendModal_amountInput.value);
    const maxAmounts =
      targetMiner.level === 1 ? targetMiner.amounts - 1 : targetMiner.amounts;
    if (
      !Number.isInteger(sendAmounts) ||
      sendAmounts < 1 ||
      sendAmounts > maxAmounts
    ) {
      return alertByModal(`최대 ${maxAmounts}기 워프 가능`);
    }

    showLoading();
    const loginCode = localStorage.getItem("LOGIN_CODE");
    const res = await axios.post("/miner/sendMiner", {
      loginCode,
      level: targetMiner.level,
      amounts: sendAmounts,
      receiverNick,
    });
    const { data } = res;
    const {
      answer,
      receiver_max,
      nextMinersArray,
      nextMinersTotalPerformance,
    } = data;
    if (answer === "error") {
      throw new Error();
    }
    stopLoading();
    if (answer === "no receiver") {
      return alertByModal("해당 닉네임을 가진 유저가 없습니다.");
    }
    if (receiver_max === 0 || receiver_max) {
      return alertByModal(
        `현재 해당 유저에게 LV${targetMiner.level} 창조자는 최대 ${receiver_max}기까지만 워프 가능합니다.`
      );
    }
    const now = Date.now();
    sendLogs.push({
      sender: user.nick,
      receiver: receiverNick,
      minerLevel: targetMiner.level,
      minerAmounts: sendAmounts,
      time: now,
    });
    sendLogList.innerHTML = `${sendLogList.innerHTML.slice(
      0,
      sendLogList.innerHTML.indexOf("워프 기록\n") + 6
    )}<br><br>발송인: ${user.nick}<br>수령인: ${receiverNick}<br>창조자 단계: ${
      targetMiner.level
    }<br>창조자 수량: ${sendAmounts}<br>${new Date(now).toLocaleString(
      "ko-KR"
    )}${sendLogList.innerHTML.slice(
      sendLogList.innerHTML.indexOf("워프 기록\n") + 6
    )}`;
    updateMiners(nextMinersArray, nextMinersTotalPerformance);
    minerSendModal_closeBtn.click();
    alertByModal("창조자 워프 완료!");
  } catch (err) {
    processError();
  }
};

// func - etc
const alertByModal = (msg: string) => {
  alertModal_contentContainer.innerText = msg;
  openOrCloseModal("alert", "open");
};

const alertByModalByHTML = (html: string) => {
  alertModal_contentContainer.innerHTML = html;
  openOrCloseModal("alert", "open");
};

const showLoading = () => {
  loadingModal.style.display = "";
  out_loadingModal.style.display = "";
  loadInterval = setInterval(() => {
    loadingModal.innerText =
      loadingModal.innerText === "로딩 중..."
        ? "로딩 중."
        : loadingModal.innerText + ".";
  }, 100);
};

const stopLoading = () => {
  loadingModal.style.display = "none";
  out_loadingModal.style.display = "none";
  clearInterval(loadInterval);
  loadInterval = null;
};

const reloadPage = () => {
  if (reload) {
    return location.reload();
  }
};

// eventListener
loginBtn.onclick = login;
joinModeBtn.onclick = (event: MouseEvent) => {
  event.preventDefault();
  switchBetweenLoginAndJoin("join");
};
joinBtn.onclick = join;
loginModeBtn.onclick = (event: MouseEvent) => {
  event.preventDefault();
  switchBetweenLoginAndJoin("login");
};
profileModalBtn.onclick = () => openOrCloseModal("profile", "open");
sendLogModalBtn.onclick = () => openOrCloseModal("sendLog", "open");
minerContainers.forEach((minerContainer, index) => {
  minerContainer.onclick = () => clickMinerContainer(index);
});
minerUpgradeModalBtns.forEach((minerUpgradeModalBtn) => {
  minerUpgradeModalBtn.onclick = (event: MouseEvent) => {
    event.stopPropagation();
    const btnContainer = minerUpgradeModalBtn.parentNode as HTMLDivElement;
    btnContainer.style.display = "none";
    openOrCloseModal("minerUpgrade", "open");
  };
});
minerSendModalBtns.forEach((minerSendModalBtn) => {
  minerSendModalBtn.onclick = (event: MouseEvent) => {
    event.stopPropagation();
    const btnContainer = minerSendModalBtn.parentNode as HTMLDivElement;
    btnContainer.style.display = "none";
    openOrCloseModal("minerSend", "open");
  };
});
minerGeneraterByCash_minerGenerateBtn.onclick = () => generateMiner("cash");
minerGeneraterByCoin_minerGenerateBtn.onclick = () => generateMiner("coin");

profileModal_closeBtn.onclick = () => openOrCloseModal("profile", "close");
profileModal_nickChangeBtn.onclick = changeNick;
logoutBtn.onclick = () => {
  localStorage.removeItem("LOGIN_CODE");
  location.reload();
};
profileModal_passwordChangeBtn.onclick = changePassword;
leaveBtn.onclick = leave;

sendLogModal_closeBtn.onclick = () => openOrCloseModal("sendLog", "close");

minerUpgradeModal_closeBtn.onclick = () =>
  openOrCloseModal("minerUpgrade", "close");
normalUpgradeContainer_upgradeBtn.onclick = () => upgradeMiner("normal");
safeUpgradeContainer_minerUpgradeBtn.onclick = () => upgradeMiner("safe");

minerSendModal_closeBtn.onclick = () => openOrCloseModal("minerSend", "close");
minerSendBtn.onclick = sendMiner;

alertModal_closeBtn.onclick = () => openOrCloseModal("alert", "close");

document.onclick = reloadPage;
window.onkeydown = reloadPage;

// start
window.onload = checkLoginCode;
