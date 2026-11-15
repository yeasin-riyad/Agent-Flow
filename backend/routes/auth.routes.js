
import express from "express";
import { login, logout } from "../controllers/auth.controller.js";
import { isAuthenticated, me } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout",isAuthenticated, logout);
router.post("/me",isAuthenticated,me);


export default router;
