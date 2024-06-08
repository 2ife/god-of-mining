"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendLog = exports.User = exports.sequelize = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const config_1 = __importDefault(require("../config/config"));
const user_1 = __importDefault(require("./user"));
exports.User = user_1.default;
const sendLog_1 = __importDefault(require("./sendLog"));
exports.SendLog = sendLog_1.default;
const env = process.env.NODE_ENV || "development";
const config = config_1.default[env];
exports.sequelize = new sequelize_1.default.Sequelize(config.database, config.username, config.password, config);
user_1.default.initiate(exports.sequelize);
sendLog_1.default.initiate(exports.sequelize);
user_1.default.associate();
sendLog_1.default.associate();
