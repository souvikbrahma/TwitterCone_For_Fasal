var Promise = require("bluebird");
var statusHandler = require("./statusHandler");

// to Handle the error
class ErrorHandler {

  // handle various Mongo error
  // args : cause ==> exact error thrown
  static handle(cause) {
    return new Promise(async (resolve, reject) => {
      try {
        //handle undefined cause
        if (typeof cause === "undefined")
          return resolve(statusHandler.UNKNWON_CAUSE);

        // handle defined cause with defined message
        if (typeof cause.msg !== "undefined") return resolve(cause);


        // handle defined cause with defined name
        // VALIDATION ERROR
        if (cause.name == "ValidationError") {
          var msg = cause.message.replace(cause._message, "");
          msg = msg.replace(":", "");
          return resolve(statusHandler.invalidParameteresMsg(msg));
        }

        // handle defined cause with defined code
        // DUPLICATE ENTRY
        if (cause.code) {
          switch (cause.code) {
            case 11000:
              return resolve(statusHandler.DUPLICATE_ENTRY);
          }
        }

        var err = statusHandler.invalidParameteresMsg(cause.toString());
        return resolve(err);
      } catch (cause) {
        reject(cause);
      }
    });
  }
}


module.exports = ErrorHandler