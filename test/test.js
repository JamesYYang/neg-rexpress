var rexpress = require("../");

var logOption = {
    apiLog: {
      uri: "http://10.16.75.24:3000/framework/v1/log-entry",
      global: "TestGlobal",
      local: "TestLocal",
      category: "Exception"
    }
  };

var routePath = __dirname + "/routes";

var options = {
  logConfig: logOption,
  routePath: routePath,
  port: 8003,
  consoleFormat: "dev",
  errorTitle: "Test App"
};

rexpress.startServer(options, function(server, app){
  
})