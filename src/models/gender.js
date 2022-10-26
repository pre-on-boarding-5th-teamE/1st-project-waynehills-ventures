const Sequelize = require("sequelize");

module.exports = class Gender extends Sequelize.Model {
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
        modelName: "Gender",
        tableName: "gender",
        paranoid: false,
        charset: "utf8mb4",
      }
    );
  }

  static associate(db) {
    db.Gender.hasMany(db.User, {
      foreignKey: "gender_id",
      sourceKey: "id",
    });
  }
};
