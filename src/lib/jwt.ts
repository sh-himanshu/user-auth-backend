import jwt from "jsonwebtoken";

export const generateAccessToken = (username: string) =>
  jwt.sign({ username }, process.env.JWT_SECRET!, {
    expiresIn: "5m", // expires in 5 minutes
  });

export const generateRefreshToken = (username: string) =>
  jwt.sign({ username }, process.env.JWT_RF_SECRET!);
