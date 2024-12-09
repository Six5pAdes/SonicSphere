const express = require("express");

const {
  setTokenCookie,
  requireAuth,
  eventAuth,
  eventIDCheck,
  venueIDCheck,
} = require("../../utils/auth");
const {
  Event,
  EventImage,
  Group,
  Attendance,
  Membership,
  Venue,
  User,
} = require("../../db/models");
const { check, query } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const router = express.Router();

const validateEventEdit = [
  check("venueId")
    .optional()
    .isInt()
    .custom(async (value) => {
      const venue = await Venue.findByPk(value);
      if (!venue) {
        throw new Error("Venue does not exist");
      }
      return true;
    })
    .withMessage("Venue does not exist"),
  check("name")
    .optional()
    .isLength({ max: 60 })
    .withMessage("Event name must be 60 characters or less."),
  check("type")
    .optional()
    .isIn(["online", "in-person"])
    .withMessage("Event type must be 'online' or 'in-person'."),
  check("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be an integer."),
  check("price")
    .optional()
    .isFloat()
    .custom((value) => {
      value = value.toFixed(2);
      if (value.toString().split(".")[1].length > 2) {
        throw new Error("Price must have two decimal places.");
      }
      return true;
    })
    .withMessage("Price is invalid."),
  check("description")
    .optional()
    .isAlpha("en-US", { ignore: [" ", "-", "!", ".", "?", "'", '"', "(", ")"] })
    .withMessage("Description must be a string."),
  check("startDate")
    .optional()
    .custom((value) => {
      let givenDate = new Date(value);
      let todaysDate = new Date();
      if (givenDate < todaysDate) {
        throw new Error("Start date must be in the future.");
      }
      return true;
    })
    .withMessage("Start date must be in the future."),
  check("endDate")
    .optional()
    .custom(async (endDate, { req }) => {
      let event = await Event.findByPk(parseInt(req.params.eventId));
      let start = event.startDate;
      if (req.body.startDate) {
        start = req.body.startDate;
      }

      let startDate = new Date(start);
      let newDate = new Date(endDate);
      if (newDate.getTime() < startDate.getTime()) {
        throw new Error("End date must be after the start date.");
      }
      return true;
    })
    .withMessage("End date must be after the start date."),
  handleValidationErrors,
];

const validateEventQuery = [
  query("page")
    .default("1")
    .custom((value) => {
      if (parseInt(value) < 1) {
        throw new Error("Page must be at least 1.");
      }
      return true;
    })
    .withMessage("Page must be at least 1."),
  query("size")
    .default("20")
    .custom((value) => {
      if (parseInt(value) < 1) {
        throw new Error("Size must be at least 1.");
      }
      return true;
    })
    .withMessage("Size must be at least 1."),
  query("name")
    .optional()
    .isAlpha("en-US", { ignore: [" ", "-", '"'] })
    .withMessage("Name must be a string."),
  query("type")
    .optional()
    .isIn(["online", "in-person"])
    .withMessage("Type must be 'online' or 'in-person'."),
  query("startDate")
    .optional()
    .custom((startDate) => {
      startDate = new Date(startDate);
      if (!startDate.getTime()) {
        throw new Error("Start date must be valid (YYYY-MM-DD).");
      }
      return true;
    })
    .withMessage("Start date must be valid (YYYY-MM-DD)."),
  handleValidationErrors,
];

// Get all events
router.get("/", validateEventQuery, async (req, res) => {
  let { page, size, name, type, startDate } = req.query;
  page = parseInt(page);
  if (page > 10) page = 10;
  size = parseInt(size);
  if (size > 20) size = 20;

  let queryObj = {};
  queryObj.include = [
    {
      model: Group,
      attributes: ["id", "name", "city", "state"],
    },
    {
      model: Venue,
      attributes: ["id", "city", "state"],
    },
  ];

  let limit = size;
  let offset = (page - 1) * size;
  queryObj.limit = limit;
  queryObj.offset = offset;

  queryObj.where = {};
  if (name) {
    queryObj.where.name = name;
  }
  if (type) {
    queryObj.where.type = type;
  }
  if (startDate) {
    queryObj.where.startDate = new Date(startDate);
  }

  const Events = await Event.findAll(queryObj);
  let allEvents = [];

  for (let event of Events) {
    let attendees = await event.getUsers();
    let numAttend = attendees.length;
    let imagePrev = await event.getEventImages({
      where: {
        preview: true,
      },
    });

    event = event.toJSON();
    event.numAttend = numAttend;
    if (imagePrev.length) {
      event.imagePrev = preview[0].url;
    }
    allEvents.push(event);
  }

  return res.json({
    Events: allEvents,
  });
});

