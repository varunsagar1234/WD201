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
    static associate(models) {
      // define association here
    }

    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }

    static getTodos() {
      return this.findAll();
    }
    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS

      const today = new Date();
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: today,
          },
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      const today = new Date();
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: today,
          },
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }
    static async remove(id) {
      return this.destroy({
        where: {
          id,
        },
      });
    }
    static async getcompletedlist() {
      return this.findAll({
        where: {
          completed: true,
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      const today = new Date();
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: today,
          },
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }

    static async completed(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      return this.update(
        { completed: true },
        {
          where: {
            id: id,
          },
        }
      );
    }

    setCompletionStatus(completed) {
      return this.update({ completed });
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
