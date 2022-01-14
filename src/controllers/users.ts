import { Request, Response } from "express";
import UserModel from "../models/userData";
import type { TUserData } from "../models/userData";

export const getUsers = async (_: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong !" });
  }
};

export const addUser = async (
  req: Request<{}, {}, TUserData>,
  res: Response
) => {
  const user = req.body;

  if (!user) return res.status(400).json({ message: "User info missing !" });

  try {
    const existingUser = await UserModel.findOne({ username: user.username });

    if (existingUser)
      return res.status(404).json({ message: "User already exists" });

    const newUser = await UserModel.create(user);

    res.status(200).json({ result: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteUser = async (
  req: Request<{ username: string }>,
  res: Response
) => {
  const { username } = req.params;

  try {
    const deleted = await UserModel.findOneAndDelete({ username });
    deleted
      ? res.status(200).json(deleted)
      : res.status(404).json({
          message: `username: '${username}' doesn't exist in Database !`,
        });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateUser = async (
  req: Request<{ username: string }, {}, TUserData>,
  res: Response
) => {
  const { username } = req.params;
  const newUserInfo = req.body;

  if (!newUserInfo)
    return res.status(400).json({ message: "nothing found to update !" });

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { username },
      newUserInfo,
      { new: true }
    );
    updatedUser
      ? res.status(200).json(updatedUser)
      : res.status(404).json({
          error: `username: '${username}' doesn't exist in Database !`,
        });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
