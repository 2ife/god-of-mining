import Sequelize from "sequelize";
import configObj from "../config/config";
import User from "./user";
import SendLog from "./sendLog";

const env = (process.env.NODE_ENV as "production" | "test") || "development";
const config = configObj[env];

export const sequelize = new Sequelize.Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

User.initiate(sequelize);
SendLog.initiate(sequelize);

User.associate();
SendLog.associate();

export { User, SendLog };
