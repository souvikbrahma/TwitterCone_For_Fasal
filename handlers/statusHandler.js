const SUCCESS = {
  status: "SUCCESS",
  statusCode: 0,
  msg: "SUCCESS"
};

const DUPLICATE_ENTRY = {
  status: "DUPLICATE_ENTRY",
  statusCode: 1,
  msg: "Record Already exists"
};

const INSUFFICIENT_PARAMETERS = {
  status: "INSUFFICIENT_PARAMETERS",
  statusCode: 2,
  msg: "Parameters missing"
};

const ZERO_LENGTH_PARAMETER = {
  status: "ZERO_LENGTH_PARAMETER",
  statusCode: 3,
  msg: "Parameter length cannot be 0"
};

const ENTRY_NOT_FOUND = {
  status: "ENTRY_NOT_FOUND",
  statusCode: 4,
  msg: "Entry Does not Exists"
};

const INVALID_PARAMETERS = {
  status: "INVALID_PARAMETERS",
  statusCode: 5,
  msg: "Invalid Parameters"
};

const UNKNOWN_CAUSE = {
  status: "UNKNWON_CAUSE",
  statusCode: 100,
  msg: "Error Occured due to unkwown casue , please contact team"
};

successMsg = function (_msg) {
  var status = SUCCESS;
  status.msg = _msg;
  return status;
};

entryNotFoundMsg = function (_msg) {
  var status = ENTRY_NOT_FOUND;
  status.msg = _msg;
  return status;
};

insufficientParameterMsg = function (_msg) {
  var status = INSUFFICIENT_PARAMETERS;
  status.msg = _msg;
  return status;
};

invalidParameteresMsg = function (_msg) {
  var status = INVALID_PARAMETERS;
  status.msg = _msg;
  return status;
};

duplicateEntryMsg = function (_msg) {
  var status = DUPLICATE_ENTRY;
  status.msg = _msg;
  return status;
};

module.exports = {
  SUCCESS: SUCCESS,
  DUPLICATE_ENTRY: DUPLICATE_ENTRY,
  INSUFFICIENT_PARAMETERS: INSUFFICIENT_PARAMETERS,
  ZERO_LENGTH_PARAMETER: ZERO_LENGTH_PARAMETER,
  ENTRY_NOT_FOUND: ENTRY_NOT_FOUND,
  INVALID_PARAMETERS: INVALID_PARAMETERS,
  UNKNWON_CAUSE: UNKNOWN_CAUSE,
  successMsg: successMsg,
  entryNotFoundMsg: entryNotFoundMsg,
  duplicateEntryMsg: duplicateEntryMsg,
  insufficientParameterMsg: insufficientParameterMsg,
  invalidParameteresMsg: invalidParameteresMsg
};