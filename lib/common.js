'use strict';

var os = require('os');

exports.is = function(type, obj){
  var clas = Object.prototype.toString.call(obj).slice(8, -1);
  return obj != undefined && obj != null && clas === type;
};

exports.getLocalIP = function() {
  var interfaces = os.networkInterfaces();
  for (let k in interfaces) {
    for (let k2 in interfaces[k]) {
      var temp = interfaces[k][k2];
      if (temp.family === "IPv4" && !temp.internal) {
        return temp.address;
      }
    }
  }
};

exports.stringify = function(val) {
  var stack = val.stack;
  if (stack) {
    return String(stack);
  }
  var str = String(val);
  if (str === toString.call(val)) {
    return inspect(val);
  } else {
    return str;
  }
};