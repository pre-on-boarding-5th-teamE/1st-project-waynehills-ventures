const Sequelize = require("sequelize");

module.exports = class UserAccess extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        last_time: {
          type: Sequelize.TIME,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: "UserAccess",
        tableName: "user_access",
        paranoid: true,
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
