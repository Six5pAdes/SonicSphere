const express = require("express");

const {
  setTokenCookie,
  requireAuth,
  strictGroupAuth,
  groupAuth,
  idCheck,
} = require("../../utils/auth");

const {
  Event,
  Group,
  GroupImage,
  Membership,
  User,
  Venue,
} = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const Sequelize = require("sequelize");
const { Op } = Sequelize.Op;

const router = express.Router();

const validateNewGroup = [
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 60 })
    .withMessage("Group name must be 60 characters or less."),
  check("about")
    .exists({ checkFalsy: true })
    .isLength({ min: 50 })
    .withMessage("About must be at least 50 characters."),
  check("type")
    .isIn(["online", "in person"])
    .withMessage("Type must be either 'online' or 'in person'"),
  check("private")
    .exists()
    .isBoolean()
    .withMessage("Private must be a boolean"),
  check("city")
    .exists({ checkFalsy: true })
    .isAlpha("en-US", { ignore: [" ", "-", "'", "."] })
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .isAlpha("en-US", { ignore: [" ", "-", "'", "."] })
    .withMessage("State is required"),
  handleValidationErrors,
];

const validateGroupEdit = [
  check("name")
    .optional()
    .isLength({ max: 60 })
    .withMessage("Group name must be 60 characters or less."),
  check("about")
    .optional()
    .isLength({ min: 50 })
    .withMessage("About must be at least 50 characters."),
  check("type")
    .optional()
    .isIn(["online", "in person"])
    .withMessage("Type must be either 'online' or 'in person'"),
  check("private")
    .optional()
    .isBoolean()
    .withMessage("Private must be a boolean"),
  check("city")
    .optional()
    .isAlpha("en-US", { ignore: [" ", "-", "'", "."] })
    .withMessage("City is required"),
  check("state")
    .optional()
    .isAlpha("en-US", { ignore: [" ", "-", "'", "."] })
    .withMessage("State is required"),
  handleValidationErrors,
];

const validateNewVenue = [
  check("address")
    .exists({ checkFalsy: true })
    .isString()
    .withMessage("Street address is required"),
  check("city")
    .exists({ checkFalsy: true })
    .isString()
    .isAlpha("en-US", { ignore: [" ", "-", "'", "."] })
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .isString()
    .isAlpha("en-US", { ignore: [" ", "-", "'", "."] })
    .withMessage("State is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be within -180 and 180"),
  handleValidationErrors,
];

const validateNewEvent = [
  check("venueId")
    .exists({ checkFalsy: true })
    .isInt()
    .withMessage("Venue is required"),
  check("name")
    .exists({ checkFalsy: true })
    .isString()
    .isLength({ max: 60 })
    .withMessage("Event name must be 60 characters or less"),
  check("type")
    .exists({ checkFalsy: true })
    .isIn(["online", "in person"])
    .withMessage("Type must be either 'online' or 'in person'"),
  check("capacity")
    .exists({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage("Capacity must be a positive integer"),
  check("price")
    .exists({ checkFalsy: true })
    .isFloat({ min: 0 })
    .custom((value) => {
      val = val.toFixed(2);
      if (val.toString().split(".")[1].length > 2) {
        throw new Error("Price is invalid");
      }
      return true;
    })
    .withMessage(
      "Price must be a positive number with no more than 2 decimal places"
    ),
  check("description")
    .exists({ checkFalsy: true })
    .isString()
    .withMessage("Description is required"),
  check("startDate")
    .exists({ checkFalsy: true })
    .custom((value) => {
      let givenDate = new Date(value);
      let now = new Date();
      if (givenDate < now) {
        throw new Error("Start date must be in the future");
      }
      return true;
    })
    .withMessage("Start date is required"),
  check("endDate")
    .exists({ checkFalsy: true })
    .custom((endDate, { req }) => {
      let startDate = new Date(req.body.startDate);
      let givenDate = new Date(endDate);
      if (givenDate.getTime() < startDate.getTime()) {
        throw new Error("End date must be after start date");
      }
      return true;
    })
    .withMessage("End date is required"),
  handleValidationErrors,
];

// get all groups
router.get("/", async (req, res) => {
  const groups = await Group.findAll();

  const groupsInfo = [];

  for (let group of groups) {
    let members = await group.getMembers();
    let imagePrev = await group.getGroupImages({
      where: {
        preview: true,
      },
    });
    let allMembers = members.length;
    group = group.toJSON();
    group.members = allMembers;
    group.previewImage = "";
    if (imagePrev.length) {
      group.previewImage = imagePrev[0].url;
    }
    groupsInfo.push(group);
  }

  res.json({
    Groups: groupsInfo,
  });
});

// get current group
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  let groups;
  let groupInfo = [];

  if (user) {
    groups = await user.getGroups();

    for (let group of groups) {
      let members = await group.getMembers();
      let imagePrev = await group.getGroupImages({
        where: {
          preview: true,
        },
      });
      let allMembers = members.length;
      group = group.toJSON();
      group.members = allMembers;
      group.previewImage = "";
      if (imagePrev.length) {
        group.previewImage = imagePrev[0].url;
      }
      delete group.Membership;
      groupInfo.push(group);
    }
  }
  res.json({
    Groups: groupInfo,
  });
});

