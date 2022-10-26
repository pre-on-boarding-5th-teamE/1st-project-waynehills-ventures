const Sequelize = require("sequelize");

module.exports = class Grade extends Sequelize.Model {
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
        modelName: "Grade",
        tableName: "grade",
        paranoid: false,
        charset: "utf8mb4",
      }
    );
  }

  static associate(db) {
    db.Grade.hasMany(db.User, {
      foreignKey: "grade_id",
      sourceKey: "id",
    });
  }
};
