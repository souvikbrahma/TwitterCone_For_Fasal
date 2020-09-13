const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
    PostedBy: {
      type: String
    },
    Text: {
      type: String
    },
    Image: {
      type: String
    },
    Comments: [{
      type: mongoose.Schema.ObjectId,
      ref: "Comment"
    }],
    Likes: [{
      type: String
    }],
    CreatedOn: {
      type: Date,
      default: new Date()
    },
    LastUpdatedOn: {
      type: Date,
      default: new Date()
    },
    IsDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps : true
  }
);

const Post =  mongoose.model('Post', postSchema);
module.exports = Post;
