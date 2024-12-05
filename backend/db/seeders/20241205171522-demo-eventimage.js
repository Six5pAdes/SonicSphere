"use strict";

/** @type {import('sequelize-cli').Migration} */
const { EventImage } = require("../models");

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
    await EventImage.bulkCreate(
      [
        {
          eventId: 1,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711404048/sonic_merlina_caliburn_oh4dgu.jpg",
          preview: true,
        },
        {
          eventId: 2,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1717659612/sonic-tails_uubbrm.jpg",
          preview: true,
        },
        {
          eventId: 3,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711399697/tails_marine_o9gtln.jpg",
          preview: true,
        },
        {
          eventId: 4,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711399697/knuckles_sonic_jptwyc.jpg",
          preview: true,
        },
        {
          eventId: 5,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711399696/amy_blaze_fy8kau.jpg",
          preview: true,
        },
        {
          eventId: 6,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711404047/amy_profpickle_mfxbr0.jpg",
          preview: true,
        },
        {
          eventId: 7,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711399697/shadow_infinite_i4yftk.jpg",
          preview: true,
        },
        {
          eventId: 8,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711404047/shadow_rouge_zgxafy.jpg",
          preview: true,
        },
        {
          eventId: 9,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711399697/rouge_omega_aaexjb.jpg",
          preview: true,
        },
        {
          eventId: 10,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711399697/cream_big_am2rzo.jpg",
          preview: true,
        },
        {
          eventId: 11,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1719098514/cream-cheese-blaze_nbj62j.jpg",
          preview: true,
        },
        {
          eventId: 12,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711399696/blaze_silver_xox8k5.jpg",
          preview: true,
        },
        {
          eventId: 13,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711399697/silver_elise_jaupda.jpg",
          preview: true,
        },
        {
          eventId: 14,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711404047/silver_sonicman_xqjiqw.jpg",
          preview: true,
        },
        {
          eventId: 15,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1729638439/big_omega_rgfyky.jpg",
          preview: true,
        },
        {
          eventId: 16,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711399697/chaos_tikal_kkrpdf.jpg",
          preview: true,
        },
        {
          eventId: 17,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711399700/vector_vanilla_h0zfbu.jpg",
          preview: true,
        },
        {
          eventId: 18,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1724994216/zazz_espio_bxzmxy.jpg",
          preview: true,
        },
        {
          eventId: 19,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1713725285/fang-trip_kpxnxe.png",
          preview: true,
        },
        {
          eventId: 20,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1721541015/jet-shadow_p3nhbd.jpg",
          preview: true,
        },
        {
          eventId: 21,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1727198428/knuckles_sage_ejyh8g.jpg",
          preview: true,
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
    options.tableName = "EventImages";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {}, {});
  },
};
