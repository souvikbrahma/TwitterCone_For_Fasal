var postController = new (require("../controllers/postController"))();
var Controller = require("../controllers/controller");

class CommentController extends Controller {
  constructor() {
    super("Comment");
  }

  async handlePostSave(commentObj){
    await postController.addChild(commentObj.PostId, "Comments", commentObj._id);
  }

}

module.exports = CommentController;
