import express from "express";
import {
  forgotPasswordRouteHandler,
  loginRouteHandler,
  registerRouteHandler,
  resetPasswordRouteHandler,
} from "../../services/auth/index.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body.data.attributes;
  await loginRouteHandler(req, res, email, password);
});

router.post("/logout", (req, res) => {
  return res.sendStatus(204);
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body.data.attributes;
  await registerRouteHandler(req, res, name, email, password);
});

router.post("/password-forgot", async (req, res) => {
  const { email } = req.body.data.attributes;
  await forgotPasswordRouteHandler(req, res, email);
});

router.post("/password-reset", async (req, res) => {
  await resetPasswordRouteHandler(req, res);
});

// LinkedIn OAuth
router.get("/linkedin", passport.authenticate("linkedin", { state: "SOME_STATE" }));

router.get("/linkedin/callback", 
  passport.authenticate("linkedin", { failureRedirect: "/auth/login", session: false }),
  (req, res) => {
    // Generate JWT
    const token = jwt.sign(
      { 
        id: req.user.id, 
        email: req.user.email,
        hasCompletedOnboarding: req.user.hasCompletedOnboarding || false,
        profileType: req.user.profileType || "USER"
      }, 
      process.env.JWT_SECRET || "jobflow_secret_key", 
      { expiresIn: "24h" }
    );
    
    // Redirect to frontend with token
    const frontendUrl = process.env.APP_URL_CLIENT || "http://localhost:3000";
    res.redirect(`${frontendUrl}/auth/login?token=${token}&hasCompletedOnboarding=${req.user.hasCompletedOnboarding}`);
  }
);

export default router;
