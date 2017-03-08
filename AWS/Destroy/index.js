exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    var db = require("./models");
    var User = db.User;
    User.destroy({
        where: {
            auth0Key: event.params.id
        }
    }).then(function(results) {
        callback(null, results);
    }).catch(function(err) {
        console.log(err);
    });
};
