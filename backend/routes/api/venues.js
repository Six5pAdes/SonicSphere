const express = require("express");

const {
  setTokenCookie,
  requireAuth,
  venueAuth,
  venueIDCheck,
} = require("../../utils/auth");
const { Venue } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateVenueEdit = [
  check("address")
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Street address is required"),
  check("city")
    .optional()
    .isString()
    .isLength({ min: 1 })
    .isAlpha("en-US", { ignore: [" ", "-", "'", "."] })
    .withMessage("City is required"),
  check("state")
    .optional()
    .isString()
    .isLength({ min: 1 })
    .isAlpha("en-US", { ignore: [" ", "-", "'", "."] })
    .withMessage("State is required"),
  check("lat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be within -180 and 180"),
  handleValidationErrors,
];

// edit venue
router.put(
  "/:venueId",
  requireAuth,
  venueIDCheck,
  venueAuth,
  validateVenueEdit,
  async (req, res) => {
    const id = parseInt(req.params.venueId);
    const venue = await Venue.findByPk(id);
    const { address, city, state, lat, lng } = req.body;

    venue.address = address || venue.address;
    venue.city = city || venue.city;
    venue.state = state || venue.state;
    venue.lat = lat !== undefined ? lat : venue.lat;
    venue.lng = lng !== undefined ? lng : venue.lng;

    await venue.save();
    const result = await Venue.findByPk(id);
    return res.json(result);
  }
);

module.exports = router;
