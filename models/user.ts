import Sequelize, {
  Model,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare nick: string;
  declare loginId: string;
  declare password: string;
  declare loginCode: string | null;
  declare minersArray: CreationOptional<string>; // 단계별 최대 32개 - fa901
  declare minersTotalPerformance: CreationOptional<number>;
  declare cash: CreationOptional<number>;
  declare coin: CreationOptional<number>;
  declare lastMineDate: string;
  declare lockMemo: CreationOptional<string>;
  declare name: string;
  declare dob: string;
  declare email: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initiate(sequelize: Sequelize.Sequelize) {
    User.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        nick: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        loginId: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        loginCode: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        minersArray: {
          type: Sequelize.STRING(100),
          allowNull: false,
          defaultValue: "00000000000000000000",
        },
        minersTotalPerformance: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 1,
        },
        cash: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        coin: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        lastMineDate: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        lockMemo: {
          type: Sequelize.STRING(100),
          allowNull: false,
          defaultValue: "",
        },
        name: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        dob: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(40),
          allowNull: false,
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate() {}
}
export default User;
