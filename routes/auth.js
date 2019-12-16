const express = require("express");
const router = express.Router();

// @route     GET api/auth
// @desc      Get Logged In User
// @access    Private
router.get("/", (req, res) => {
  res.send("Get Logged In User");
});

// @route     POST api/auth
// @desc      Auth User and Get Token
// @access    Public
router.post("/", (req, res) => {
  res.send("Log In User");
});

module.exports = router;
