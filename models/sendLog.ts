import Sequelize, {
  Model,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

class SendLog extends Model<
  InferAttributes<SendLog>,
  InferCreationAttributes<SendLog>
> {
  declare id: CreationOptional<number>;
  declare sender: string;
  declare receiver: string;
  declare minerLevel: number;
  declare minerAmounts: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initiate(sequelize: Sequelize.Sequelize) {
    SendLog.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        sender: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        receiver: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        minerLevel: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        minerAmounts: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "SendLog",
        tableName: "sendLogs",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate() {}
}
export default SendLog;
