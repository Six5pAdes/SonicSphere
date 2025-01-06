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
        eventId: 1,
        userId: 1,
        status: "attending",
      },
      {
        eventId: 2,
        userId: 2,
        status: "waitlist",
      },
      {
        eventId: 3,
        userId: 3,
        status: "pending",
      },
      {
        eventId: 4,
        userId: 4,
        status: "attending",
      },
      {
        eventId: 5,
        userId: 5,
        status: "attending",
      },
      {
        eventId: 6,
        userId: 12,
        status: "waitlist",
      },
      {
        eventId: 7,
        userId: 7,
        status: "pending",
      },
      {
        eventId: 8,
        userId: 8,
        status: "attending",
      },
      {
        eventId: 9,
        userId: 10,
        status: "waitlist",
      },
      {
        eventId: 10,
        userId: 1,
        status: "attending",
      },
      {
        eventId: 11,
        userId: 5,
        status: "pending",
      },
      {
        eventId: 12,
        userId: 16,
        status: "waitlist",
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
