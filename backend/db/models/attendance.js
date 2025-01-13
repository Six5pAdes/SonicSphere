"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Attendance.init(
    {
      eventId: {
        type: DataTypes.INTEGER,
        references: { model: "Events" },
        allowNull: false,
        onDelete: "CASCADE",
        hooks: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "Users" },
        allowNull: false,
        onDelete: "CASCADE",
        hooks: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isValidType(value) {
            const validTypes = ["attending", "pending", "waitlist"];
            if (!validTypes.includes(value)) {
              throw new Error("Invalid attendance status");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Attendance",
      defaultScope: {
        attributes: {
          exclude: ["createdAt", "updatedAt", "userId", "eventId"],
        },
      },
    }
  );
  return Attendance;
};
