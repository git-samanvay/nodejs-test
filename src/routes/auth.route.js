const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { authMiddleware } = require("../middelware/auth.middelware");
const { roleMiddleware } = require("../middelware/role.middelware");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/profile", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});


router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

module.exports = router;