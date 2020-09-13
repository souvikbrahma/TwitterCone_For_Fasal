module.exports = {
  NAME: "TWITTER_CLONE",
  MODELS: [
    require("../models/postModel"),
    require("../models/commentModel"),
  ],
  ROUTES: [
    {
      NAME: "post",
      ROUTE: require("../routes/postRoute")
    },
    {
      NAME: "comment",
      ROUTE: require("../routes/commentRoute")
    }
  ]
};
