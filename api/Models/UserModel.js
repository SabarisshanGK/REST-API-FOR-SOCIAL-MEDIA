const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    coverPicture: {
      type: String,
      default: '',
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
  },
  { timestamps: true }
);
UserSchema.statics.isExistingEmail = async function (email) {
  if (!email) throw new Error('Invalid email');
  try {
    const user = await this.findOne({ email });

    if (user) return false;

    return true;
  } catch (err) {
    console.log(err);
  }
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
