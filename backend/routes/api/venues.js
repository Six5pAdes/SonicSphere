const express = require("express");

const { Venue, Group, User, Membership } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateVenue = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Please provide an address"),
  check("city")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a city"),
  check("state")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a state"),
  check("lat")
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Please provide a latitude"),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Please provide a longitude"),
  handleValidationErrors,
];

// 15. edit venue
router.put("/:venueId", requireAuth, validateVenue, async (req, res) => {
  const { venueId } = req.params;
  const { user } = req;
  const { address, city, state, lat, lng } = req.body;

  const venue = await Venue.findByPk(venueId, {
    include: {
      model: Group,
    },
  });

  if (!venue) {
    return res.status(404).json({ message: "Venue not found" });
  }

  const cohost = await User.findByPk(user.id, {
    include: {
      model: Membership,
      where: { groupId: venue.groupId, status: "co-host" },
    },
  });

  if (venue.Group.organizerId === user.id || cohost != null) {
    const updatedVenue = await venue.update({
      address,
      city,
      state,
      lat,
      lng,
    });

    const venueObj = updatedVenue.toJSON();

    return res.json({
      id: venueObj.id,
      groupId: venueObj.groupId,
      address: venueObj.address,
      city: venueObj.city,
      state: venueObj.state,
      lat: venueObj.lat,
      lng: venueObj.lng,
    });
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
});

module.exports = router;
