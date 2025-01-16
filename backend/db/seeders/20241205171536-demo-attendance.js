"use strict";

/** @type {import('sequelize-cli').Migration} */

const { Attendance } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await Attendance.bulkCreate([
      {
        userId: 1,
        eventId: 1,
        status: "attending",
      },
      {
        userId: 1,
        eventId: 2,
        status: "pending",
      },
      {
        userId: 1,
        eventId: 3,
        status: "waitlist",
      },
      {
        userId: 1,
        eventId: 4,
        status: "pending",
      },
      {
        userId: 1,
        eventId: 5,
        status: "pending",
      },
      {
        userId: 1,
        eventId: 6,
        status: "pending",
      },
      {
        userId: 1,
        eventId: 7,
        status: "pending",
      },
      {
        userId: 1,
        eventId: 8,
        status: "pending",
      },
      {
        userId: 1,
        eventId: 9,
        status: "pending",
      },
      {
        userId: 1,
        eventId: 10,
        status: "pending",
      },
      {
        userId: 1,
        eventId: 11,
        status: "pending",
      },
      {
        userId: 1,
        eventId: 12,
        status: "pending",
      },
      {
        userId: 1,
        eventId: 13,
        status: "pending",
      },
      {
        userId: 1,
        eventId: 14,
        status: "pending",
      },
      {
        userId: 1,
        eventId: 15,
        status: "pending",
      },
      {
        userId: 1,
        eventId: 16,
        status: "pending",
      },
      {
        userId: 2,
        eventId: 2,
        status: "attending",
      },
      {
        userId: 2,
        eventId: 1,
        status: "waitlist",
      },
      {
        userId: 3,
        eventId: 3,
        status: "attending",
      },
      {
        userId: 3,
        eventId: 1,
        status: "pending",
      },
      {
        userId: 3,
        eventId: 16,
        status: "waitlist",
      },
      {
        userId: 4,
        eventId: 4,
        status: "attending",
      },
      {
        userId: 4,
        eventId: 2,
        status: "pending",
      },
      {
        userId: 4,
        eventId: 7,
        status: "pending",
      },
      {
        userId: 5,
        eventId: 5,
        status: "attending",
      },
      {
        userId: 5,
        eventId: 8,
        status: "pending",
      },
      {
        userId: 5,
        eventId: 15,
        status: "waitlist",
      },
      {
        userId: 6,
        eventId: 6,
        status: "attending",
      },
      {
        userId: 6,
        eventId: 5,
        status: "waitlist",
      },
      {
        userId: 7,
        eventId: 7,
        status: "attending",
      },
      {
        userId: 7,
        eventId: 2,
        status: "pending",
      },
      {
        userId: 8,
        eventId: 8,
        status: "attending",
      },
      {
        userId: 8,
        eventId: 7,
        status: "waitlist",
      },
      {
        userId: 8,
        eventId: 4,
        status: "waitlist",
      },
      {
        userId: 9,
        eventId: 9,
        status: "attending",
      },
      {
        userId: 9,
        eventId: 3,
        status: "pending",
      },
      {
        userId: 9,
        eventId: 7,
        status: "pending",
      },
      {
        userId: 9,
        eventId: 8,
        status: "waitlist",
      },
      {
        userId: 10,
        eventId: 10,
        status: "attending",
      },
      {
        userId: 10,
        eventId: 7,
        status: "waitlist",
      },
      {
        userId: 11,
        eventId: 11,
        status: "attending",
      },
      {
        userId: 11,
        eventId: 4,
        status: "pending",
      },
      {
        userId: 12,
        eventId: 12,
        status: "attending",
      },
      {
        userId: 12,
        eventId: 3,
        status: "pending",
      },
      {
        userId: 12,
        eventId: 13,
        status: "pending",
      },
      {
        userId: 13,
        eventId: 13,
        status: "attending",
      },
      {
        userId: 13,
        eventId: 12,
        status: "pending",
      },
      {
        userId: 13,
        eventId: 16,
        status: "pending",
      },
      {
        userId: 14,
        eventId: 14,
        status: "attending",
      },
      {
        userId: 14,
        eventId: 3,
        status: "pending",
      },
      {
        userId: 15,
        eventId: 15,
        status: "attending",
      },
      {
        userId: 15,
        eventId: 5,
        status: "pending",
      },
      {
        userId: 15,
        eventId: 6,
        status: "pending",
      },
      {
        userId: 16,
        eventId: 16,
        status: "attending",
      },
      {
        userId: 16,
        eventId: 2,
        status: "pending",
      },
      {
        userId: 16,
        eventId: 11,
        status: "pending",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Attendances";
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(options, {}, {});
  },
};
