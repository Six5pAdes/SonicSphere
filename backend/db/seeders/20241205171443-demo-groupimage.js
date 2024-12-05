"use strict";

/** @type {import('sequelize-cli').Migration} */
const { GroupImage } = require("../models");

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
    await GroupImage.bulkCreate(
      [
        {
          groupId: 1,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1719098514/sonic_modern_classic_apotos_wujv66.jpg",
          preview: true,
        },
        {
          groupId: 2,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1722312406/tails_holoska_mk7dfy.jpg",
          preview: true,
        },
        {
          groupId: 3,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1717659612/knuckles-chao_dojo_h6tbzy.jpg",
          preview: true,
        },
        {
          groupId: 4,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711420182/amy-jul-2022_ub28l3.png",
          preview: true,
        },
        {
          groupId: 5,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711394506/sonic_channel/shadow_hidden_base_jzl7ev.jpg",
          preview: true,
        },
        {
          groupId: 6,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711420171/rouge-apr-2022_c6gleo.png",
          preview: true,
        },
        {
          groupId: 7,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711394506/sonic_channel/cream_chunnan_hdx9eh.jpg",
          preview: true,
        },
        {
          groupId: 8,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711394495/sonic_channel/blaze_sol_dimension_jinqim.jpg",
          preview: true,
        },
        {
          groupId: 9,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711337833/Sonic%20Channel/Silver_Soleanna_keyq1h.jpg",
          preview: true,
        },
        {
          groupId: 10,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711420165/big-aug-2022_vouqjr.png",
          preview: true,
        },
        {
          groupId: 11,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711394505/sonic_channel/chaos_tikal_master_emerald_xuydhs.jpg",
          preview: true,
        },
        {
          groupId: 12,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711394494/sonic_channel/chaotix_agency_og4nls.jpg",
          preview: true,
        },
        {
          groupId: 13,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711394502/sonic_channel/chaotix_picnic_omqyux.jpg",
          preview: true,
        },
        {
          groupId: 14,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711394495/sonic_channel/trip_fang_fvwjtg.jpg",
          preview: true,
        },
        {
          groupId: 15,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711394502/sonic_channel/babylonrogues_aquatic_capital_b5bkmy.jpg",
          preview: true,
        },
        {
          groupId: 16,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1711337830/Sonic%20Channel/Sage_Ouranos_l8kasg.jpg",
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
    options.tableName = "GroupImages";
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(options, {}, {});
  },
};
