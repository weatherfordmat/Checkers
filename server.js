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
var PORT = process.env.PORT || 8080;

//initialize AUth0 object;
var strategy = new Auth0Strategy({
    domain: 'vdiaz.auth0.com',
    clientID: 'M5MS1HhyesypJiDt8ZveV4E4tOxWFKgn',
    clientSecret: 'h1PdgKF_TnkNNsXwx9EF_deCWnXUa7qv9-rxYDlaAVc4IKsTZWrN0PbrwuPYQlFW',
    callbackURL: 'http://localhost:8080/user'
}, function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
});

var env = {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CALLBACK_URL: 'http://localhost:8080/user'
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

app.use('/home',ensureLoggedIn, express.static(path.join(__dirname, 'public')))

var initial = { "picture": "https://avatars3.githubusercontent.com/u/13956201?v=3&s=460", "nickname": "Matt" }

function post() {
    axios.post('https://4qcth52o74.execute-api.us-east-1.amazonaws.com/Test1/api', {
            "name": req.user.nickname,
            "picture": req.user.picture,
            "auth0Key": id
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
    var id = req.user.id.replace('auth0|', '');
    var url = 'https://4qcth52o74.execute-api.us-east-1.amazonaws.com/Test1/api/' + 2;
    console.log(url);
    axios.get(url)
        .then(function(response) {
            if(response.data) {
                post();
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

//had to proxy our requests through another route to use them;
app.get('/db/users/:user?',ensureLoggedIn, function(req, res) {
    var id = req.params.user ? req.params.user : '';
    var url = "https://4qcth52o74.execute-api.us-east-1.amazonaws.com/Test1/api/" +id;

    axios.get(url).then(function(response) {
          res.json({
            data: response.data
          })
        })
        .catch(function(error) {
            console.log(error);
        });
});

app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/callback', passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
    function(req, res) {
        res.redirect(req.session.returnTo || '/user');
});

app.get('/*', function(req, res, next) {
    app.set('views', path.join(__dirname, 'public/assets/js/views'));
    app.set('view engine', 'jade');
    res.render('error', {
        message: "Page Not Found",
        error: {}
    });
});

app.listen(PORT, function() {
    console.log("Listening on PORT " + PORT);
});
