var express = require('express');
var bodyParser = require('body-parser'); //json stuff;
var app = express();
var path = require('path');
var axios = require('axios');
var cookieParser = require('cookie-parser'); //auth0;
var Auth0Strategy = require('passport-auth0');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn(); //determining if logged in or not;
var passport = require('passport'); //auth0 background
var session = require('express-session');
var keys = require('./public/assets/js/constants');
var PORT = process.env.PORT || 8080;

//initialize AUth0 object;
var strategy = new Auth0Strategy({
    domain: keys.domain,
    clientID: keys.clientID,
    clientSecret: keys.clientSecret,
    callbackURL: 'https://arcademania.herokuapp.com/user'
}, function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
});

var env = {
    AUTH0_CLIENT_ID: keys.clientID,
    AUTH0_DOMAIN: keys.domain,
    AUTH0_CALLBACK_URL: 'https://arcademania.herokuapp.com/user'
};

passport.use(strategy);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.use(session({
    secret: 'shhhhhhhhh',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(cookieParser());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));


app.all('/', function(req, res) {
    res.redirect('/home');
});

app.use('/home', express.static(path.join(__dirname, 'public')));

function post(req) {
    axios.post('https://4qcth52o74.execute-api.us-east-1.amazonaws.com/Test1/api', {
            "name": req.user.nickname,
            "picture": req.user.picture_large ? req.user.picture_large : req.user.picture,
            "auth0Key": req.user.id.replace('auth0|', '').replace('facebook|', '').replace('google-oauth2|', '')
        })
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
    });
}

app.get('/user', ensureLoggedIn, function(req, res, next) {
    app.set('views', path.join(__dirname, 'public/assets/js/views'));
    app.set('view engine', 'jade');
    //insert into database;
    var id = req.user.id.replace('auth0|', '').replace('facebook|', '').replace('google-oauth2|', '') ? req.user.id.replace('auth0|', '').replace('facebook|', '').replace('google-oauth2|', '') : '';
    var url = 'https://4qcth52o74.execute-api.us-east-1.amazonaws.com/Test1/api/' + id;
    axios.get(url)
        .then(function(response) {
            if(!response.data) {
                post(req);
            } else {
                console.log("Data Already In DB");
            }
        })
        .catch(function(error) {
            console.log(error);
        });
    res.render('user', { user: req.user });
});

app.get('/login', function(req, res, next) {
    app.set('views', path.join(__dirname, 'public/assets/js/views'));
    app.set('view engine', 'jade');
    res.render('login', { env: env });
});

app.get('/scores', function(req, res) {
    var url = "https://4qcth52o74.execute-api.us-east-1.amazonaws.com/Test1/api/";
    axios.get(url).then(function(response) {
           app.set('views', path.join(__dirname, 'public/assets/js/views'));
           app.set('view engine', 'jade');
           res.render('scores', { users: response.data });
        })
        .catch(function(error) {
            console.log(error);
        });
});

app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/callback', passport.authenticate('auth0', { failureRedirect: '/user' }),
    function(req, res) {
        res.redirect(req.session.returnTo || '/user');
});

app.get('/*', function(req, res,next) {
    var err = new Error('Not Found');
    err.status = 404;
    app.set('views', path.join(__dirname, 'public/assets/js/views'));
    app.set('view engine', 'jade');
    res.render('error', {
        message: "Page Not Found",
        error: {err}
    });
});

app.listen(PORT, function() {
    console.log("Listening on PORT " + PORT);
});
