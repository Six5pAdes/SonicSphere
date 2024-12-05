"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          firstName: "Sonic",
          lastName: "Hedgehog",
          email: "blueblur@user.io",
          username: "FastestThingAlive",
          hashedPassword: bcrypt.hashSync("chilidog"),
        },
        {
          firstName: "Miles",
          lastName: "Prower",
          email: "milestailsprower@user.io",
          username: "TailsEngineering",
          hashedPassword: bcrypt.hashSync("F!x!tF0x"),
        },
        {
          firstName: "Knuckles",
          lastName: "Echidna",
          email: "user@user.io",
          username: "GuardianOne",
          hashedPassword: bcrypt.hashSync("password4"),
        },
        {
          firstName: "Amy",
          lastName: "Rose",
          email: "cd1993@user.io",
          username: "AmyRoseTarot",
          hashedPassword: bcrypt.hashSync("pikopiko"),
        },
        {
          firstName: "Shadow",
          lastName: "Hedgehog",
          email: "shadowhedgehog@gun.gov",
          username: "UltimateLifeform",
          hashedPassword: bcrypt.hashSync("maria1"),
        },
        {
          firstName: "Rouge",
          lastName: "Bat",
          email: "rougebat@gun.gov",
          username: "JwlGrl",
          hashedPassword: bcrypt.hashSync("ma5t3r3m3raldm1n3"),
        },
        {
          firstName: "Cream",
          lastName: "Rabbit",
          email: "creamandcheese@user.io",
          username: "CreamAndCheese",
          hashedPassword: bcrypt.hashSync("chaolove"),
        },
        {
          firstName: "Blaze",
          lastName: "Cat",
          email: "blazecat@user.io",
          username: "SolGuardian",
          hashedPassword: bcrypt.hashSync("princessfire"),
        },
        {
          firstName: "Silver",
          lastName: "Hedgehog",
          email: "user200@user.io",
          username: "GoodFuture",
          hashedPassword: bcrypt.hashSync("itsnouse"),
        },
        {
          firstName: "Big",
          lastName: "Cat",
          email: "live2fish@user.io",
          username: "Fishman",
          hashedPassword: bcrypt.hashSync("froggy"),
        },
        {
          firstName: "Tikal",
          lastName: "Echidna",
          email: "tikalechidna@user.io",
          username: "Tikal",
          hashedPassword: bcrypt.hashSync("chaosandpeace"),
        },
        {
          firstName: "Vector",
          lastName: "Crocodile",
          email: "bigmoney@chaotix.org",
          username: "DetectiveVector",
          hashedPassword: bcrypt.hashSync("findthecomputerroom"),
        },
        {
          firstName: "Espio",
          lastName: "Chameleon",
          email: "espio@chaotix.org",
          username: "Espio",
          hashedPassword: bcrypt.hashSync("ninjastyle"),
        },
        {
          firstName: "Fang",
          lastName: "WeaselHunter",
          email: "tripletrouble@user.io",
          username: "Nack",
          hashedPassword: bcrypt.hashSync("fangedsniper"),
        },
        {
          firstName: "Jet",
          lastName: "Hawk",
          email: "windmaster@user.io",
          username: "LegendaryFastest",
          hashedPassword: bcrypt.hashSync("babylonrogue"),
        },
        {
          firstName: "Sage",
          lastName: "Robotnik",
          email: "sage@eggmanempire.net",
          username: "DemoUser",
          hashedPassword: bcrypt.hashSync("password"),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: [
            "FastestThingAlive",
            "TailsEngineering",
            "GuardianOne",
            "AmyRoseTarot",
            "UltimateLifeform",
            "JwlGrl",
            "CreamAndCheese",
            "SolGuardian",
            "GoodFuture",
            "Fishman",
            "Tikal",
            "DetectiveVector",
            "Espio",
            "Nack",
            "LegendaryFastest",
            "DemoUser",
          ],
        },
      },
      {}
    );
  },
};
