var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
const errorHandler = require("./handlers/errorHandler");
var mongoose = require("mongoose");
var appConfig = require("./configs/appConfig");
var session = require("express-session");
var connectMongo = require("connect-mongo");
var MongoStore = connectMongo(session);
var app = express();
const http = require("http").Server(app);
var serverInstance = null;
let db = null;
function connectToDB(config) {
  setTimeout(() => {
    mongoose.connect(config.MONGO_URL, {
      useNewUrlParser: true
    });
  }, 5000);
}

function start(config) {
  return new Promise(async (resolve, reject) => {
    try {
      app.use(express.static(path.join(__dirname, "public")));
      
      // require("./controllers/socketController");

      //CONFIGURE DATABASE

      mongoose.connect(config.MONGO_URL, {
        useNewUrlParser: true
      });

      mongoose.connection.on("error", () => {
        // console.log("ERROR CONNECTING DB");
        connectToDB(config);
      });

      mongoose.connection.on("connected", () => {
        console.log("SUCCESSFULLY CONNECTED TO DB");
      });

      mongoose.connection.on("disconnected", () => {
        console.log("DISCONNECTED FROM DB");
        connectToDB(config);
      });

      mongoose.Promise = global.Promise;
      mongoose.set("useCreateIndex", true);
      mongoose.set("useFindAndModify", false);

      db = mongoose.connection;

      // CONFIGURE SESSION
      app.use(
        session({
          name: "my-session",
          secret: "my-secret",
          resave: false,
          saveUninitialized: true,
          store: new MongoStore({
            mongooseConnection: db
          })
        })
      );

      // CONFIGURE BODY PARSER
      app.use(bodyParser.json({limit: '10mb', extended: true}))
      app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

      //MIDDLEWARES
      for (
        var middleWareIndex = 0;
        middleWareIndex < config.MIDDLE_WARES.length;
        middleWareIndex++
      ) {
        var middleWare = config.MIDDLE_WARES[middleWareIndex];
        app.use(middleWare);
      }

      //CONFIGURE MODELS
      for (
        var modelIndex = 0;
        modelIndex < appConfig.MODELS.length;
        modelIndex++
      ) {
        var model = appConfig.MODELS[modelIndex];
      }

      // CONFIGURE ROUTES
      app.use(async function(req, res, next) {
        // // console.log(req.headers.token);
        next();
      });
      for (
        var routeIndex = 0;
        routeIndex < appConfig.ROUTES.length;
        routeIndex++
      ) {
        var route = appConfig.ROUTES[routeIndex];
        // console.log(route.NAME, route.ROUTE);
        app.use("/api/" + route.NAME, route.ROUTE);
      }

      // app.get(/.*/, (req, res) => {
      //   res.sendFile(__dirname + "/public/index.html");
      // });

      //CUSTOM EXPRESS ERROR HANDLER
      app.use(async (err, req, res, next) => {
        var msg = await errorHandler.handle(err);
        config.HANDLE_ERROR(err);
        res.json(msg);
      });

      //START WEBSERBER
      serverInstance = http.listen(config.WEBSERVER_PORT, () => {
        console.log(
          appConfig.NAME +
            " webserver started at port number " +
            config.WEBSERVER_PORT
        );
        resolve("done");
      });
    } catch (cause) {
      reject(cause);
    }
  });
}

async function stop() {
  return new Promise(async (resolve, reject) => {
    try {
      if (serverInstance == null) return reject("no server instance");
      serverInstance.close();
      //mongoose.disconnect();

      return resolve("done");
    } catch (cause) {
      reject(cause);
    }
  });
}

async function removeAllSessions() {
  return new Promise(async (resolve, reject) => {
    try {
      db.collection("sessions").drop();
      return resolve(true);
    } catch (cause) {
      reject(cause);
    }
  });
}
module.exports = {
  start,
  stop,
  app,
  removeAllSessions
};
