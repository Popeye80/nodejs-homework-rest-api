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
} = require("../../controllers/usersController");
const authMiddleware = require("../../middlewares/authMiddleware");

// storage - наши настройки для middleware для обратоки файлов
const storage = multer.diskStorage({
  // куда сохраняем
  destination: (req, file, multerCallBack) => {
    // null - error first cb, у нас ошибки нет по этому передает null
    // path.resolve - куда сохраняем файлы, работает от корня проекта
    multerCallBack(null, path.resolve("./tmp"));
  },
  // что сохраняем
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
router.use(authMiddleware);
router.get("/logout", logoutController);
router.get("/current", currentController);
router.patch("/", subscriptionController);
// avatar - название поля формы (name) с фронта
router.patch(
  "/avatars",
  uploadMiddleware.single("avatar"),
  updateAvatarController
);

module.exports = router;
