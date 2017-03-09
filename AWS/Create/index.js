exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    var db = require('./models');
    var User = db.User;
    User.create(event["body-json"])
        .then(function(results) {
            callback(null, results);
        })
        .catch(function(err) {
            //db.sequelize.close();
            console.log(err);
        });

}
