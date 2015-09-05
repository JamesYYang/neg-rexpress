# rexpress

Help to build rest api base on express.

This is library is only intended to be used in newegg corp.

## Install

```sh
$ npm install neg-rexpress
```

## How to Use

```js
var rexpress = require("neg-rexpress");

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

var corsOption = {
  exposedHeaders: "x-token"
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
```

## License

MIT