"use strict";

const { or } = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
const { Group } = require("../models");

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
    await Group.bulkCreate(
      [
        {
          organizerId: 1,
          name: "Sonic's Team Adventurers",
          about:
            "We're a group of adventurers who love to explore the world and have fun!",
          type: "in person",
          private: false,
          city: "Atlanta",
          state: "Georgia",
        },
        {
          organizerId: 2,
          name: "Comfort Zone",
          about:
            "A group for people looking to try new things and meet new people!",
          type: "online",
          private: false,
          city: "Portland",
          state: "Oregon",
        },
        {
          organizerId: 3,
          name: "Sports Crawl",
          about: "We're a group of sports enthusiasts who love to play!",
          type: "in person",
          private: false,
          city: "Austin",
          state: "Texas",
        },
        {
          organizerId: 4,
          name: "Mystic Roses",
          about: "A group for people who love to explore the mystical!",
          type: "in person",
          private: false,
          city: "Denver",
          state: "Colorado",
        },
        {
          organizerId: 5,
          name: "Release the Angst",
          about: "A group for people who love to explore the dark side!",
          type: "in person",
          private: false,
          city: "Seattle",
          state: "Washington",
        },
        {
          organizerId: 6,
          name: "Un-Thieve",
          about: "If you love to steal but have been told not to, join us!",
          type: "online",
          private: false,
          city: "Orlando",
          state: "Florida",
        },
        {
          organizerId: 7,
          name: "Family Friendly Journeys",
          about: "A group for families who love to explore the world!",
          type: "in person",
          private: false,
          city: "Chicago",
          state: "Illinois",
        },
        {
          organizerId: 8,
          name: "Service for a Day",
          about: "A group for people who love to give back to the community!",
          type: "in person",
          private: false,
          city: "Phoenix",
          state: "Arizona",
        },
        {
          organizerId: 9,
          name: "Enjoying the Past for the Moment",
          about:
            "We love to break the time barrier, explore the past, and have fun!",
          type: "in person",
          private: false,
          city: "Salt Lake City",
          state: "Utah",
        },
        {
          organizerId: 10,
          name: "Fishers",
          about: "We love to fish, nothing else!",
          type: "in person",
          private: false,
          city: "Boston",
          state: "Massachusetts",
        },
        {
          organizerId: 11,
          name: "Corporeal Connections",
          about: "We love to connect with people in person!",
          type: "in person",
          private: false,
          city: "Las Vegas",
          state: "Nevada",
        },
        {
          organizerId: 12,
          name: "Destressors",
          about:
            "Take a load off your minds and discover who you are beyond your work!",
          type: "in person",
          private: false,
          city: "Nashville",
          state: "Tennessee",
        },
        {
          organizerId: 13,
          name: "Outdoor Enjoyments",
          about: "We love to explore the outdoors!",
          type: "in person",
          private: false,
          city: "Minneapolis",
          state: "Minnesota",
        },
        {
          organizerId: 14,
          name: "Reconnaissance",
          about:
            "We love to explore and discover new things (and definitely NOT for the potential monetary gain)!",
          type: "in person",
          private: false,
          city: "San Diego",
          state: "California",
        },
        {
          organizerId: 15,
          name: "Ultimate Riders",
          about: "Race me, if you dare!",
          type: "in person",
          private: false,
          city: "Honolulu",
          state: "Hawaii",
        },
        {
          organizerId: 16,
          name: "Curiosities",
          about: "We love to explore the unknown!",
          type: "in person",
          private: false,
          city: "Milwaukee",
          state: "Wisconsin",
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
    options.tableName = "Groups";
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(options);
  },
};
