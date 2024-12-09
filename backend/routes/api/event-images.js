const express = require("express");

const {
  setTokenCookie,
  requireAuth,
  eventImageAuth,
} = require("../../utils/auth");
const { EventImage } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const router = express.Router();

// delete event image
router.delete("/:imageId", requireAuth, eventImageAuth, async (req, res) => {
  const imageId = req.params.imageId;
  const image = await EventImage.findByPk(imageId);
  await image.destroy();
  return res.json({ message: "Image deleted" });
});

module.exports = router;
