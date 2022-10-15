const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const {
  getUserById,
  registerUser,
  loginUser,
  getUserIdByEmail,
  logoutUser,
  updateSubscription,
  updateAvatar,
} = require("../models/db-service/users");

const schema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .min(5)
    .max(35),
  password: Joi.string().min(6).max(25).required(),
});

const signupController = async (req, res, next) => {
  try {
    const validationBody = schema.validate(req.body);
    if (validationBody.error) {
      return res.status(400).json({ message: validationBody.error.message });
    }

    const newUser = await registerUser(req.body);
    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (error) {
    if (error.message.includes("duplicate key error")) {
      return res.status(400).json({ message: "Email in use" });
    }
    return res.status(400).json({ message: error.message });
  }
};

const loginController = async (req, res, next) => {
  try {
    const validationBody = schema.validate(req.body);
    if (validationBody.error) {
      return res.status(400).json({ message: validationBody.error.message });
    }
    const userId = await getUserIdByEmail(req.body);

    const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET);
    const user = await loginUser(userId, token);

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      throw new Error("Email or password is wrong");
    }
    res.json({
      token: user.token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const logoutController = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
    }
    const { _id: userId } = req.user;

    await logoutUser(userId);
    res.status(204).json();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

const currentController = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
    }
    const { _id: userId } = req.user;
    const user = await getUserById(userId);
    res.json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

const subscriptionController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const subscriptionType = req.body.subscription;
    if (
      subscriptionType === "starter" ||
      subscriptionType === "pro" ||
      subscriptionType === "business"
    ) {
      const user = await updateSubscription(userId, subscriptionType);

      res.json({
        message: "subscription was successfully update",
        subscription: user.subscription,
      });
    } else {
      return res.status(400).json({ message: "Subscription type is wrong!" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

const updateAvatarController = async (req, res, next) => {
  const { path: temporaryName, originalname } = req.file;
  try {
    const { _id } = req.user;
    const resultUpload = path.join(
      __dirname,
      "../",
      "public",
      "avatars",
      `${_id}_${originalname}`
    );

    Jimp.read(temporaryName)
      .then((img) => {
        return img.resize(250, 250).write(resultUpload);
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        fs.unlink(req.file.path).then();
      });

    const avatarURL = path.join("public", "avatars", `${_id}_${originalname}`);

    const user = await updateAvatar(_id, avatarURL);

    res.json({ avatarURL: user.avatarURL });
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = {
  loginController,
  signupController,
  logoutController,
  currentController,
  subscriptionController,
  updateAvatarController,
};