// get group by id
router.get("/:groupId", idCheck, async (req, res) => {
  const id = parseInt(req.params.groupId);

  const group = await Group.findByPk(id);

  const organizer = await group.getUser({
    attributes: ["id", "firstName", "lastName"],
  });
  const venues = await group.getVenues();
  let imagePrev = await group.getGroupImages();

  res.json({
    ...group.dataValues,
    GroupImages: imagePrev,
    Organizer: organizer,
    Venues: venues,
  });
});

// create a new group
router.post("/", requireAuth, validateNewGroup, async (req, res) => {
  const { user } = req;
  const { name, about, type, private, city, state } = req.body;

  const group = await Group.create({
    organizerId: user.id,
    name,
    about,
    type,
    private,
    city,
    state,
  });

  await Membership.create({
    userId: user.id,
    groupId: group.id,
    status: "member",
  });

  res.status(201).json(group);
});

// add image to new group
router.post(
  "/:groupId/images",
  requireAuth,
  idCheck,
  strictGroupAuth,
  async (req, res) => {
    const id = parseInt(req.params.groupId);
    const { url, preview } = req.body;

    const image = {};
    let result;
    image.url = url;
    image.preview = preview;

    const group = await Group.findByPk(id);

    image = await group.createGroupImage(image);

    result = await GroupImage.findOne({
      where: {
        id: image.id,
      },
    });

    res.status(201).json(result);
  }
);

// edit group
router.put(
  "/:groupId",
  requireAuth,
  idCheck,
  strictGroupAuth,
  validateGroupEdit,
  async (req, res) => {
    const id = parseInt(req.params.groupId);
    const { name, about, type, private, city, state } = req.body;

    const group = await Group.findByPk(id);

    group.name = name || group.name;
    group.about = about || group.about;
    group.type = type || group.type;
    group.private = private !== undefined ? private : group.private;
    group.city = city || group.city;
    group.state = state || group.state;

    await group.save();

    return res.json(group);
  }
);

// delete group
router.delete(
  "/:groupId",
  requireAuth,
  idCheck,
  strictGroupAuth,
  async (req, res) => {
    const id = parseInt(req.params.groupId);

    const group = await Group.findByPk(id);

    await group.destroy();

    return res.json({ message: "Group successfully deleted" });
  }
);

// get group's venues
router.get(
  "/:groupId/venues",
  requireAuth,
  idCheck,
  groupAuth,
  async (req, res) => {
    const id = parseInt(req.params.groupId);

    const group = await Group.findByPk(id);

    const venues = await group.getVenues();

    res.json({ Venues: venues });
  }
);

// add venue to group
router.post(
  "/:groupId/venues",
  requireAuth,
  idCheck,
  groupAuth,
  validateNewVenue,
  async (req, res) => {
    const id = parseInt(req.params.groupId);
    const { address, city, state, lat, lng } = req.body;
    const group = await Group.findByPk(id);

    const venue = await group.createVenue({
      address,
      city,
      state,
      lat,
      lng,
    });

    res.status(201).json(venue);
  }
);

// get group's events
router.get("/:groupId/events", idCheck, async (req, res) => {
  const id = parseInt(req.params.groupId);

  const group = await Group.findByPk(id);

  let Events = [];

  let groupEvents = await group.getEvents({
    include: [
      {
        model: Venue,
        attributes: ["id", "name", "city", "state"],
      },
      {
        model: Venue,
        attributes: ["id", "city", "state"],
      },
    ],
  });

  for (let event of groupEvents) {
    let attendees = await event.getUsers();
    let numAttend = attendees.length;
    let imagePrev = await event.getEventImages({
      where: {
        preview: true,
      },
    });
    event = event.toJSON();
    event.attendees = numAttend;
    if (imagePrev.length) {
      event.previewImage = imagePrev[0].url;
    }
    Events.push(event);
  }

  res.json({ Events });
});

