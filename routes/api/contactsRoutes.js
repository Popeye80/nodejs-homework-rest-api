const express = require("express");
const router = express.Router();
const {
  getAllContactsController,
  addNewContactController,
  getOneContactController,
  removeOneContactController,
  updateOneContactController,
  updateFavoriteController,
} = require("../../controllers/contactsController");
const authMiddleware = require("../../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/", getAllContactsController);

router.get("/:contactId", getOneContactController);

router.post("/", addNewContactController);

router.delete("/:contactId", removeOneContactController);

router.put("/:contactId", updateOneContactController);

router.patch("/:contactId", updateFavoriteController);

module.exports = router;
