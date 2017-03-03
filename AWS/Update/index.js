exports.handler = (event, context, callback) => {
    var db = require("./models");
    db.sequelize.sync();
    var User = db.User;
    context.callbackWaitsForEmptyEventLoop = false;
    User.update({wins: event["body-json"].wins, losses: event["body-json"].losses}, {where: {auth0Key: event.params.id}} )
        .then(function(results) {
           callback(null, results);
        })
        .catch(function(err) {
           callback(null, "err");
        });

}
