const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          const today = new Date();
          const providedDate = new Date(value);

          const age = today.getFullYear() - providedDate.getFullYear();

          const isBirthdayPassedThisYear =
            today.getMonth() > providedDate.getMonth() ||
            (today.getMonth() === providedDate.getMonth() &&
              today.getDate() >= providedDate.getDate());

          const adjustedAge = isBirthdayPassedThisYear ? age : age - 1;

          return adjustedAge >= 10;
        },
        message: "You must be at least 10 years old",
      },
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    nationality: {
      type: String,
    },
    contactNumber: {
      type: String,
      match: /^[0-9]{10,15}$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    address: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      postalCode: {
        type: String,
      },
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    photo: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.statics.signup = async function (userData) {
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
    photo,
  } = userData;
  const exists = await this.findOne({ email });
  if (!email || !password) {
    throw Error("All fields must be filled!");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid, please provide a valid email!");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error(
      "This password is not strong enough, please consider using a password that has at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 symbol and a total of 8 characters!",
    );
  }

  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ ...userData, password: hash });

  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    nationality: user.nationality,
    contactNumber: user.contactNumber,
    email: user.email,
    role: user.role
  };
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled!");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("We cannot find a user with that email!");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password, please try again!");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
