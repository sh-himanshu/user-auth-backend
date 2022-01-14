import { Router } from "express";
import {
  handleLogin,
  handleTokenRefresh,
  handleLogout,
} from "../controllers/auth";
import verify from "../middleware/verify";

const router = Router();

router.post("/login", handleLogin);
router.post("/refresh", handleTokenRefresh);
router.post("/logout", verify, handleLogout);

export default router;
