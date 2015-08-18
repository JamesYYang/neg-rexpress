module.exports = function(app){
  app.get("/hello", function(req, res, next){
    res.end("Hello World!");
  });

  app.get("/error", function(req, res, next){
    next(new Error("Here is error...."));
  });
}