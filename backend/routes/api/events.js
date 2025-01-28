const express = require("express");

const { requireAuth } = require("../../utils/auth");
const {
  Event,
  Group,
  User,
  Venue,
  EventImage,
  Attendance,
  Membership,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op, or } = require("sequelize");
const { format } = require("sequelize/lib/utils");
const e = require("express");

const router = express.Router();

const validateQueryParams = [
  check("page")
    .optional()
    .custom((value) => {
      if (value < 1) {
        throw new Error("Page must be greater than or equal to 1");
      }
      if (value > 10) {
        throw new Error("Page must be less than or equal to 10");
      }
      return true;
    }),
  check("size")
    .optional()
    .custom((value) => {
      if (value < 1) {
        throw new Error("Size must be greater than or equal to 1");
      }
      if (value > 20) {
        throw new Error("Size must be less than or equal to 20");
      }
      return true;
    }),
  check("name")
    .optional()
    .isAlpha()
    .withMessage("Name must only contain letters"),
  check("type")
    .optional()
    .custom((value) => {
      if (value.includes("Online") || value.includes("In person")) {
        return true;
      }
    })
    .withMessage('Type must be either "Online" or "In person"'),
  check("startDate")
    .optional()
    .isISO8601({
      options: {
        format: "YYYY-MM-DD h:m",
      },
    })
    .withMessage("Start date must be a valid datetime"),
  handleValidationErrors,
];

