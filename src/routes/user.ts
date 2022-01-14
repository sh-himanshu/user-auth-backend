import { Router } from "express";
import {
  addUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../controllers/users";

import verify from "../middleware/verify";

const router = Router();

router.get("/", verify, getUsers);
router.post("/", verify, addUser);
router.delete("/:username", verify, deleteUser);
router.patch("/:username", verify, updateUser);

export default router;
