const Users = require("../authSchema");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");

const getUserById = async (userId) => {
  try {
    return Users.findOne({ _id: userId });
  } catch (err) {
    throw new Error(err.message);
  }
};

const registerUser = async ({ email, password, subscription = "starter" }) => {
  try {
    const userAvatar = gravatar.url(email);
    return Users.create({
      email,
      password: await bcrypt.hash(password, 10),
      subscription,
      avatarURL: userAvatar,
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

const getUserIdByEmail = async ({ email }) => {
  try {
    const { _id } = await Users.findOne({ email });

    return _id;
  } catch (err) {
    throw new Error(err.message);
  }
};

const loginUser = async (userId, token) => {
  try {
    await Users.findOneAndUpdate({ _id: userId }, { token });
    return Users.findOne({ _id: userId });
  } catch (err) {
    throw new Error(err.message);
  }
};

const logoutUser = async (userId) => {
  try {
    await Users.findOneAndUpdate({ _id: userId }, { token: null });
    return Users.findOne({ _id: userId });
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateSubscription = async (userId, subscriptionType) => {
  try {
    await Users.findOneAndUpdate(
      { _id: userId },
      { subscription: subscriptionType }
    );
    return Users.findOne({ _id: userId });
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateAvatar = async (userId, avatarURL) => {
  try {
    await Users.findOneAndUpdate({ _id: userId }, { avatarURL });
    return Users.findOne({ _id: userId });
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getUserById,
  registerUser,
  loginUser,
  getUserIdByEmail,
  logoutUser,
  updateSubscription,
  updateAvatar,
};
