import initApp from "./app";
import mongoose from "mongoose";

const { MONGO_URI } = process.env;

MONGO_URI
  ? mongoose
      .connect(MONGO_URI)
      .then(initApp)
      .catch((error) => {
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
      })
  : console.error("'MONGO_URI' is missing !");
