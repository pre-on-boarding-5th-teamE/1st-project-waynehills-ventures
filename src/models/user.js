const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        phone: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
        age: {
          type: Sequelize.SMALLINT.UNSIGNED,
          allowNull: true,
        },
        kakao_id: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: "User",
        tableName: "user",
        paranoid: true,
        charset: "utf8mb4",
      }
    );
  }

  static associate(db) {
    db.User.belongsTo(db.Grade, {
      foreignKey: "grade_id",
      targetKey: "id",
    });

    db.User.belongsTo(db.Gender, {
      foreignKey: "gender_id",
      targetKey: "id",
    });

    db.User.belongsTo(db.PlatformType, {
      foreignKey: "platform_type_id",
      targetKey: "id",
    });

    db.User.hasMany(db.Board, {
      foreignKey: "writed_id",
      sourceKey: "id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    db.User.hasOne(db.UserAccess, {
      foreignKey: "user_id",
      sourceKey: "id",
    });
  }
};
