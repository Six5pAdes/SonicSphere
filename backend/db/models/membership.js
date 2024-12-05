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
    }
  }
  Membership.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          options(value) {
            if (!["pending", "member", "co-host"].includes(value)) {
              throw new Error(
                "Status must be 'pending', 'member', or 'co-host'"
              );
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Membership",
      defaultScope: {
        attributes: {
          exclude: ["createdAt", "updatedAt", "userId", "groupId"],
        },
      },
      scopes: {
        specific: {
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      },
    }
  );
  return Membership;
};
