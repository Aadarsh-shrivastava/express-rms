const { sequelize } = require("./index");
const { DataTypes, Sequelize } = require("sequelize");
const useBcrypt = require("sequelize-bcrypt");

const User = sequelize.define(
  "users",
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isTeacher: DataTypes.BOOLEAN,
  },
  {
    timestamps: false,
  }
);

useBcrypt(User, {
  field: "password",
  rounds: 12,
  compare: "auth",
});

module.exports = User;
