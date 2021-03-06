var request = require("request");
var os = require("os");
var path = require("path");
var util = require('util');
var common = require('./common');
var apiLogConfig;
var inspect = util.inspect
var debuglog = util.debuglog('rexpress');

var error = function(args){
  debuglog(args);
};

var warn = function(args){
  debuglog(args);
};

var info = function(args){
  debuglog(args);
};

var debug = function(args){
  debuglog(args);
};

var trace = function(args){
  debuglog(args);
};

exports.configure = function(options){
  if (options.apiLog){
    if(!options.apiLog.uri){
      throw new Error("Log API URI is required.");
    }
    apiLogConfig = {
      uri: options.apiLog.uri,
      global: options.apiLog.global || "auto",
      local: options.apiLog.local || "auto",
      category: options.apiLog.category || "auto",
      userName: options.apiLog.user || "system",
      host: options.apiLog.host || ""
    };

  }
};

exports.info = function(){
  var options = parseArgs(arguments);
  info(options.content);
  if(options.isApi){
    writeApiLog(options.content, "I");
  }
};

exports.log = exports.debug = function(){
  var options = parseArgs(arguments);
  debug(options.content);
  if(options.isApi){
    writeApiLog(options.content, "D");
  }
};

exports.trace = function(){
  var options = parseArgs(arguments);
  trace(options.content);
  if(options.isApi){
    writeApiLog(options.content, "T");
  }
};

exports.warn = function(){
  var options = parseArgs(arguments);
  warn(options.content);
  if(options.isApi){
    writeApiLog(options.content, "A");
  }
};

exports.error = function(){
  var options = parseArgs(arguments);
  error(options.content);
  if(options.isApi){
    writeApiLog(options.content);
  }
};

var writeApiLog = exports.apiError = function(err, logType) {
  if(err.ignoreApi){
    error(err);
    return;
  }
  
  var options = getLogApiOption();
  var a = Array.prototype.slice.call(arguments);
  if(a.length === 2){
    logType = logType || "E"
  }
  else{
    logType = "E"
  }
  var logEntry = {
    CategoryName: apiLogConfig.category,
    GlobalName: apiLogConfig.global,
    LocalName: apiLogConfig.local,
    LogType: logType,
    LogServerIP: apiLogConfig.host || common.getLocalIP(),
    LogUserName: apiLogConfig.userName,
    Content: common.stringify(err)
  };
  try{
    options.body = JSON.stringify(logEntry);
  }catch(err2){
    error(err2);
  }
  request(options, function(err3, response, body) {
    if (err3 || response.statusCode >= 400) {
      error("Write API Log failed");
      var msg = err3 ? err3 : body;
      error(msg);
    }
  });
};

var parseArgs = function(args){
  var a = Array.prototype.slice.call(args);
  if(a.length === 0){
    throw new Error("Log content is required.")
  }
  else{
    var options = {};
    options.content = a[0];
    if(a.length === 2 && common.is("Boolean", a[1])){
      options.isApi = a[1];
    }
    return options;
  }
};

var getLogApiOption = function(){
  if(!apiLogConfig){
    throw new Error("Please provider log API url");
  }
  var options = {
    method: "POST",
    url: apiLogConfig.uri,
    headers: {
      "accept": "application/json",
      "content-type": "application/json"
    }
  }
  return options;
};

