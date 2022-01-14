import dotenv from "dotenv";
import cors from "cors";
import express, { Request, Response } from "express";
import morganBody from "morgan-body";

import authRouter from "./routes/auth";
import userRouter from "./routes/user";

// Load Config
dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app = express();

// Cross-origin resource sharing
app.use(cors());

// BodyParser
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// logging
morganBody(app, {
  logIP: true,
  logReqUserAgent: false,
});

// Routes
app.get("/", (_: Request, res: Response) =>
  res.status(200).json({ message: "API is UP !" })
);
app.use("/auth", authRouter);
app.use("/users", userRouter);

const initApp = () => {
  const server = app.listen(PORT, () =>
    console.log(`Server started on PORT: ${PORT}`)
  );

  process.on("SIGTERM", () => {
    console.debug("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      console.debug("HTTP server closed");
    });
  });
};

export default initApp;
