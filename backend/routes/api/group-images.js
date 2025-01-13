const express = require("express");

const { requireAuth } = require("../../utils/auth");
const { GroupImage } = require("../../db/models");
const { or } = require("sequelize");

const router = express.Router();

// 31. delete group image
router.delete("/:groupImageId", requireAuth, async (req, res) => {
  const { user } = req;
  const { imageId } = req.params;

  const image = await GroupImage.findByPk(imageId, {
    include: {
      model: Group,
    },
  });

  if (!image) {
    return res.status(404).json({ message: "Image not found" });
  }

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

  let organizer = image.Group.organizerId === currUser.id;
  let cohost = [];

  currUser.Memberships.forEach((membership) => {
    membership = membership.toJSON();
    if (
      membership.groupId === image.Group.id &&
      membership.status === "co-host"
    ) {
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