// 16. get all events
router.get("/", validateQueryParams, async (req, res) => {
  let { page, size, name, type, startDate } = req.query;

  page = parseInt(page) || 1;
  size = parseInt(size) || 20;

  if (name) name = name.replace(/"/g, "");
  if (type) type = name.replace(/"/g, "");

  const queries = {
    where: {
      name: {
        [Op.substring]: name,
      },
      type,
    },
    limit: size,
    offset: (page - 1) * size,
  };

  if (!name) delete queries.where.name;
  if (!type) delete queries.where.type;

  const events = await Event.findAll({
    include: [
      {
        model: EventImage,
        attributes: ["url"],
      },
      {
        model: User,
        as: "numAttending",
      },
      {
        model: Group,
        attributes: ["id", "name", "city", "state"],
      },
      {
        model: Venue,
        attributes: ["id", "city", "state"],
      },
    ],
    ...queries,
  });

  let eventList = [];
  events.forEach((event) => {
    eventList.push(event.toJSON());
  });

  let dateMatch = [];

  if (startDate) {
    eventList.forEach((event) => {
      if (startDate.split(" ").length == 1) {
        if (event.startDate.split(" ")[0] == startDate) {
          dateMatch.push(event);
        }
      }
      if (startDate.split(" ").length == 2) {
        if (event.startDate == startDate) {
          dateMatch.push(event);
        }
      }
    });
  } else dateMatch = eventList;

  dateMatch.forEach((event) => {
    if (event.EventImages[0]) {
      event.previewImage = event.EventImages[0].url;
    }
    delete event.EventImages;
    event.numAttending = event.numAttending.length;
  });

  return res.json({
    Events: dateMatch,
  });
});

router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  const ownedEvents = await Event.findAll({
    include: [
      {
        model: Group,
        where: { organizerId: user.id },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      {
        model: EventImage,
        attributes: {
          exclude: ["eventId", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  const attendingEvents = await Event.findAll({
    include: [
      {
        model: User,
        as: "numAttending",
        where: { id: user.id },
      },
      {
        model: Group,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      {
        model: EventImage,
        attributes: {
          exclude: ["eventId", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  return res.json({
    ownedEvents,
    attendingEvents,
  });
});

// 18. get one event
router.get("/:eventId", async (req, res) => {
  const { eventId } = req.params;

  const event = await Event.unscoped().findByPk(eventId, {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: [
      {
        model: EventImage,
        attributes: {
          exclude: ["eventId", "createdAt", "updatedAt"],
        },
      },
      {
        model: User,
        as: "numAttending",
      },
      {
        model: Group,
        attributes: ["id", "name", "private", "city", "state"],
      },
      {
        model: Venue,
        attributes: ["groupId", "createdAt", "updatedAt"],
      },
    ],
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const eventObj = event.toJSON();
  eventObj.numAttending = eventObj.numAttending.length;

  return res.json(eventObj);
});

// 20. create image(s) for event
router.post("/:eventId/images", requireAuth, async (req, res) => {
  const { eventId } = req.params;
  const { user } = req;

  const event = await Event.findByPk(eventId);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const eventObj = event.toJSON();
  const currUser = await User.findByPk(user.id);
  const group = await Group.findByPk(eventObj.groupId, {
    include: { model: Membership },
  });

  const cohost = await User.findByPk(user.id, {
    include: {
      model: Membership,
      where: { groupId: eventObj.groupId, status: "co-host" },
    },
  });

  const attendee = await Attendance.findAll({
    where: {
      eventId: eventObj.id,
      userId: user.id,
      status: "attending",
    },
  });

  const host = currUser.id == group.organizerId;

  if (host || cohost || attendee.length) {
    const { url, preview } = req.body;

    const image = await EventImage.create({
      url,
      preview,
      eventId,
    });

    return res.json(image);
  } else {
    return res
      .status(403)
      .json({ message: "You are not authorized to add images to this event" });
  }
});

// 21. edit event
router.put("/:eventId", requireAuth, async (req, res) => {
  const { eventId } = req.params;
  const { user } = req;
  const {
    venueId,
    name,
    type,
    capacity,
    price,
    startDate,
    endDate,
    description,
  } = req.body;

  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const eventObj = event.toJSON();
  const group = await Group.findByPk(event.groupId);

  const host = user.id === group.organizerId;

  const cohost = await User.findByPk(user.id, {
    include: {
      model: Membership,
      where: { groupId: eventObj.groupId, status: "co-host" },
    },
  });

  if (host || cohost) {
    await event.update({
      venueId,
      name,
      type,
      capacity,
      price,
      startDate,
      endDate,
      description,
    });

    const updatedEvent = event.toJSON();
    return res.json({
      id: updatedEvent.id,
      groupId: updatedEvent.groupId,
      venueId: updatedEvent.venueId,
      name: updatedEvent.name,
      type: updatedEvent.type,
      capacity: updatedEvent.capacity,
      price: updatedEvent.price,
      startDate: updatedEvent.startDate,
      endDate: updatedEvent.endDate,
      description: updatedEvent.description,
    });
  } else {
    return res
      .status(403)
      .json({ message: "You are not authorized to edit this event" });
  }
});

// 22. delete event
router.delete("/:eventId", requireAuth, async (req, res) => {
  const { eventId } = req.params;
  const { user } = req;

  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const eventObj = event.toJSON();
  const group = await Group.findByPk(event.groupId);

  const cohost = await User.findByPk(user.id, {
    include: {
      model: Membership,
      where: { groupId: eventObj.groupId, status: "co-host" },
    },
  });

  const host = user.id === group.organizerId;

  if (host || cohost) {
    await event.destroy();
    return res.json({ message: "Event successfully deleted" });
  } else {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this event" });
  }
});

// 27. get attendees by event id
router.get("/:eventId/attendees", async (req, res) => {
  const { user } = req;
  const { eventId } = req.params;

  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const group = await Group.findByPk(event.groupId);
  const attendees = await event.getNumAttending();
  const currUser = await User.findByPk(user.id, {
    include: Membership,
  });
  let cohost = [];

  currUser.Memberships.forEach((membership) => {
    membership = membership.toJSON();
    if (membership.groupId === group.id && membership.status == "co-host") {
      cohost.push(true);
    }
  });

  let attendeeArr = [];
  attendees.forEach((attendee) => {
    attendee = attendee.toJSON();
    delete attendee.username;
    attendee.Attendance = { status: attendee.Attendance.status };
    attendeeArr.push(attendee);
  });

  if (user.id === group.organizerId || cohost.length) {
    return res.json({ Attendees: attendeeArr });
  } else {
    attendeeArr = attendeeArr.filter(
      (attendee) => attendee.Attendance.status !== "pending"
    );
    return res.json({ Attendees: attendeeArr });
  }
});

// 28. request to attend event
router.post("/:eventId/attendance", requireAuth, async (req, res) => {
  const { user } = req;
  const { eventId } = req.params;

  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const group = await Group.findByPk(event.groupId);
  const currUser = await User.findByPk(user.id, {
    include: [
      {
        model: Membership,
      },
      {
        model: Attendance,
      },
    ],
  });
  const currUserObj = currUser.toJSON();
  let isMember = [];
  currUserObj.Memberships.forEach((membership) => {
    if (membership.groupId === group.id) {
      isMember.push(membership.status);
    }
  });

  if (isMember.length == 0 || isMember.includes("pending")) {
    return res.status(403).json({
      message: "You must be a member of the group to attend this event",
    });
  }

  let attendance = [];
  currUserObj.Attendances.forEach((att) => {
    if (att.eventId == event.id) {
      attendance.push(att.status);
    }
  });

  if (attendance.includes("pending")) {
    return res
      .status(400)
      .json({ message: "You have already requested to attend this event" });
  }
  if (attendance.includes("attending")) {
    return res
      .status(400)
      .json({ message: "You are already attending this event" });
  }

  const attendee = await Attendance.create({
    eventId: eventId,
    userId: user.id,
    status: "pending",
  });

  return res.json({
    userId: attendee.userId,
    status: attendee.status,
  });
});

// 29. edit request to attend event
router.put("/:eventId/attendance", requireAuth, async (req, res) => {
  const { user } = req;
  const { eventId } = req.params;
  const { userId, status } = req.body;

  if (status === "pending") {
    return res.status(400).json({ message: "Status cannot be pending" });
  }

  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const group = await Group.findByPk(event.groupId);
  const currUser = await User.findByPk(user.id, {
    include: {
      model: Membership,
    },
  });

  const reqBodyUser = await User.findByPk(userId, {
    include: {
      model: Attendance,
    },
  });
  if (!reqBodyUser) {
    return res.status(404).json({ message: "User not found" });
  }

  let attending = [];
  reqBodyUser.Attendances.forEach((att) => {
    if (att.eventId == eventId) {
      attending.push(att);
    }
  });

  if (!attending.length) {
    return res
      .status(404)
      .json({ message: "User is not attending this event" });
  }

  let cohost = [];
  currUser.Memberships.forEach((membership) => {
    membership = membership.toJSON();
    if (membership.groupId == group.id && membership.status == "co-host") {
      cohost.push(true);
    }
  });

  if (group.organizerId === currUser.id || cohost.length) {
    const updatedAttendance = await attending[0].update({ userId, status });
    return res.json(updatedAttendance);
  } else {
    return res
      .status(403)
      .json({ message: "You are not authorized to edit this attendance" });
  }
});

// 30. cancel request to attend event
router.delete("/:eventId/attendance", requireAuth, async (req, res) => {
  const { user } = req;
  const { eventId } = req.params;
  const { userId } = req.body;

  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const reqBodyUser = await User.findByPk(userId, {
    include: {
      model: Attendance,
    },
  });

  let attending = [];
  reqBodyUser.Attendances.forEach((att) => {
    if (att.eventId == eventId) {
      attending.push(att);
    }
  });

  if (!attending.length) {
    return res
      .status(404)
      .json({ message: "User is not attending this event" });
  }

  const group = await Group.findByPk(event.groupId);

  if (user.id === group.organizerId || user.id === userId) {
    await attending[0].destroy();
    return res.json({ message: "Attendance request canceled" });
  } else {
    return res.status(403).json({
      message: "You are not authorized to cancel this attendance request",
    });
  }
});

module.exports = router;
