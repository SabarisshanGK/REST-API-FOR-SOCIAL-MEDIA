const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    userId: {
      required: true,
      type: String,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
      default: '',
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
