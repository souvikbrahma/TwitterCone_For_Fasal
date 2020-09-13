var express = require("express");
var postController = new (require("../controllers/postController"))();
var commentController = new (require("../controllers/commentController"))();
var statusHandler = require("../handlers/statusHandler");

var router = express();

router.post("/create", async (req, res, next) => {
  try {
    let { PostId, CommentedBy, Text } = req.body;

    await commentController.create({PostId, Text, CommentedBy});
    
    return res.json(statusHandler.successMsg("Game Created"));
  } catch (cause) {
    next(cause);
  }
});

router.get("/fetch", async (req, res, next) => {
  try {
    // let { PostedBy, Text } = req.body;
    
    let posts = await postController.fetch({});
    
    return res.json(statusHandler.successMsg(posts));
  } catch (cause) {
    next(cause);
  }
});

module.exports = router;