const Sequelize = require("sequelize");
const env = process.env.MODE_ENV || "development";

const config = require("../config/config")[env];
const db = {};

const Type = require("./type");
const Grade = require("./grade");
const Gender = require("./gender");
const PlatformType = require("./platformType");
const User = require("./user");
const UserAccess = require("./user_access");
const Board = require("./board");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

db.Type = Type;
db.Grade = Grade;
db.Gender = Gender;
db.PlatformType = PlatformType;
db.User = User;
db.Board = Board;
db.UserAccess = UserAccess;

Type.init(sequelize);
Grade.init(sequelize);
Gender.init(sequelize);
PlatformType.init(sequelize);
User.init(sequelize);
Board.init(sequelize);
UserAccess.init(sequelize);

Type.associate(db);
Grade.associate(db);
Gender.associate(db);
PlatformType.associate(db);
User.associate(db);
Board.associate(db);
UserAccess.associate(db);

module.exports = db;
