const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');
const jwtSecret = config.get('jwtSecret');

// @route api/user
// @desc  Test route
// @access Public
// router.get("/", (req, res) => res.send("User route called :)"));
const UserModel = require('../../models/User');
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email should be valid').isEmail(),
    check('password', 'Enter password should have min 6 character').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, avatar } = req.body;

    try {
      //See if user exits
      let user = await UserModel.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exist .. :(' }] });
      }

      // Get User gravatar

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });
      // Encrypt password using bcrypt
      const salt = await bcrypt.genSalt(10);
      user.avatar = avatar;

      user.password = await bcrypt.hash(password, salt);

      await user.save();

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
