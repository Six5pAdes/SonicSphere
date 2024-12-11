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
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1733950118/sonic_pict/Sonic_modernclassic_apotos_u8rhzv.jpg",
          preview: true,
        },
        {
          groupId: 2,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1733950107/sonic_pict/Tails_holoska_wybb6v.jpg",
          preview: true,
        },
        {
          groupId: 3,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1733950074/sonic_pict/Knuckles_Chao_dojo_j4vw2f.jpg",
          preview: true,
        },
        {
          groupId: 4,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1733948438/sonic_pict/Amy_spagonia_t9z1pa.jpg",
          preview: true,
        },
        {
          groupId: 5,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1733948611/sonic_pict/Shadow_hiddenbase_rx3lql.jpg",
          preview: true,
        },
        {
          groupId: 6,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1733948585/sonic_pict/Rouge_Knuckles_masteremerald_bdpj0t.jpg",
          preview: true,
        },
        {
          groupId: 7,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1733948567/sonic_pict/Cream_chunnan_omur6c.jpg",
          preview: true,
        },
        {
          groupId: 8,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1733948604/sonic_pict/Blaze_soldimension_mthssm.jpg",
          preview: true,
        },
        {
          groupId: 9,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1733948596/sonic_pict/Silver_soleanna_mijxn0.jpg",
          preview: true,
        },
        {
          groupId: 10,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1733948615/sonic_pict/Big_pumpkinhill_auqaw5.jpg",
          preview: true,
        },
        {
          groupId: 11,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1733948531/sonic_pict/Tikal_Chaos_masteremerald_bbnjsq.jpg",
          preview: true,
        },
        {
          groupId: 12,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1733948622/sonic_pict/Chaotix_office_zrxotr.jpg",
          preview: true,
        },
        {
          groupId: 13,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1733948535/sonic_pict/Chaotix_picnic_unkjyj.jpg",
          preview: true,
        },
        {
          groupId: 14,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1733948462/sonic_pict/Trip_Fang_y191qj.jpg",
          preview: true,
        },
        {
          groupId: 15,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1733948466/sonic_pict/BabylonRogues_aquaticcapital_ibrnwc.jpg",
          preview: true,
        },
        {
          groupId: 16,
          url: "https://res.cloudinary.com/dqygc4mcu/image/upload/v1733948443/sonic_pict/Sage_ouranosisland_aa9dlx.jpg",
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
