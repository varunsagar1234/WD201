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
      Todo.belongsTo(models.User, {
        foreignKey: "userId",
      });
      // define association here
    }

    static addTodo({ title, dueDate, userId }) {
      return this.create({
        title: title,
        dueDate: dueDate,
        completed: false,
        userId,
      });
    }

    static getTodos(userId) {
      return this.findAll({
        where: {
          userId,
        },
      });
    }
    static async overdue(userId) {
      // FILL IN HERE TO RETURN OVERDUE ITEMS

      const today = new Date();
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: today,
          },
          userId,
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueToday(userId) {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      const today = new Date();
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: today,
          },
          userId,
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }
    static async remove(id, userId) {
      return this.destroy({
        where: {
          id,
          userId,
        },
      });
    }
    static async getcompletedlist(userId) {
      return this.findAll({
        where: {
          completed: true,
          userId,
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueLater(userId) {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      const today = new Date();
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: today,
          },
          userId,
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
