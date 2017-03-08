exports.handler = (event, context, callback) => {
    var db = require('./models');
    db.sequelize.sync();
    var User = db.User;
    context.callbackWaitsForEmptyEventLoop = false;
    User.create(event["body-json"])
        .then(function(results) {
            callback(null, results);
        })
        .catch(function(err) {
            db.sequelize.close();
        });

}
var event = {
"body-json": {
   "name": "Matt W",
  "picture": "https://not-real-url",
  "auth0Key": "343"
      } 

}
 var db = require('./models');
    db.sequelize.sync();
    var User = db.User;
  User.create(event["body-json"])
        .then(function(results) {
           console.log(results)
        })
        .catch(function(err) {
            db.sequelize.close();
        });