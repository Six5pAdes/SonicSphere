const express = require("express");

const { requireAuth } = require("../../utils/auth");
const { EventImage, Group, User, Event } = require("../../db/models");

const router = express.Router();

// 32. delete event image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const { user } = req;
  const { imageId } = req.params;

  const image = await EventImage.findByPk(imageId, {
    include: {
      model: Event,
    },
  });

  if (!image) {
    return res.status(404).json({ message: "Image not found" });
  }

  const group = await Group.findByPk(image.Event.groupId);

  const currUser = await User.findByPk(user.id, {
    include: [
      {
        model: Group,
      },
      {
        model: Membership,
      },
    ],
  });

  let organizer = group.organizerId === currUser.id;
  let cohost = [];

  currUser.Memberships.forEach((membership) => {
    membership = membership.toJSON();
    if (membership.groupId === group.id && membership.role === "co-host") {
      cohost.push(true);
    }
  });

  if (organizer || cohost.length) {
    await image.destroy();
    return res.json({ message: "Image deleted" });
  } else {
    res.status(403);
    return res.json({ message: "Forbidden" });
  }
});

module.exports = router;
