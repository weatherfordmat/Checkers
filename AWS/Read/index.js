//read
exports.handler = (event, context, callback) => {
    var db = require('./models');
    db.sequelize.sync();
    var User = db.User;
    context.callbackWaitsForEmptyEventLoop = false;
    if(!event.params) {
        User.findAll({raw: true})
        .then(function(results) {
            callback(null, results);
        })
        .catch(function(err) {
            db.sequelize.close();
        })
    } else {
        User.findOne({
            where: {
                auth0Key: event.params.id
            },
            raw: true,
        }).then(function(results) {
            callback(null, results);
        }).catch(function(error) {
            db.sequelize.close();
        });
    }
}

