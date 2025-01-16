const express = require("express");

const {
  Group,
  User,
  GroupImage,
  Venue,
  Membership,
  Event,
  EventImage,
  Attendance,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");
const { Op } = require("sequelize");

const router = express.Router();

const validateGroup = [
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 60 })
    .withMessage("Name must be between 1 and 60 characters."),
  check("about")
    .exists({ checkFalsy: true })
    .isLength({ min: 30 })
    .withMessage("About must be at least 30 characters."),
  check("type")
    .exists({ checkFalsy: true })
    .isIn(["Online", "In person"])
    .withMessage("Type must be either 'Online' or 'In person'."),
  check("private")
    .exists()
    .isBoolean()
    .withMessage("Private must be a boolean."),
  check("city")
    .exists({ checkFalsy: true })
    .withMessage("City must be provided."),
  check("state")
    .exists({ checkFalsy: true })
    .withMessage("State must be provided."),
  handleValidationErrors,
];

const validateVenue = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Address must be provided."),
  check("city")
    .exists({ checkFalsy: true })
    .withMessage("City must be provided."),
  check("state")
    .exists({ checkFalsy: true })
    .withMessage("State must be provided."),
  check("lat")
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a float between -90 and 90."),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a float between -180 and 180."),
  handleValidationErrors,
];

const validateEvent = [
  check("venueId").optional(),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters."),
  check("type")
    .exists({ checkFalsy: true })
    .isIn(["Online", "In person"])
    .withMessage("Type must be either 'Online' or 'In person'."),
  check("capacity")
    .exists({ checkFalsy: true })
    .isInt()
    .withMessage("Capacity must be an integer."),
  check("price")
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage("Price must be a decimal."),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description must be provided."),
  check("startDate")
    .exists({ checkFalsy: true })
    .toDate()
    .withMessage("Start date must be provided."),
  check("endDate")
    .exists()
    .toDate()
    .custom((endDate, { req }) => {
      if (endDate.getTime() < req.body.startDate.getTime()) {
        throw new Error("End date must be after start date.");
      }
      return true;
    })
    .withMessage("End date must be provided and after start date."),
  handleValidationErrors,
];

// 6. get all groups
router.get("/", async (req, res) => {
  const groups = await Group.findAll({
    include: [
      {
        model: User,
      },
      {
        model: GroupImage,
        attributes: ["url", "preview"],
      },
    ],
  });

  let groupsList = [];
  groups.forEach((group) => {
    groupsList.push(group.toJSON());
  });

  groupsList.forEach((group) => {
    if (group.GroupImages?.length) {
      for (let i = 0; i < group.GroupImages.length; i++) {
        if (group.GroupImages[i].preview === true) {
          group.previewImage = group.GroupImages[i].url;
          break;
        }
      }
    }
    delete group.GroupImages;
    group.numMembers = group.Users.length;
    delete group.Users;
  });

  return res.json({ Groups: groupsList });
});

// 7. get groups by user
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  const ownerGroups = await Group.findAll({
    where: {
      organizerId: user.id,
    },
  });

  const groups = await Group.findAll({
    include: {
      model: User,
      where: {
        id: user.id,
      },
    },
  });

  const groupIds = new Set();
  groups.forEach((group) => groupIds.add(group.id));
  ownerGroups.forEach((group) => groupIds.add(group.id));

  const allGroups = await Group.findAll({
    where: {
      id: {
        [Op.in]: [...groupIds],
      },
    },
    include: [
      {
        model: User,
      },
      {
        model: GroupImage,
      },
    ],
  });

  let groupsList = [];

  allGroups.forEach((group) => {
    groupsList.push(group.toJSON());
  });

  groupsList.forEach((group) => {
    if (group.GroupImages[0]) {
      group.previewImage = group.GroupImages[0].url;
    } else {
      group.previewImage = "No preview image available.";
    }
    delete group.GroupImages;
    group.numMembers = group.Users.length;
    delete group.Users;
  });

  return res.json({ Groups: groupsList });
});

