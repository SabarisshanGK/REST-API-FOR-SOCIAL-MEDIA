const Users = require('../Models/UserModel.js');
const router = require('express').Router();
const bcrypt = require('bcrypt');

//update a user
router.put('/update/:id', async (req, res) => {
  //checking user is using thier account and update
  if (req.body.userid === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      //hash new password
      try {
        const salts = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salts);
      } catch (err) {
        res.status(500).json(err);
      }
    }
    //updating other details
    try {
      const user = await Users.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json({ message: 'User Updated successfully', user });
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('You can only able to update your account not others');
  }
});

//Delete a User
router.delete('/delete/:id', async (req, res) => {
  if (req.body.userid === req.params.id || req.body.isAdmin) {
    try {
      await Users.findByIdAndDelete(req.params.id);
      res.status(200).json('Account has been deleted successfully');
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('You can delete only your account');
  }
});

//Get a User
router.get('/:id', async (req, res) => {
  try {
    const user = await Users.findById(req.body.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json({ message: 'Account get succesful', other });
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow a user
router.put('/:id/follow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await Users.findById(req.params.id);
      const currentUser = await Users.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json('user has been followed');
      } else {
        res.status(403).json('you allready follow this user');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('you cant follow yourself');
  }
});

//Unfollow a user
router.put('/:id/unfollow', async (req, res) => {
  if (req.body.userid !== req.params.id) {
    try {
      const user = await Users.findById(req.params.id);
      const currentUser = await Users.findById(req.body.userid);
      if (user.followers.includes(req.body.userid)) {
        await user.updateOne({ $pull: { followers: req.body.userid } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json('User unfollowed Succesfully');
      } else {
        res.status(500).json('You already unfollowed this account');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('You cannot Unfollow yourself');
  }
});

module.exports = router;
