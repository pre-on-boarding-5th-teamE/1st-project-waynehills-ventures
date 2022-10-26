const Sequelize = require("sequelize");

module.exports = class Board extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        text: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        created_at: {
          type: "TIMESTAMP",
          defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
          allowNull: false,
        },
        updated_at: {
          type: "TIMESTAMP",
          defaultValue: sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
          allowNull: false,
        }
      },
      {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: "Board",
        tableName: "board",
        paranoid: false,
        charset: "utf8mb4",
      }
    );
  }

  static associate(db) {
    db.Board.belongsTo(db.User, {
      foreignKey: "writer_id",
      targetKey: "id",
    });

    db.Board.belongsTo(db.Type, {
      foreignKey: "board_type_id",
      targetKey: "id",
    });
  }
};
