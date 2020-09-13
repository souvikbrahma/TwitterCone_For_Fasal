const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    CommentedBy: {
      type: String
    },
    PostId: {
      type: mongoose.Schema.ObjectId,
      ref: "Post"
    },
    Text: {
      type: String
    },
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

const Comment =  mongoose.model('Comment', CommentSchema);
module.exports = Comment;
