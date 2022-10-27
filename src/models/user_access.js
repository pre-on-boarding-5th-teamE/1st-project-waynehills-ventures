const Sequelize = require("sequelize");

module.exports = class UserAccess extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        last_time: {
          type: "TIMESTAMP",
          allowNull: false,
          defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: "UserAccess",
        tableName: "user_access",
        paranoid: false,
        charset: "utf8mb4",
      }
    );
  }

  static associate(db) {
    db.UserAccess.belongsTo(db.Grade, {
      foreignKey: "user_id",
      targetKey: "id",
    });
  }
};
