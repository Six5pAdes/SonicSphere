"use strict";

/** @type {import('sequelize-cli').Migration} */
const { Venue } = require("../models");

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
    await Venue.bulkCreate(
      [
        {
          groupId: 1,
          address: "1234 Green Hill Zone",
          city: "Atlanta",
          state: "Georgia",
          lat: 33.748997,
          lng: -84.387985,
        },
        {
          groupId: 2,
          address: "5678 Emerald Hill Zone",
          city: "Portland",
          state: "Oregon",
          lat: 45.5051,
          lng: -122.675,
        },
        {
          groupId: 3,
          address: "9101 Angel Island",
          city: "Austin",
          state: "Texas",
          lat: 30.2672,
          lng: -97.7431,
        },
        {
          groupId: 4,
          address: "1212 Little Planet",
          city: "Denver",
          state: "Colorado",
          lat: 39.7392,
          lng: -104.9903,
        },
        {
          groupId: 5,
          address: "1313 Space Gadget",
          city: "Seattle",
          state: "Washington",
          lat: 47.6062,
          lng: -122.3321,
        },
        {
          groupId: 6,
          address: "1414 Pumpkin Hill",
          city: "Orlando",
          state: "Florida",
          lat: 28.5383,
          lng: -81.3792,
        },
        {
          groupId: 7,
          address: "1515 Grand Metropolis",
          city: "Chicago",
          state: "Illinois",
          lat: 33.4484,
          lng: -112.074,
        },
        {
          groupId: 8,
          address: "1616 Casino Park",
          city: "Phoenix",
          state: "Arizona",
          lat: 39.7392,
          lng: -104.9903,
        },
        {
          groupId: 9,
          address: "1717 White Acropolis",
          city: "Salt Lake City",
          state: "Utah",
          lat: -13.1631,
          lng: 73.7468,
        },
        {
          groupId: 10,
          address: "1818 Ocean Palace",
          city: "Boston",
          state: "Massachusetts",
          lat: 42.3601,
          lng: 171.0589,
        },
        {
          groupId: 11,
          address: "1919 Mystic Ruins",
          city: "Las Vegas",
          state: "Nevada",
          lat: 82.3546,
          lng: 71.0676,
        },
        {
          groupId: 12,
          address: "2020 Hang Castle",
          city: "Nashville",
          state: "Tennessee",
          lat: -89.9785,
          lng: 179.9973,
        },
        {
          groupId: 13,
          address: "2121 Silent Forest",
          city: "Minneapolis",
          state: "Minnesota",
          lat: 44.9778,
          lng: 93.265,
        },
        {
          groupId: 14,
          address: "2222 Speed Jungle",
          city: "San Diego",
          state: "California",
          lat: 32.7157,
          lng: 117.1611,
        },
        {
          groupId: 15,
          address: "2323 Megalo Station",
          city: "Honolulu",
          state: "Hawaii",
          lat: 21.3069,
          lng: 157.8583,
        },
        {
          groupId: 16,
          address: "2424 Rhea Island",
          city: "Milwaukee",
          state: "Wisconsin",
          lat: 83.2622,
          lng: -175.2356,
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
    options.tableName = "Venues";
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(options);
  },
};
