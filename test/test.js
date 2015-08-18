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

var faqOption = {
  uri: "/test-faq",
  body: logOption
}

var options = {
  logConfig: logOption,
  routePath: routePath,
  port: 8003,
  faqOption: faqOption,
  consoleFormat: "dev",
  errorTitle: "Test App"
};



rexpress.startServer(options, function(server, app){
  
})