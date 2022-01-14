import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const verify = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    // removing "Bearer" word from start of the authorization header
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET!, (err) => {
      if (err) return res.status(403).json("Token is not valid!");

      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};

export default verify;
