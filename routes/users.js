const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// User Model
const User = require('../models/User');

// @route     POST api/users
// @desc      Register a user
// @access    Public
router.post(
  '/',
  [
    check('name', 'Please add a name, it is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email address').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more character'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check for the user with the email parameter
      let user = await User.findOne({ email: email });

      // if the user already exist, return this message
      if (user) {
        return res.status(400).json({ msg: 'This user already exists' });
      }

      // if it is a new user, create a new instance of the user
      user = new User({ name, email, password });

      // encrypt password
      const salt = await bcrypt.genSalt(10);

      // assign an hashed password to our user
      user.password = await bcrypt.hash(password, salt);

      // save the user to the database
      await user.save();

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
          expiresIn: 3600,
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
