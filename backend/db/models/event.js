"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.hasMany(models.EventImage, {
        foreignKey: "eventId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Event.belongsToMany(models.User, {
        through: "Attendance",
        foreignKey: "eventId",
        otherKey: "userId",
        as: "numAttending",
      });
      Event.belongsTo(models.Venue, {
        foreignKey: "venueId",
      });
      Event.belongsTo(models.Group, {
        foreignKey: "groupId",
      });
    }
  }
  Event.init(
    {
      venueId: {
        type: DataTypes.INTEGER,
        references: { model: "Venues" },
        allowNull: false,
        onDelete: "SET NULL",
      },
      groupId: {
        type: DataTypes.INTEGER,
        references: { model: "Groups" },
        allowNull: false,
        onDelete: "CASCADE",
        hooks: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 60],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          options(value) {
            if (!["In person", "Online"].includes(value)) {
              throw new Error("Type must be either 'In person' or 'Online'");
            }
          },
        },
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Event",
      defaultScope: {
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "capacity",
            "price",
            "description",
          ],
        },
      },
    }
  );
  return Event;
};
