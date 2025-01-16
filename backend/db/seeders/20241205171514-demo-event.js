"use strict";

/** @type {import('sequelize-cli').Migration} */
const { Event } = require("../models");

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
    await Event.bulkCreate(
      [
        {
          groupId: 1,
          venueId: 1,
          name: "Magic Cooking",
          description: "Come and enjoy some cooking concocted with magic!",
          type: "In person",
          capacity: 10,
          price: 5,
          startDate: "2023-12-22",
          endDate: "2024-01-02",
        },
        {
          groupId: 1,
          venueId: 1,
          name: "Tornado Exploration",
          description:
            "Fly with me and Tails in a guided tour across the world!",
          type: "In person",
          capacity: 4,
          price: 0,
          startDate: "2025-05-17",
          endDate: "2025-06-17",
        },
        {
          groupId: 2,
          venueId: 2,
          name: "Inverse Shakespearean Acting",
          description:
            "Join us in a play where we act out characters whose descriptions don't fit us!",
          type: "Online",
          capacity: 50,
          price: 5,
          startDate: "2023-05-26",
          endDate: "2023-06-01",
        },
        {
          groupId: 3,
          venueId: 3,
          name: "Wrestling",
          description: "Come and wrestle with us! Just in time for Halloween!",
          type: "In person",
          capacity: 16,
          price: 10,
          startDate: "2023-10-23",
          endDate: "2023-10-31",
        },
        {
          groupId: 4,
          venueId: 4,
          name: "The Trial of the Tarot",
          description: "Feeling lucky? Come and have your fortune read!",
          type: "In person",
          capacity: 20,
          price: 0,
          startDate: "2025-01-27",
          endDate: "2025-02-02",
        },
        {
          groupId: 4,
          venueId: 4,
          name: "New Looks!",
          description: "Time for a makeover!",
          type: "In person",
          capacity: 5,
          price: 0,
          startDate: "2024-01-19",
          endDate: "2024-01-26",
        },
        {
          groupId: 5,
          venueId: 5,
          name: "Pop Stars Show Down",
          description: "It's a battle of the stars! Who will win?",
          type: "In person",
          capacity: 10,
          price: 100,
          startDate: "2022-12-28",
          endDate: "2023-01-26",
        },
        {
          groupId: 5,
          venueId: 5,
          name: "Resort Hopping",
          description:
            "Come and enjoy the sun along the coast! We'll be hopping from resort to resort, lounging at pools and not thinking about the world for a little bit.",
          type: "In person",
          capacity: 10,
          price: 100,
          startDate: "2024-03-19",
          endDate: "2024-03-26",
        },
        {
          groupId: 6,
          venueId: 6,
          name: "Battles and Blossoms",
          description:
            "Step into the world of horticulture, prune away your impulses and let your inner gardener bloom! Nothing more to it...",
          type: "In person",
          capacity: 8,
          price: 50,
          startDate: "2023-08-30",
          endDate: "2023-09-09",
        },
        {
          groupId: 7,
          venueId: 7,
          name: "Mystery Night",
          description: "Who dunnit? Was it the mafia? Come and find out!",
          type: "In person",
          capacity: 100,
          price: 1,
          startDate: "2023-09-25",
          endDate: "2023-09-26",
        },
        {
          groupId: 7,
          venueId: 7,
          name: "The Blitz",
          description: "All the world's a stage, and we are all players!",
          type: "In person",
          capacity: 100,
          price: 1,
          startDate: "2024-06-24",
          endDate: "2024-06-25",
        },
        {
          groupId: 8,
          venueId: 8,
          name: "Restaurant Waiting for a Day",
          description: "Come and experience the life of a waiter!",
          type: "In person",
          capacity: 10,
          price: 0,
          startDate: "2023-07-24",
          endDate: "2023-07-31",
        },
        {
          groupId: 9,
          venueId: 9,
          name: "Figure Skating",
          description:
            "Come and glide with us! Preregister now, and get 10 minutes with Princess Elise!",
          type: "In person",
          capacity: 10,
          price: 0,
          startDate: "2023-03-24",
          endDate: "2023-03-31",
        },
        {
          groupId: 9,
          venueId: 9,
          name: "Easter Run",
          description: "Run with us and find the hidden eggs!",
          type: "In person",
          capacity: 10,
          price: 0,
          startDate: "2024-02-22",
          endDate: "2024-04-01",
        },
        {
          groupId: 10,
          venueId: 10,
          name: "Fishing",
          description: "fishing",
          type: "In person",
          capacity: 10,
          price: 0,
          startDate: "2024-10-18",
          endDate: "2024-10-25",
        },
        {
          groupId: 11,
          venueId: 11,
          name: "Pizza Making",
          description:
            "Come and make pizza with us! Even Chaos himself will help us!",
          type: "In person",
          capacity: 8,
          price: 0,
          startDate: "2025-02-23",
          endDate: "2025-03-02",
        },
        {
          groupId: 12,
          venueId: 12,
          name: "Cosplay and Reenact",
          description: "Let's put on some costumes and act out scenes!",
          type: "In person",
          capacity: 10,
          price: 50,
          startDate: "2023-04-22",
          endDate: "2023-05-01",
        },
        {
          groupId: 13,
          venueId: 13,
          name: "Night Thrills",
          description:
            "We will be performing freestyle acrobatics and dancing in the dead of night. Come and join us!",
          type: "In person",
          capacity: 10,
          price: 25,
          startDate: "2024-08-23",
          endDate: "2024-08-31",
        },
        {
          groupId: 14,
          venueId: 14,
          name: "Gathering Intel",
          description:
            "Join me in learning more about the treasures here! Please join, it's less suspicious if I'm not alone.",
          type: "In person",
          capacity: 10,
          price: 1000,
          startDate: "2024-04-19",
          endDate: "2024-04-21",
        },
        {
          groupId: 15,
          venueId: 15,
          name: "Race of the Year",
          description:
            "Try to beat me and take the title of the fastest in the universe! I doubt anyone can beat me, but feel free to try!",
          type: "In person",
          capacity: 8,
          price: 300,
          startDate: "2025-07-19",
          endDate: "2025-07-21",
        },
        {
          groupId: 16,
          venueId: 16,
          name: "Flying Along the Island",
          description:
            "Come join me in flying around the island, and exploring its many secrets.",
          type: "In person",
          capacity: 2,
          price: 0,
          startDate: "2024-09-20",
          endDate: "2024-09-22",
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
    options.tableName = "Events";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {}, {});
  },
};
