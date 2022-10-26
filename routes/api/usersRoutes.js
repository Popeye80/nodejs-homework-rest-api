const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  loginController,
  signupController,
  logoutController,
  currentController,
  subscriptionController,
  updateAvatarController,
  verificationController,
  sendRepeatedVerificationEmailController,
} = require("../../controllers/usersController");
const authMiddleware = require("../../middlewares/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, multerCallBack) => {
    multerCallBack(null, path.resolve("./tmp"));
  },
  filename: (req, file, multerCallBack) => {
    const [filename, extenstion] = file.originalname.split(".");
    multerCallBack(null, `${filename}.${extenstion}`);
  },
  limits: {
    fileSize: 2048,
  },
});

const uploadMiddleware = multer({ storage });

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/verify/:verificationToken", verificationController);
router.post("/verify", sendRepeatedVerificationEmailController);
router.use(authMiddleware);
router.get("/logout", logoutController);
router.get("/current", currentController);
router.patch("/", subscriptionController);

router.patch(
  "/avatars",
  uploadMiddleware.single("avatar"),
  updateAvatarController
);

module.exports = router;
