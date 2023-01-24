const router = require('express').Router();
const Users = require('../models/UserModel.js');
const bcrypt = require('bcrypt');

//REGISTER
router.post('/register', async (req, res) => {
  try {
    //check for Existing user
    const existingUser = await Users.isExistingEmail(req.body.email);

    if (!existingUser) {
      res.json('User already exists');
    } else {
      //generate new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      //create new user
      const newUser = new Users({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      //save user and respond
      const user = await newUser.save();

      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN A USER

router.post('/login', async (req, res) => {
  try {
    //checking user
    const user = await Users.findOne({ email: req.body.email });
    !user && res.status(404).json('User not found');

    //validating Password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json('wrong password');

    res.status(200).json({ message: 'Login successfully', user });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
