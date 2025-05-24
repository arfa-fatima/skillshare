const User = require("../models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const createToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.SECRET, { expiresIn: "3d" });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id, user.role);
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      role: user.role,
      token
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const userSignup = async (req, res) => {
  try {
    const userData = req.body;
    const user = await User.signup(userData);
    const token = createToken(user._id, user.role);
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      role: user.role,
      token,
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(400).json({ error: error.message });
  }
};


const fetchAllUsers = async (req, res) => {
  const user = await User.find().sort({ created_at: -1 });
  if (!user) {
    return res.status(200).json({ msg: "No user found!" });
  }

  return res.status(200).json(categories);
};

const fetchOneUser = async (req, res) => {
  const user = await User.find();
  if (!user) {
    return res.status(200).json({ msg: "No such user found!" });
  }

  return res.status(200).json(user);
};

const createUser = async (req, res) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    nationality,
    contactNumber,
    email,
    address,
    password,
    accountStatus,
    photo,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !dateOfBirth ||
    !gender ||
    !nationality ||
    !contactNumber ||
    !email ||
    !address ||
    !password
  ) {
    res.status(400).json({ error: "All required fields must be filled!" });
    return;
  }

  try {

    const userData = {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      nationality,
      contactNumber,
      email,
      address,
      password,
      role,
      accountStatus,
      photo,
    };

    const user = await User.create(userData);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ msg: "We got an error", err });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "User not found!" });
  }

  const updatedUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dateOfBirth: req.body.dateOfBirth,
    gender: req.body.gender,
    nationality: req.body.nationality,
    contactNumber: req.body.contactNumber,
    address: req.body.address,
    password: req.user.password,
    photo: req.user.photo,
  };

  try {
    const user = await User.findByIdAndUpdate(id, updatedUser, {
      new: true,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "User not found!" });
  }

  const exist = await Product.find({ category: id });

  if (exist.length > 0) {
    await Product.updateMany({ category: id }, { $set: { category: null } });
  }

  try {
    await User.findByIdAndDelete(id);
    res
      .status(200)
      .json({
        msg: "User deleted successfully and associated teachers updated!",
      });
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = {
  fetchAllUsers,
  fetchOneUser,
  createUser,
  updateUser,
  deleteUser,
  userLogin,
  userSignup,
};
