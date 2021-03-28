const passport = require("passport");
const express = require("express");
const router = express.Router();

//route handler to put the user into the passportJS flow

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

//route for when a user returns from auth
router.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

//assists redux in deciding if the user is logged in or not
router.get("/auth/current_user", (req, res) => {
  res.send(req.user);
});

router.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports.router = router;
