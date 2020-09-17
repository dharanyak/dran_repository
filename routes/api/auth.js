const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config = require('config');
const jwtSecret = config.get('jwtSecret');

// @route api/auth
// @desc  Test route
// @access Public

// router.get("/", auth, (req, res) => res.send("Auth route called :)"));

router.get('/', auth, async (req, res) => {
  try {
    console.log('---------user id --------------> ', req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    console.log(user);
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error ... :(');
  }
});

router.post(
  '/',
  [
    check('email', 'Email should be valid').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, avatar } = req.body;

    try {
      //See if user exits
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials .. :(' }] });
      }

      const checkPasswordMatch = await bcrypt.compare(password, user.password);

      if (!checkPasswordMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials .. :(' }] });
      }
      // return JWT

      const payload = {
        user: {
          id: user.id,
        },
      };

      console.log('payload-->', payload);
      console.log('jwtSecret--->', jwtSecret);
      jwt.sign(
        payload,
        jwtSecret,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          console.log('token--->', token);
          if (err) {
            throw err;
          }
          return res.json({ token: token });
        }
      );
      // res.send("User Registered.. :)");
    } catch (error) {
      console.error(error.message);
      res.status(500).send();
    }
  }
);

module.exports = router;