// add event to group
router.post(
  "/:groupId/events",
  requireAuth,
  idCheck,
  groupAuth,
  validateNewEvent,
  async (req, res) => {
    const groupId = parseInt(req.params.groupId);
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
    const group = await Group.findByPk(groupId);

    const venue = await Venue.findByPk(parseInt(venueId));
    if (!venue) {
      res.status(400);
      res.json({
        message: "Bad request",
        errors: {
          venueId: "Venue does not exist",
        },
      });
    }

    const event = await Event.create({
      groupId,
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    });
    event = await Event.scope("specific").findByPk(event.id);

    res.status(201).json(event);
  }
);

// get group's members
router.get("/:groupId/members", idCheck, async (req, res) => {
  const { user } = req;
  let members;
  let result = [];

  const groupId = parseInt(req.params.groupId);
  const group = await Group.findByPk(groupId);

  let coHosts = await Membership.findOne({
    where: {
      groupId: group.id,
      userId: user.id,
      status: "co-host",
    },
  });

  if (group.organizerId === user.id || coHosts) {
    members = await group.getMembers({
      attributes: {
        exclude: ["username"],
      },
      through: ["status"],
    });
    return res.json({ Members: members });
  } else {
    members = await group.getMembers({
      attributes: {
        exclude: ["username"],
      },
      through: ["status"],
    });
    for (let member of members) {
      if (member.Membership.status !== "pending") {
        result.push(member);
      }
    }

    return res.json({ Members: result });
  }
});

// add member to group
router.post("/:groupId/members", requireAuth, idCheck, async (req, res) => {
  const { user } = req;
  const groupId = parseInt(req.params.groupId);
  let newMember = {};

  const group = await Group.findByPk(groupId);
  let membership = await Membership.findOne({
    where: {
      groupId: group.id,
      userId: user.id,
    },
  });

  if (membership) {
    res.status(400);
    let message = {};

    if (membership.status === "member" || membership.status === "co-host") {
      message.message = "User is already a member of this group";
    } else {
      message.message = "User has already requested to join this group";
    }

    return res.json(message);
  }

  await Membership.create({
    groupId: group.id,
    userId: user.id,
    status: "pending",
  });

  newMember.memberId = user.id;
  newMember.status = "pending";
  return res.json(newMember);
});

router.put(
  "/:groupId/members",
  requireAuth,
  idCheck,
  groupAuth,
  async (req, res) => {
    const { user } = req;
    const { memberId, status } = req.body;

    const groupId = parseInt(req.params.groupId);
    let memberUser = await User.findByPk(memberId);

    let member = await Membership.scope("specific").findOne({
      where: {
        groupId: groupId,
        userId: memberId,
      },
    });

    if (!memberUser) {
      res.status(400);
      return res.json({
        message: "Validation error",
        errors: {
          memberId: "User does not exist",
        },
      });
    } else if (!member) {
      res.status(404);
      return res.json({
        message: "Group membership for this user does not exist",
      });
    }

    let group = await Group.findByPk(groupId);
    let organizer = group.organizerId;
    let membership = await Membership.findOne({
      where: {
        groupId: groupId,
        userId: user.id,
        status: "co-host",
      },
    });

    if (status === "pending") {
      res.status(400);
      return res.json({
        message: "Validation error",
        errors: {
          status: "Status cannot be pending",
        },
      });
    }

    if ((organizer == user.id || membership) && status === "member") {
      member.status = status;
    } else if (organizer == user.id && status === "co-host") {
      member.status = status;
    } else {
      const err = new Error("Unauthorized");
      err.title = "Needs authorization";
      err.status = 403;
      err.errors = {
        message: "User does not have permission to change status",
      };
      return next(err);
    }

    await member.save();
    res.json({
      id: member.id,
      groupId: groupId,
      memberId: member.userId,
      status: member.status,
    });
  }
);

// remove member from group
router.delete("/:groupId/members", requireAuth, idCheck, async (req, res) => {
  const { user } = req;
  const { memberId } = req.body;

  const groupId = parseInt(req.params.groupId);
  let group = await Group.findByPk(groupId);
  let memberUser = await User.findByPk(memberId);
  let member = await Membership.scope("specific").findOne({
    where: {
      groupId: groupId,
      userId: memberId,
    },
  });

  if (!memberUser) {
    res.status(400);
    return res.json({
      message: "Validation error",
      errors: {
        memberId: "User does not exist",
      },
    });
  } else if (!member) {
    res.status(404);
    return res.json({
      message: "Group membership for this user does not exist",
    });
  }

  if (memberId == user.id || user.id == group.organizerId) {
    await member.destroy();
    return res.json({ message: "User successfully removed from group" });
  } else {
    const err = new Error("Unauthorized");
    err.title = "Needs authorization";
    err.status = 403;
    err.errors = {
      message: "User does not have permission to remove user",
    };
    return res.json(err);
  }
});

module.exports = router;
