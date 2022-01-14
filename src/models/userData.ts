import { Schema, model } from "mongoose";

import validator from "validator";

export interface TUserData {
  username: string;
  phoneNumber: string;
  email: string;
  address?: string;
}

const userDataSchema = new Schema<TUserData>({
  username: {
    type: String,
    unique: true,
    required: [true, "username is required"],
    validate: {
      validator: validator.isAlphanumeric,
      message: "Please enter a valid username",
    },
  },
  phoneNumber: {
    type: String,
    required: [true, "phoneNumer is required"],
    validate: {
      validator: validator.isMobilePhone,
      message: "Please enter a valid mobile number",
    },
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please enter a valid email",
    },
    required: [true, "Email is required"],
  },
  address: String,
});

const UserModel = model<TUserData>("UserModel", userDataSchema);

export default UserModel;
