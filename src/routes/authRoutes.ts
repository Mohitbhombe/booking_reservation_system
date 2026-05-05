import { Router } from "express";
import { body } from "express-validator";
import { login, register } from "../controllers/authController";

const router = Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 })
  ],
  register
);

router.post("/login", [body("email").isEmail(), body("password").notEmpty()], login);

export default router;
