var express = require('express');
var app = express();
var session = require('express-session');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// var DB = require('./server/database');
// DB.connect();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(socket) { // Lorsqu'une connexion socket est crée on initialie les events
    console.log("Nouvel user");

    socket.on("chat message", function(obj) {
        if (obj.author && obj.message) {
            io.emit("chat message", obj);
        }
    });
});

server.listen(3000);

// Routes
var routes = require('./server/routes/index');
// var usersRoute = require('./server/routes/usersRoute');
// var getRoute = require('./server/routes/getRoute');
// var postRoute = require('./server/routes/postRoute');

// BodyParser middleware
app.use(cookieParser());
app.use(bodyParser.json());

// Express session
app.use(session({
    secret: 'reallysecret',
    saveUninitialized: true,
    resave: true
}));

// // Passport init
// var passport = require('passport'),
//     LocalStrategy = require('passport-local').Strategy;

// app.use(passport.initialize());
// app.use(passport.session());

// Serving static folder
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

// -------------------------------------------------------

app.use('/', routes);

app.listen(7077, function() {
    console.log('Listening on port 7077!');
});