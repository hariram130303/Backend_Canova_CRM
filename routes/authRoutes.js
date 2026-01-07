const express = require("express");
const {auth} = require("../middleware/auth");
const { login } = require("../controllers/authController");
const { changePassword } = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.post("/profile", auth, changePassword);

module.exports = router;