// Get event by ID
router.get("/:eventId", eventIDCheck, async (req, res) => {
  const id = parseInt(req.params.eventId);

  let event = await Event.scope("specific").findByPk(id);
  let venue = await event.getVenue({
    attributes: {
      exclude: ["groupId"],
    },
  });

  let group = await event.getGroup({
    attributes: {
      exclude: ["createdAt", "updatedAt", "about", "type", "organizerId"],
    },
  });

  let attendees = await event.getUsers();
  let numAttend = attendees.length;
  let EventImages = await event.getEventImages({
    attributes: {
      exclude: ["eventId"],
    },
  });

  event = event.toJSON();
  event.numAttend = numAttend;
  event.Group = group;
  event.Venue = venue;
  event.EventImages = EventImages;
  return res.json(event);
});

// Create event image
router.post("/:eventId/images", requireAuth, eventIDCheck, async (req, res) => {
  const { user } = req;
  const { url, preview } = req.body;
  const eventId = parseInt(req.params.eventId);

  let attendance = await Attendance.findOne({
    where: {
      eventId: eventId,
      userId: user.id,
      status: "attending",
    },
  });

  let event = await Event.findByPk(eventId);
  let group = await Group.findByPk(event.groupId);
  let membership = await Membership.findOne({
    where: {
      userId: user.id,
      groupId: event.groupId,
      status: "co-host",
    },
  });

  if (attendance || membership || group.organizerId == user.id) {
    let image = { url, preview };
    const newImage = await event.createEventImage(image);

    image = await EventImage.findByPk(newImage.id, {
      attributes: {
        exclude: ["eventId"],
      },
    });

    return res.json(image);
  } else {
    const err = new Error("Unauthorized");
    err.title = "Requires proper authorization";
    err.status = 403;
    err.errors = [
      "You must be a co-host or organizer to add images to this event.",
    ];
    return res.json(err);
  }
});

// Edit event
router.put(
  "/:eventId",
  requireAuth,
  eventAuth,
  eventIDCheck,
  validateEventEdit,
  async (req, res) => {
    const eventId = parseInt(req.params.eventId);
    const {
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    } = req.body;

    let event = await Event.findByPk(eventId);

    event.venueId = venueId !== undefined ? venueId : event.venueId;
    event.name = name !== undefined ? name : event.name;
    event.type = type !== undefined ? type : event.type;
    event.capacity = capacity !== undefined ? capacity : event.capacity;
    event.price = price !== undefined ? price : event.price;
    event.description =
      description !== undefined ? description : event.description;
    event.startDate = startDate !== undefined ? startDate : event.startDate;
    event.endDate = endDate !== undefined ? endDate : event.endDate;

    event = await event.save();
    newEvent = await Event.scope("specific").findByPk(event.id);
    return res.json(event);
  }
);

// Delete event
router.delete(
  "/:eventId",
  requireAuth,
  eventAuth,
  eventIDCheck,
  async (req, res) => {
    const eventId = parseInt(req.params.eventId);
    const event = await Event.findByPk(eventId);
    await event.destroy();
    return res.json({ message: "Event deleted." });
  }
);

// Get event attendees
router.get("/:eventId/attendees", eventIDCheck, async (req, res) => {
  const { user } = req;
  let attendees;
  let result = [];
  let event = await Event.findByPk(parseInt(req.params.eventId));
  let groupId = event.groupId;
  let group = await Group.findByPk(groupId);

  let coHosts = await Membership.findOne({
    where: {
      userId: user.id,
      groupId: group.id,
      status: "co-host",
    },
  });

  if (group.organizerId == user.id || coHosts) {
    attendees = await event.getUsers({
      attributes: {
        exclude: ["username"],
      },
      through: ["status"],
    });
    return res.json({
      Attendees: attendees,
    });
  } else {
    attendees = await event.getUsers({
      attributes: {
        exclude: ["username"],
      },
      through: ["status"],
    });
    for (let attendee of attendees) {
      if (attendee.Attendance.status !== "pending") {
        result.push(attendee);
      }
    }
    return res.json({
      Attendees: result,
    });
  }
});

