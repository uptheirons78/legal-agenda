const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// User Model
const User = require('../models/User');

// @route     GET api/auth
// @desc      Get Logged In User
// @access    Private
router.get('/', auth, async (req, res) => {
  try {
    // Find the User By its ID (without sending back the password);
    const user = await User.findById(req.user.id).select('-password');
    // Respond with the user
    res.json(user);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/auth
// @desc      Auth User and Get Token
// @access    Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(400).json({ msg: 'Invalid Credential' });
      }

      // Payload to send
      const payload = {
        user: {
          id: user.id,
        },
      };

      // Sign with JWT
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (e) {
      console.error(e.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
