//read
exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    var db = require('./models');
    var User = db.User;
    if(!event.params) {
        User.findAll({raw: true})
        .then(function(results) {
            callback(null, results);
        });
        .catch(function(err) {
            console.log(err);
            // db.sequelize.close();
        });
    } else {
        User.findOne({
            where: {
                auth0Key: event.params.id
            },
            raw: true,
        }).then(function(results) {
            callback(null, results);
        }).catch(function(error) {
            console.log(error);
            // db.sequelize.close();
        });
    }
}

