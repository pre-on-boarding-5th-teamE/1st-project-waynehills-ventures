const Sequelize = require("sequelize");

module.exports = class PlatformType extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: "Type",
        tableName: "type",
        paranoid: false,
        charset: "utf8mb4",
      }
    );
  }
  static associate(db) {
    db.PlatformType.hasMany(db.User, {
      foreignKey: "platform_type_id",
      sorceKey: "id",
    });
  }
};
