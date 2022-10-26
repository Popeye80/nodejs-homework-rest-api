const Users = require("../userSchema");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");

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
    const newUser = await Users.create({
      email,
      password: await bcrypt.hash(password, 10),
      subscription,
      avatarURL: userAvatar,
      verificationToken: uuidv4(),
      verify: false,
    });

    return newUser;
  } catch (err) {
    console.log("here");
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

const isUserVerificated = async (userId) => {
  const isUserVerificated = await Users.findOne({ _id: userId, verify: true });
  if (!isUserVerificated) {
    return null;
  }
  return true;
};

const loginUser = async (userId, token) => {
  try {
    await Users.findOneAndUpdate({ _id: userId }, { token });
    return await Users.findOne({ _id: userId });
  } catch (err) {
    throw new Error(err.message);
  }
};

const logoutUser = async (userId) => {
  try {
    await Users.findOneAndUpdate({ _id: userId }, { token: null });
    return await Users.findOne({ _id: userId });
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
    return await Users.findOne({ _id: userId });
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateAvatar = async (userId, avatarURL) => {
  try {
    await Users.findOneAndUpdate({ _id: userId }, { avatarURL });
    return await Users.findOne({ _id: userId });
  } catch (error) {
    throw new Error(error.message);
  }
};

const verifyUser = async (verificationToken) => {
  try {
    return await Users.findOneAndUpdate(
      { verificationToken: verificationToken },
      { verify: true, verificationToken: null }
    );
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
  isUserVerificated,
  verifyUser,
};