// Add attendee to event
router.post(
  "/:eventId/attendees",
  requireAuth,
  eventIDCheck,
  async (req, res) => {
    const { user } = req;
    const eventId = parseInt(req.params.eventId);
    let event = await Event.findByPk(eventId);
    let groupId = event.groupId;

    let membership = await Membership.findOne({
      where: {
        userId: user.id,
        groupId: groupId,
        status: {
          [Op.in]: ["member", "co-host"],
        },
      },
    });

    if (!membership) {
      const err = new Error("Unauthorized");
      err.title = "Requires proper authorization";
      err.status = 403;
      err.errors = { message: "Authorization required." };
      return next(err);
    } else {
      let attendance = await Attendance.scope("specific").findOne({
        where: {
          eventId: eventId,
          userId: user.id,
        },
      });

      if (attendance) {
        res.status(400);
        if (attendance.status === "pending") {
          return res.json({ message: "Attendance request is pending." });
        } else {
          return res.json({ message: "User is already attending." });
        }
      }

      await Attendance.create({
        eventId: eventId,
        userId: user.id,
        status: "pending",
      });

      return res.json({
        userId: user.id,
        status: "pending",
      });
    }
  }
);

// Update attendee status
router.put(
  "/:eventId/attendance",
  requireAuth,
  eventIDCheck,
  eventAuth,
  async (req, res, next) => {
    const { user } = req;
    const { userId, status } = req.body;

    const eventId = parseInt(req.params.eventId);
    let event = await Event.findByPk(eventId);

    let groupId = event.groupId;

    let attendingUser = await User.findByPk(userId);
    let attendance = await Attendance.scope("specific").findOne({
      where: {
        eventId: eventId,
        userId: userId,
      },
    });

    if (!attendingUser) {
      res.status(400);
      return res.json({
        message: "Validation error",
        errors: {
          userId: "User does not exist",
        },
      });
    } else if (!attendance) {
      res.status(404);
      return res.json({
        message: "Attendance record cannot be found",
      });
    }

    let group = await Group.findByPk(groupId);
    let organizer = group.organizerId;

    let membership = await Membership.findOne({
      where: {
        userId: user.id,
        groupId: groupId,
        status: "co-host",
      },
    });

    if (status === "pending") {
      res.status(400);
      return res.json({
        message: "Validation error",
        errors: {
          status: "Status cannot be 'pending'",
        },
      });
    }

    if (organizer == user.id || membership) {
      attendance.status = status;
    } else {
      const err = new Error("Unauthorized");
      err.title = "Requires proper authorization";
      err.status = 403;
      err.errors = { message: "Authorization required." };
      return next(err);
    }

    await attendance.save();
    res.json({
      id: attendance.id,
      groupId: groupId,
      memberId: attendance.userId,
      status: attendance.status,
    });
  }
);

// Delete attendee from event
router.delete(
  "/:eventId/attendees",
  requireAuth,
  eventIDCheck,
  async (req, res) => {
    const { user } = req;
    const { userId } = req.body;

    const eventId = parseInt(req.params.eventId);
    let event = await Event.findByPk(eventId, {
      include: {
        model: Group,
      },
    });

    let organizerId = event.Group.organizerId;

    let attendance = await Attendance.scope("specific").findOne({
      where: {
        eventId: eventId,
        userId: userId,
      },
    });
    if (!attendance) {
      res.status(404);
      return res.json({
        message: "Attendance record cannot be found",
      });
    }

    if (userId == user.id || user.id == organizerId) {
      await attendance.destroy();
      return res.json({
        message: "User removed from event",
      });
    } else {
      const err = new Error("Unauthorized");
      err.title = "Requires proper authorization";
      err.status = 403;
      err.errors = { message: "Authorization required." };
      return next(err);
    }
  }
);

module.exports = router;
