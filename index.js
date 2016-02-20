var domain = require("domain");
var fs = require("fs");
var express = require('express');
var cors = require('cors');
var errorHandler = require('errorhandler');
var morgan = require('morgan');
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var compression = require('compression');
var logger = require("neg-log4node");
var faq = require('faq');
var negUtil = require("neg-util");

var loadRoutes = function(routePath, app){
  fs.readdirSync(routePath).forEach(function(file) {
    var newPath, stat;
    newPath = routePath + "/" + file;
    stat = fs.statSync(newPath);
    if (stat.isFile()) {
      if (/(.*)\.(js$)/.test(file)) {
        return require(newPath)(app);
      }
    }
  });
}

var loadMiddleware = function(config){
  logger.configure(config.logConfig);
  if(config.errorTitle){
    errorHandler.title = config.errorTitle;
  }

  var app = express();
  app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));
  app.use(bodyParser.json({limit: '10mb'}));
  app.use(methodOverride());
  app.use(cors(config.corsOption));
  app.use(morgan(config.consoleFormat));
  app.use(compression());

  if(config.beforeLoadRoute && negUtil.is("Function", config.beforeLoadRoute)){
    config.beforeLoadRoute(app);
  }
  app.use(faq(config.faqOption));
  loadRoutes(config.routePath, app);

  app.use(errorHandler({log: logger.apiError}));

  return app;
}

exports.startServer = function(options, callback){
  var opt = options || {};

  if(!opt.logConfig){
    throw new Error("Please provide log configuration.");
  }

  if(!opt.routePath){
   throw new Error("Please provide route folder."); 
  }

  opt.port = opt.port || 8001;

  opt.consoleFormat = opt.consoleFormat || "short";

  opt.errorTitle = opt.errorTitle || "Rest Express"

  var app = loadMiddleware(opt);

  process.on("uncaughtException", function(err){
    logger.error(err, true);
  });

  var server = app.listen(opt.port, function(){
    logger.debug("[" + process.pid + "] Begin listening on port " + opt.port);
    if(callback){
      callback(server, app);  
    }
  });
}