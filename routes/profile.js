const express = require('express');
const router = express.Router();

//@route get api/profile
//@desc test route
//@access public
router.get('/', (req, res) => res.send('Profile route'));

module.exports = router;
