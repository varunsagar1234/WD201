// models/todo.js
"use strict";
const { Model } = require("sequelize");
const { Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE
      const pendingItems = await Todo.overdue();
      const pendingItemsList = pendingItems
        .map((todos) => todos.displayableString())
        .join("\n");
      console.log(pendingItemsList);
      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      const todayItems = await Todo.dueToday();
      const todayItemslist = todayItems
        .map((todos) => todos.displayableString())
        .join("\n");
      console.log(todayItemslist);
      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const laterItems = await Todo.dueLater();
      const laterItemsList = laterItems
        .map((todos) => todos.displayableString())
        .join("\n");
      console.log(laterItemsList);
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS

      const today = new Date();
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: today,
          },
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      const today = new Date();
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: today,
          },
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      const today = new Date();
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: today,
          },
        },
        order: [["id", "ASC"]],
      });
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      return Todo.update(
        { completed: true },
        {
          where: {
            id: id,
          },
        }
      );
    }

    displayableString() {
      const today = new Date().toISOString().slice(0, 10);
      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${
        this.dueDate === today ? "" : this.dueDate
      }`.trim();
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};