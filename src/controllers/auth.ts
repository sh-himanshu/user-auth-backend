import { Request, Response } from "express";

import { generateAccessToken, generateRefreshToken } from "../lib/jwt";
import jwt from "jsonwebtoken";
import RefreshTokenModel, {
  addRefreshToken,
  deleteRefreshToken,
  getRefreshTokens,
} from "../models/refreshToken";

export interface Admin {
  username: string;
  password: string;
}

// Hardcoded
const admins: Admin[] = [
  {
    username: "admin@namasys.co",
    password: "admin123",
  },
];

export const handleLogin = async (
  req: Request<
    {},
    {},
    {
      username?: string;
      password?: string;
    }
  >,
  res: Response
) => {
  const { username, password } = req.body;

  if (!(username && password))
    return res
      .status(400)
      .json({ message: "Username or Password is missing!" });

  const user = admins.find(
    (e) => e.username === username && e.password === password
  );

  if (!user)
    return res
      .status(400)
      .json({ message: "Username or Password is incorrect !" });

  const accessToken = generateAccessToken(user.username);
  const refreshToken = generateRefreshToken(user.username);
  await addRefreshToken(refreshToken);

  res.status(200).json({
    username: user.username,
    accessToken,
    refreshToken,
  });
};

export const handleTokenRefresh = async (
  req: Request<{}, {}, { token: string }>,
  res: Response
) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.status(403).json("Refresh token is not valid!");
  }

  let { _id, tokens: refreshTokens } = await getRefreshTokens();

  if (!refreshTokens.includes(refreshToken))
    return res.status(401).json("You are not authenticated!");

  jwt.verify(
    refreshToken,
    process.env.JWT_RF_SECRET!,
    async (err, username) => {
      err && console.error(err);
      refreshTokens = refreshTokens.filter((t) => t !== refreshToken);

      const newAccessToken = generateAccessToken(username as any as string);
      const newRefreshToken = generateRefreshToken(username as any as string);

      refreshTokens.push(newRefreshToken);
      await RefreshTokenModel.findByIdAndUpdate(_id, { tokens: refreshTokens });

      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    }
  );
};

export const handleLogout = async (
  req: Request<{}, {}, { token: string }>,
  res: Response
) => {
  const { token: refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json("You are not authenticated!");
  await deleteRefreshToken(refreshToken);
  res.status(200).json("You logged out successfully.");
};
