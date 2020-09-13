var express = require("express");
var postController = new (require("../controllers/postController"))();
var statusHandler = require("../handlers/statusHandler");

var router = express();

router.post("/create", async (req, res, next) => {
  try {
    let { PostedBy, Text } = req.body;
    
    if(Text.length > 160)
      next("Characted range exceded");

    await postController.create({PostedBy, Text});
    
    return res.json(statusHandler.successMsg("Game Created"));
  } catch (cause) {
    next(cause);
  }
});

router.post("/reactPost", async (req, res, next) => {
  try {
    let { ReactBy, PostId } = req.body;
    let reactions = await postController.fetch({_id: PostId, Likes: ReactBy}) 
    if(reactions.length > 0){
      await postController.removeChildObj(PostId, "Likes", ReactBy);
      return res.json(statusHandler.successMsg(false));
    }
    else {
      await postController.addChildObj(PostId, "Likes", ReactBy);
      return res.json(statusHandler.successMsg(true));
    }
  } catch (cause) {
    next(cause); 
  }
});

router.get("/fetch", async (req, res, next) => {
  try {
    let posts = await postController.fetch({}, "", {CreatedOn: -1}, {path: "Comments"});
    
    return res.json(statusHandler.successMsg(posts));
  } catch (cause) {
    next(cause);
  }
});

module.exports = router;