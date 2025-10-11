const { DataTypes } = require("sequelize");
const db = require("../db/conn");

const Task = db.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
});

module.exports = Task;