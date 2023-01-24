const Post = require('../Models/PostModel.js');
const UserModel = require('../Models/UserModel.js');

const router = require('express').Router();

//CREATING POST
router.post('/create', async (req, res) => {
  try {
    const post = new Post(req.body);

    //saving post
    try {
      const newPost = await post.save();
      res.status(200).json({ message: 'post created sucessful!', newPost });
    } catch (err) {
      res.status(500).json(err);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE A POST
router.put('/:id/update', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json({ message: 'Post Updated Successfull', post });
    } else {
      res.status(403).json("You can't update others Post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE A POST
router.delete('/:id/delete', async (req, res) => {
  const post = await Post.findById(req.params.id);
  //Checking user is deleting their own post
  if (req.body.userId === post.userId) {
    //If both id is same means user is trying to delete thier post so proceed deletion
    try {
      await Post.deleteOne();
      res.status(200).json('Post Deleted Successfully!');
    } catch (err) {
      res.status(500).json(err);
    }
  }
  //If both IDs didnot match it means user trying to delete others post so we have to block them from doing that activity
  else {
    res.status(403).json("You can't update others Post");
  }
});

//LIKE/DISLIKE A POST
router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //checking user is liked a post
    if (post.likes.includes(req.body.userId)) {
      //This means user already liked and want to dislike
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json({ message: 'Post Disliked', post });
    } else {
      //this means user wants to like a post
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json({ message: 'Post liked', post });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//TIMELINE POSTS
router.get('/timeline/all', async (req, res) => {
  try {
    const currentUser = await UserModel.findById(req.body.userId);
    const UserPost = await Post.find({ userId: currentUser._id }); //fetching all Posts posted by currentUser
    const friendPost = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId }); //fetching all Posts posted by followings of currentUser
      })
    );
    res.json(UserPost.concat(...friendPost)); //concatenate to create timeline posts
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET A POST
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