// 8. get group details
router.get("/:groupId", async (req, res) => {
  const { groupId } = req.params;

  let group = await Group.findByPk(groupId, {
    include: [
      {
        model: User,
      },
      {
        model: GroupImage,
        attributes: {
          exclude: ["groupId", "createdAt", "updatedAt"],
        },
      },
      {
        model: User,
        as: "Organizer",
        attributes: {
          exclude: [
            "username",
            "email",
            "hashedPassword",
            "createdAt",
            "updatedAt",
          ],
        },
      },
      {
        model: Venue,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    ],
  });

  if (!group) {
    res.status(404);
    return res.json({ message: "Group not found." });
  }

  group = group.toJSON();
  group.numMembers = group.Users.length;
  delete group.Users;

  return res.json(group);
});

// 9. create group
router.post("/", requireAuth, validateGroup, async (req, res) => {
  const { name, about, type, private, city, state } = req.body;
  const user = await User.findByPk(req.user.id);

  const group = await user.createGroup({
    name,
    about,
    type,
    private,
    city,
    state,
  });

  return res.status(201).json(group);
});

// 10. create image for group
router.post("/:groupId/images", requireAuth, async (req, res) => {
  const { groupId } = req.params;
  const { user } = req;

  const group = await Group.findByPk(groupId);

  if (!group) {
    res.status(404);
    return res.json({ message: "Group not found." });
  }

  const cohost = await User.findByPk(user.id, {
    include: {
      model: Membership,
      where: {
        groupId,
        status: "co-host",
      },
    },
  });

  if (group.organizerId == user.id || cohost !== null) {
    const { url, preview } = req.body;

    const image = await GroupImage.create({
      url,
      preview,
      groupId,
    });

    return res.json(image);
  } else {
    res.status(403);
    return res.json({
      message: "You do not have permission to add images to this group.",
    });
  }
});

// 11. update group
router.put("/:groupId", requireAuth, validateGroup, async (req, res) => {
  const { user } = req;
  const { groupId } = req.params;
  const { name, about, type, private, city, state } = req.body;

  let group = await Group.findByPk(groupId);
  if (!group) {
    res.status(404);
    return res.json({ message: "Group not found." });
  }

  if (user.id === group.organizerId) {
    await group.update({
      name,
      about,
      type,
      private,
      city,
      state,
    });

    return res.json(group);
  } else {
    res.status(403);
    return res.json({
      message: "You do not have permission to edit this group.",
    });
  }
});

// 12. delete group
router.delete("/:groupId", requireAuth, async (req, res) => {
  const { user } = req;
  const { groupId } = req.params;

  let group = await Group.findByPk(groupId);
  if (!group) {
    res.status(404);
    return res.json({ message: "Group not found." });
  }

  if (user.id === group.organizerId) {
    await group.destroy();
    return res.json({ message: "Group successfully deleted." });
  } else {
    res.status(403);
    return res.json({
      message: "You do not have permission to delete this group.",
    });
  }
});

// 13. get venues by group id
router.get("/:groupId/venues", requireAuth, async (req, res) => {
  const { groupId } = req.params;
  const { user } = req;

  const group = await Group.findByPk(groupId);
  if (!group) {
    res.status(404);
    return res.json({ message: "Group not found." });
  }

  const cohost = await User.findByPk(user.id, {
    include: {
      model: Membership,
      where: {
        groupId,
        status: "co-host",
      },
    },
  });

  if (group.organizerId == user.id || cohost !== null) {
    const venues = await Venue.findAll({
      where: {
        groupId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    return res.json({ Venues: venues });
  } else {
    res.status(403);
    return res.json({
      message: "You do not have permission to view venues for this group.",
    });
  }
});

// 14. create venue for group
router.post(
  "/:groupId/venues",
  requireAuth,
  validateVenue,
  async (req, res) => {
    const { groupId } = req.params;
    const { user } = req;
    const { address, city, state, lat, lng } = req.body;

    const group = await Group.findByPk(groupId);
    if (!group) {
      res.status(404);
      return res.json({ message: "Group not found." });
    }

    const cohost = await User.findByPk(user.id, {
      include: {
        model: Membership,
        where: {
          groupId,
          status: "co-host",
        },
      },
    });

    if (group.organizerId == user.id || cohost !== null) {
      const venue = await group.createVenue({
        address,
        city,
        state,
        lat,
        lng,
      });

      let venueObj = venue.toJSON();
      delete venueObj.createdAt;
      delete venueObj.updatedAt;

      res.json(venue);
    } else {
      res.status(403);
      return res.json({
        message: "You do not have permission to add venues to this group.",
      });
    }
  }
);

// 17. get events by group id
router.get("/:groupId/events", async (req, res) => {
  const group = await Group.findByPk(req.params.groupId);
  if (!group) {
    res.status(404);
    return res.json({ message: "Group not found." });
  }

  const numAttend = await Attendance.findAll({
    order: [["eventId", "ASC"]],
  });

  const allEvents = await Event.findAll({
    include: [
      {
        model: Group,
        where: { id: group.id },
        attributes: ["id", "name", "city", "state"],
      },
      {
        model: Venue,
        attributes: ["id", "city", "state"],
      },
    ],
  });

  const getEvents = await Event.findAll({
    where: { groupId: group.id },
    attributes: [
      "id",
      "groupId",
      "venueId",
      "name",
      "description",
      "type",
      "capacity",
      "price",
      "startDate",
      "endDate",
    ],
    include: {
      model: EventImage,
      attributes: ["id", "url", "preview"],
    },
  });

  const response = [];
  getEvents.forEach((event) => {
    response.push(event.toJSON());
  });

  let num = [];
  numAttend.forEach((attendee) => num.push([attendee.toJSON()]));

  let i = 0;
  while (i < response.length) {
    response[i].numAttend = num[i].length;
    response[i].Group = allEvents[i].Group;
    if (allEvents[i].Venue) {
      response[i].Venue = allEvents[i].Venue;
    }
    i++;
  }

  res.json({ Events: response });
});

// 19. create event for group
router.post(
  "/:groupId/events",
  requireAuth,
  validateEvent,
  async (req, res) => {
    const { groupId } = req.params;
    const { user } = req;
    let {
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    } = req.body;

    startDate = startDate.toISOString();

    const group = await Group.findByPk(groupId);
    if (!group) {
      res.status(404);
      return res.json({ message: "Group not found." });
    }

    const cohost = await User.findByPk(user.id, {
      include: {
        model: Membership,
        where: {
          groupId,
          status: "co-host",
        },
      },
    });

    if (group.organizerId == user.id || cohost !== null) {
      const event = await group.createEvent({
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

      eventObj = event.toJSON();
      delete eventObj.createdAt;
      delete eventObj.updatedAt;

      return res.json(eventObj);
    } else {
      res.status(403);
      return res.json({
        message: "You do not have permission to add events to this group.",
      });
    }
  }
);

// 23. get members by group id
router.get("/:groupId/members", async (req, res) => {
  const { user } = req;
  const { groupId } = req.params;

  const group = await Group.findByPk(groupId);
  if (!group) {
    res.status(404);
    return res.json({ message: "Group not found." });
  }

  const members = await Group.findByPk(groupId, {
    include: {
      model: User,
      attributes: ["id", "firstName", "lastName"],
    },
  });

  const membersArr = members.toJSON().Users;
  const memberIds = new Set();
  membersArr.forEach((member) => memberIds.add(member.id));

  const cohost = await User.findByPk(user.id, {
    include: {
      model: Membership,
      where: {
        groupId,
        status: "co-host",
      },
    },
  });

  let memberships;
  if (user.id === group.organizerId || cohost) {
    memberships = await Membership.findAll({
      where: {
        groupId,
        userId: {
          [Op.in]: [...memberIds],
        },
      },
      attributes: ["status"],
    });

    for (let i = 0; i < membersArr.length; i++) {
      delete membersArr[i].Memberships;
      membersArr[i].Membership = memberships[i];
    }

    return res.json({ Members: membersArr });
  } else {
    memberships = await Membership.findAll({
      where: {
        groupId,
        userId: {
          [Op.in]: [...memberIds],
        },
        status: {
          [Op.in]: ["co-host", "member"],
        },
      },
      attributes: ["status"],
    });

    let unPending = [];
    for (let i = 0; i < membersArr.length; i++) {
      delete membersArr[i].Memberships;
      membersArr[i].Membership = memberships[i];
      if (membersArr[i].Membership !== undefined) {
        unPending.push(membersArr[i]);
      }
    }

    return res.json({ Members: unPending });
  }
});

// 24. request to join group
router.post("/:groupId/membership", requireAuth, async (req, res) => {
  const { user } = req;
  const { groupId } = req.params;

  const group = await Group.findByPk(groupId);
  if (!group) {
    res.status(404);
    return res.json({ message: "Group not found." });
  }

  const userStatus = await Membership.findOne({
    where: {
      userId: user.id,
      groupId,
    },
  });

  if (!userStatus) {
    const membership = await group.createMembership({
      userId: user.id,
      status: "pending",
    });

    const memberObj = membership.toJSON();
    memberObj.memberId = memberObj.userId;
    return res.json({
      memberId: memberObj.memberId,
      status: memberObj.status,
    });
  } else if (userStatus.toJSON().status === "pending") {
    res.status(400);
    return res.json({ message: "Membership request already pending." });
  } else if (userStatus.toJSON().status !== "pending") {
    res.status(400);
    return res.json({ message: "User is already a member of this group." });
  }
});

// 25. edit membership request
router.put("/:groupId/membership", requireAuth, async (req, res) => {
  const { user } = req;
  const { groupId } = req.params;
  const { memberId, status } = req.body;

  if (status == "pending") {
    return res.status(400).json({
      message: "Validation Error",
      errors: {
        status: "Status cannot be 'pending'.",
      },
    });
  }

  const group = await Group.findByPk(groupId);
  if (!group) {
    res.status(404);
    return res.json({ message: "Group not found." });
  }

  const existingUser = await User.findByPk(memberId);
  if (!existingUser) {
    return res.status(404).json({
      message: "Validation Error.",
      errors: {
        memberId: "User not found.",
      },
    });
  }

  const membership = await Membership.findOne({
    where: {
      userId: memberId,
      groupId,
    },
  });
  if (!membership) {
    res.status(404);
    return res.json({ message: "Membership not found." });
  }

  const cohost = await Membership.findOne({
    where: {
      userId: user.id,
      groupId,
      status: "co-host",
    },
  });

  let newStatus;
  if (group.organizerId == user.id) {
    newStatus = await membership.update({
      status: status,
    });
    return res.json(newStatus);
  } else if (cohost && status == "member") {
    newStatus = await membership.update({
      status: status,
    });
    return res.json(newStatus);
  } else {
    return res.status(403).json({
      message: "You do not have permission to edit membership status.",
    });
  }
});

// 26. delete membership
router.delete(
  "/:groupId/membership/:memberId",
  requireAuth,
  async (req, res) => {
    const { user } = req;

    const existingUser = await User.findByPk(req.params.memberId);
    if (!existingUser) {
      return res.status(404).json({
        message: "Validation Error.",
        errors: {
          memberId: "User not found.",
        },
      });
    }
    const existingGroup = await Group.findByPk(req.params.groupId);
    if (!existingGroup) {
      return res.status(404).json({
        message: "Validation Error.",
        errors: {
          groupId: "Group not found.",
        },
      });
    }

    const membership = await Membership.findOne({
      where: {
        userId: req.params.memberId,
        groupId: req.params.groupId,
      },
    });
    if (!membership) {
      res.status(404);
      return res.json({ message: "Membership not found." });
    }

    const userMembership = await Membership.findOne({
      where: {
        userId: user.id,
        groupId: existingGroup.id,
      },
    });

    if (
      (userMembership && userMembership.userId === membership.userId) ||
      user.id === existingGroup.organizerId
    ) {
      await membership.destroy();
      return res.json({ message: "Membership successfully deleted." });
    } else {
      res.status(403);
      return res.json({
        message: "You do not have permission to delete this membership.",
      });
    }
  }
);

module.exports = router;
