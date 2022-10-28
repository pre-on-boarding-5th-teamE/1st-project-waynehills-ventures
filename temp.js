//index
const boardRouter = require("./boardRouter");

router.use("/board", boardRouter.router);

//user.js
created_at: {
    type: "TIMESTAMP",
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull: false,
  },
  updated_at: {
    type: "TIMESTAMP",
    defaultValue: sequelize.literal(
      "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ),
    allowNull: false,
  },

  //user_access.js
  last_time: {
    type: "TIMESTAMP",
    allowNull: false,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },

  //board
  created_at: {
    type: "TIMESTAMP",
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull: false,
  },
  updated_at: {
    type: "TIMESTAMP",
    defaultValue: sequelize.literal(
      "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ),
    allowNull: false,
  },