const { sequelize } = require("./index");
const { DataTypes } = require("sequelize");

const Record = sequelize.define("records", {
  rollnumber: DataTypes.TEXT,
  name: DataTypes.TEXT,
  dob: DataTypes.TEXT,
  score: DataTypes.TEXT,
});

module.exports = Record;
