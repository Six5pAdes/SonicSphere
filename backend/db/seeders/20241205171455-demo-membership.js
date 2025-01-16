"use strict";

/** @type {import('sequelize-cli').Migration} */
const { Membership } = require("../models");

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
    await Membership.bulkCreate(
      [
        {
          userId: 1,
          groupId: 1,
          status: "co-host",
        },
        {
          userId: 1,
          groupId: 2,
          status: "pending",
        },
        {
          userId: 1,
          groupId: 3,
          status: "member",
        },
        {
          userId: 1,
          groupId: 4,
          status: "pending",
        },
        {
          userId: 1,
          groupId: 5,
          status: "pending",
        },
        {
          userId: 1,
          groupId: 6,
          status: "pending",
        },
        {
          userId: 1,
          groupId: 7,
          status: "pending",
        },
        {
          userId: 1,
          groupId: 8,
          status: "pending",
        },
        {
          userId: 1,
          groupId: 9,
          status: "pending",
        },
        {
          userId: 1,
          groupId: 10,
          status: "pending",
        },
        {
          userId: 1,
          groupId: 11,
          status: "pending",
        },
        {
          userId: 1,
          groupId: 12,
          status: "pending",
        },
        {
          userId: 1,
          groupId: 13,
          status: "pending",
        },
        {
          userId: 1,
          groupId: 14,
          status: "pending",
        },
        {
          userId: 1,
          groupId: 15,
          status: "pending",
        },
        {
          userId: 1,
          groupId: 16,
          status: "pending",
        },
        {
          userId: 2,
          groupId: 2,
          status: "co-host",
        },
        {
          userId: 2,
          groupId: 1,
          status: "member",
        },
        {
          userId: 3,
          groupId: 3,
          status: "co-host",
        },
        {
          userId: 3,
          groupId: 1,
          status: "pending",
        },
        {
          userId: 3,
          groupId: 16,
          status: "member",
        },
        {
          userId: 4,
          groupId: 4,
          status: "co-host",
        },
        {
          userId: 4,
          groupId: 2,
          status: "pending",
        },
        {
          userId: 4,
          groupId: 7,
          status: "pending",
        },
        {
          userId: 5,
          groupId: 5,
          status: "co-host",
        },
        {
          userId: 5,
          groupId: 8,
          status: "pending",
        },
        {
          userId: 5,
          groupId: 15,
          status: "member",
        },
        {
          userId: 6,
          groupId: 6,
          status: "co-host",
        },
        {
          userId: 6,
          groupId: 5,
          status: "member",
        },
        {
          userId: 7,
          groupId: 7,
          status: "co-host",
        },
        {
          userId: 7,
          groupId: 2,
          status: "pending",
        },
        {
          userId: 8,
          groupId: 8,
          status: "co-host",
        },
        {
          userId: 8,
          groupId: 7,
          status: "member",
        },
        {
          userId: 8,
          groupId: 4,
          status: "member",
        },
        {
          userId: 9,
          groupId: 9,
          status: "co-host",
        },
        {
          userId: 9,
          groupId: 3,
          status: "pending",
        },
        {
          userId: 9,
          groupId: 7,
          status: "pending",
        },
        {
          userId: 9,
          groupId: 8,
          status: "member",
        },
        {
          userId: 10,
          groupId: 10,
          status: "co-host",
        },
        {
          userId: 10,
          groupId: 7,
          status: "member",
        },
        {
          userId: 11,
          groupId: 11,
          status: "co-host",
        },
        {
          userId: 11,
          groupId: 4,
          status: "pending",
        },
        {
          userId: 12,
          groupId: 12,
          status: "co-host",
        },
        {
          userId: 12,
          groupId: 3,
          status: "pending",
        },
        {
          userId: 12,
          groupId: 13,
          status: "pending",
        },
        {
          userId: 13,
          groupId: 13,
          status: "co-host",
        },
        {
          userId: 13,
          groupId: 12,
          status: "pending",
        },
        {
          userId: 13,
          groupId: 16,
          status: "pending",
        },
        {
          userId: 14,
          groupId: 14,
          status: "co-host",
        },
        {
          userId: 14,
          groupId: 3,
          status: "pending",
        },
        {
          userId: 15,
          groupId: 15,
          status: "co-host",
        },
        {
          userId: 15,
          groupId: 5,
          status: "pending",
        },
        {
          userId: 15,
          groupId: 6,
          status: "pending",
        },
        {
          userId: 16,
          groupId: 16,
          status: "co-host",
        },
        {
          userId: 16,
          groupId: 2,
          status: "pending",
        },
        {
          userId: 16,
          groupId: 11,
          status: "pending",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Memberships";
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(options, {}, {});
  },
};
