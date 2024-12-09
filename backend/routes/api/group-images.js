const express = require("express");

const {
  setTokenCookie,
  requireAuth,
  groupImageAuth,
} = require("../../utils/auth");
const { Group, GroupImage } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const router = express.Router();

// delete group image
router.delete(
  "/:groupImageId",
  requireAuth,
  groupImageAuth,
  async (req, res) => {
    const imageId = req.params.groupImageId;
    const image = await GroupImage.findByPk(imageId);

    await image.destroy();
    return res.json({ message: "Image deleted" });
  }
);

module.exports = router;
