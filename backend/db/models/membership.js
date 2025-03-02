"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Membership.belongsTo(models.User, {
        foreignKey: "userId",
      });
      Membership.belongsTo(models.Group, {
        foreignKey: "groupId",
      });
    }
  }
  Membership.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "Users" },
        allowNull: false,
        onDelete: "CASCADE",
        hooks: true,
      },
      groupId: {
        type: DataTypes.INTEGER,
        references: { model: "Groups" },
        allowNull: false,
        onDelete: "CASCADE",
        hooks: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isValidType(value) {
            const validTypes = ["co-host", "member", "pending"];
            if (!validTypes.includes(value)) {
              throw new Error("Invalid membership status");
            }
          },
          notToPending(value) {
            if (
              value === "pending" &&
              (this.status === "co-host" || this.status === "member")
            ) {
              throw new Error("Cannot change status to pending");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Membership",
    }
  );
  return Membership;
};
