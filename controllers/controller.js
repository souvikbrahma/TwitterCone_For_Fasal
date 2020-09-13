const statusHandler = require("../handlers/statusHandler");
// const socketHandler = require("../handlers/socketHandler");
const mongoose = require("mongoose");

class Controller {
  constructor(ModelName) {
    this.Model = mongoose.model(ModelName);
    this.ModelName = ModelName;
  }

  // PRIMARY
  fetch(
    filtersJson,
    outputSelectorsString,
    sortConditionJson,
    populateJson,
    limitRowsNumber
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        if (typeof filtersJson === "undefined")
          return reject("filtesJson required");

        if (typeof filtersJson !== "object")
          return reject("filtersJson must be a json object");

        if (
          typeof outputSelectorsString !== "undefined" &&
          typeof outputSelectorsString !== "string"
        )
          return reject("output Selectors String must be a string");

        if (
          typeof sortConditionJson !== "undefined" &&
          typeof sortConditionJson !== "object"
        )
          return reject("sortConditionJson must be a object");

        if (
          typeof populateJson !== "undefined" &&
          typeof populateJson !== "object"
        )
          return reject("populateJson must be a object");

        filtersJson.IsDeleted = false;
        let results = await this.Model.find(filtersJson)
          .select(
            typeof outputSelectorsString === "undefined"
              ? {}
              : outputSelectorsString
          )
          .sort(
            typeof sortConditionJson === "undefined" ? {} : sortConditionJson
          )
          .populate(
            typeof populateJson === "undefined"
              ? "DUMMY_PARAMETER"
              : populateJson
          )
          .limit(
            typeof limitRowsNumber === "undefined" ? 1000 : limitRowsNumber
          )
          .exec();
        return resolve(results);
      } catch (cause) {
        reject(cause);
      }
    });
  }

  // PRIMARY
  create(contentsJson) {
    return new Promise(async (resolve, reject) => {
      try {
        if (typeof contentsJson === "undefined")
          return reject("contentsJson required");

        if (typeof contentsJson !== "object")
          return reject("contentsJson must be object while creating");

        contentsJson.IsDeleted = false;
 
        let model = await this.Model.create(contentsJson);

        await this.handlePostSave(model);

        // await socketHandler.sendToClient(this.ModelName + "_CREATE", model._id);

        return resolve(model);
      } catch (cause) {
        reject(cause);
      }
    });
  }

  // PRIMARY
  updateById(myId, newDataJson) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.checkExistsById(myId);
        // await variableHandler.checkIsValidJson(newDataJson);
        newDataJson.LastUpdatedOn = new Date();
        await this.handlePreUpdate(myId, newDataJson);
        await this.Model.findByIdAndUpdate(myId, newDataJson).exec();
        await this.handlePostUpdate(myId, newDataJson);
        // TODO NOTE RESTORING MIGHT CREATE ISSUE
        if (typeof newDataJson.IsDeleted === "undefined")
          // await socketHandler.sendToClient(this.ModelName + "_UPDATE", myId);
        return resolve(true);
      } catch (cause) {
        reject(cause);
      }
    });
  }

  // SECONDARY
  read(filtersJson, outputSelectorsString, sortConditionJson, populateJson) {
    return new Promise(async (resolve, reject) => {
      try {
        let results = await this.fetch(
          filtersJson,
          outputSelectorsString,
          sortConditionJson,
          populateJson
        );
        if (results.length == 0) return reject(this.ModelName + " NOT FOUND");

        if (results.length != 1)
          return reject("expecting exactly  1 record in DB");
        return resolve(results[0]);
      } catch (cause) {
        reject(cause);
      }
    });
  }

  // SECONDARY
  readById(myId, outputSelectorsString, populateJson) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.checkExistsById(myId);
        let results = await this.fetch(
          {
            _id: myId
          },
          outputSelectorsString,
          {},
          populateJson
        );
        return resolve(results[0]);
      } catch (cause) {
        reject(cause);
      }
    });
  }

  // SECONDARY
  removeById(_myId) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.checkExistsById(_myId);
        await this.handlePreRemove(_myId);
        await this.updateById(_myId, {
          IsDeleted: true,
          LastUpdatedOn: new Date()
        });
        await this.handlePostRemove(_myId);
        await socketHandler.sendToClient(this.ModelName + "_REMOVE", _myId);
        return resolve(true);
      } catch (cause) {
        reject(cause);
      }
    });
  }

  // EVENT FOR CONTROLLER
  handlePostSave(_myId) {
    return new Promise(async (resolve, reject) => {
      try {
        return resolve(true);
      } catch (cause) {
        reject(cause);
      }
    });
  }

  // EVENT FOR CONTROLLER
  handlePreUpdate(_myId, newData) {
    return new Promise(async (resolve, reject) => {
      try {
        return resolve(true);
      } catch (cause) {
        reject(cause);
      }
    });
  }

  // EVENT FOR CONTROLLER
  handlePostUpdate(_myId, newData) {
    return new Promise(async (resolve, reject) => {
      try {
        return resolve(true);
      } catch (cause) {
        reject(cause);
      }
    });
  }

  // EVENT FOR CONTROLLER
  handlePreRemove(_myId) {
    return new Promise(async (resolve, reject) => {
      try {
        return resolve(true);
      } catch (cause) {
        reject(cause);
      }
    });
  }

  // EVENT FOR CONTROLLER
  handlePostRemove(_myId) {
    return new Promise(async (resolve, reject) => {
      try {
        return resolve(true);
      } catch (cause) {
        reject(cause);
      }
    });
  }

  // SECONDARY
  checkExists(filtersJson) {
    return new Promise(async (resolve, reject) => {
      try {
        if (typeof filtersJson === "undefined")
          return reject("filtersJson required");

        if (typeof filtersJson !== "object")
          return reject("filtersJson must be object");

        let models = await this.fetch(filtersJson);
        if (models.length == 0)
          return reject(
            statusHandler.entryNotFoundMsg(this.ModelName + " NOT FOUND")
          );

        return resolve(true);
      } catch (cause) {
        reject(cause);
      }
    });
  }

  // SECONDARY
  checkExistsById(rowId) {
    return new Promise(async (resolve, reject) => {
      try {
        let _id = mongoose.Types.ObjectId(rowId);

        let models = await this.fetch({
          _id
        });

        if (models.length == 0)
          return reject(
            statusHandler.entryNotFoundMsg(this.ModelName + " NOT FOUND")
          );

        return resolve(true);
      } catch (cause) {
        reject(cause);
      }
    });
  }

  // SECONDARY
  checkNotExists(filtersJson) {
    return new Promise(async (resolve, reject) => {
      try {
        if (typeof filtersJson === "undefined")
          return reject("filtersJson required");

        if (typeof filtersJson !== "object")
          return reject("filtersJson must be object");

        let models = await this.fetch(filtersJson);
        //console.log(models)
        if (models.length != 0)
          return reject(
            statusHandler.duplicateEntryMsg(this.ModelName + " already exists")
          );
        return resolve(true);
      } catch (cause) {
        reject(cause);
      }
    });
  }

  // SECONDARY
  checkNotExistsById(rowId) {
    return new Promise(async (resolve, reject) => {
      try {
        let _id = mongoose.Types.ObjectId(rowId);
        let models = await this.fetch({
          _id
        });
        if (models.length != 0)
          return reject(
            statusHandler.duplicateEntryMsg(this.ModelName + " already exists")
          );

        return resolve(true);
      } catch (cause) {
        reject(cause);
      }
    });
  }

  // PRIMARY
  removeMany(filtersJson) {
    return new Promise(async (resolve, reject) => {
      try {
        let models = await this.fetch(filtersJson);
        if (models.length == 0) return resolve(true);
        let cursor = this.Model.find(filtersJson).cursor();

        cursor.on("data", model => {
          model.remove();
        });

        cursor.on("close", () => {
          return resolve(true);
        });

        cursor.on("error", err => {
          return reject(err);
        });
      } catch (cause) {
        reject(cause);
      }
    });
  }

  removeIfExists(filtersJson) {
    return new Promise(async (resolve, reject) => {
      try {
        let models = await this.fetch(filtersJson);
        if (models.length == 0) return resolve(true);

        if (models.length != 1) return reject("expecting only one row");

        let model = models[0];
        await this.removeById(model._id);
        return resolve(true);
      } catch (cause) {
        reject(cause);
      }
    });
  }

  count(filtersJson) {
    return new Promise(async (resolve, reject) => {
      try {
        let models = await this.fetch(filtersJson);
        return resolve(models.length);
      } catch (cause) {
        reject(cause);
      }
    });
  }

  // PRIMARY
  addChild(parentId, parentParamter, childId) {
    return new Promise(async (resolve, reject) => {
      try {
        let PARENT_ID = mongoose.Types.ObjectId(parentId);
        let CHILD_ID = mongoose.Types.ObjectId(childId);

        let entry = {};
        entry[parentParamter] = CHILD_ID;

        await this.updateById(PARENT_ID, {
          $push: entry
        });
        return resolve(true);
      } catch (cause) {
        reject(cause);
      }
    });
  }

  // PRIMARY
  removeChild(parentId, parentParamter, childId) {
    return new Promise(async (resolve, reject) => {
      try {
        let PARENT_ID = mongoose.Types.ObjectId(parentId);
        let CHILD_ID = mongoose.Types.ObjectId(childId);

        let entry = {};
        entry[parentParamter] = CHILD_ID;

        await this.updateById(PARENT_ID, {
          $pull: entry
        });
        return resolve(true);
      } catch (cause) {
        reject(cause);
      }
    });
  }

  // TODO NEED TO UPDATE
  setChild(_myId, _myChild) {
    this.Model.findByIdAndUpdate(_myId, {
      $set: _myChild
    }).exec();
  }

  // CAN BE REMOVED
  removeChildren(_myId, _childrenNameToNull) {
    this.Model.findByIdAndUpdate(_myId, {
      $set: _childrenNameToNull
    }).exec();
  }

  addChildObj(parentId, parentParamter, childObj) {
    return new Promise(async (resolve, reject) => {
      try {
        let PARENT_ID = mongoose.Types.ObjectId(parentId);
        // let CHILD_ID = mongoose.Types.ObjectId(childId);

        let entry = {};
        entry[parentParamter] = childObj;
        
        await this.updateById(PARENT_ID, {
          $push: entry
        });
        return resolve(true);
      } catch (cause) {
        reject(cause);
      }
    });
  }

  removeChildObj(parentId, parentParamter, childObj) {
    return new Promise(async (resolve, reject) => {
      try {
        let PARENT_ID = mongoose.Types.ObjectId(parentId);
        // let CHILD_ID = mongoose.Types.ObjectId(childId);

        let entry = {};
        entry[parentParamter] = childObj;
        
        await this.updateById(PARENT_ID, {
          $pull: entry
        });
        return resolve(true);
      } catch (cause) {
        reject(cause);
      }
    });
  }  

}

module.exports = Controller;
