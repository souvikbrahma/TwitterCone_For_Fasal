const cors = require("cors");

module.exports = {
  MONGO_URL: "mongodb://localhost:27017/TWITTER_CLONE_DB",
  MIDDLE_WARES: [cors()],
  WEBSERVER_PORT: 4200,
  HANDLE_ERROR: console.error
};