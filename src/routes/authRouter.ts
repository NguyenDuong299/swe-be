import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import middleware from "i18next-http-middleware";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import path from "path";

const router = express.Router();

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    preload: ["en", "vi"],
    backend: {
      loadPath: path.join(__dirname, "../../locales/{{lng}}/translation.json"),
    },
  });
router.use(middleware.handle(i18next));
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: req.t("missing_fields") });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: req.t("password_mismatch") });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: req.t("email_exists") });
    }
    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      return res.status(400).json({ message: req.t("phone_exists") });
    }

    const user = await User.create({ firstName, lastName, phone, email, password });
    res.status(201).json({
      message: req.t("register_success"),
      user: { id: user.id, lastName: user.lastName, firstName: user.firstName, phone: user.phone, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: req.t("server_error"), error: (error as Error).message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: req.t("missing_fields") });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: req.t("user_not_found") });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: req.t("password_incorrect") });
    }

    res.json({ message: req.t("login_success"), user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: req.t("server_error"), error: (error as Error).message });
  }
});

export default router;
