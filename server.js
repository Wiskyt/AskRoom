var express = require('express');
var app = express();
var session = require('express-session');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// var DB = require('./server/database');
// DB.connect();

var date = new Date();

var typicalQuestion = { id: 0, author: "Wiskyt", content: "Comment devisser un tuyau d'arrosage ?" };
var typicalAnswer = { id: 0, questionId: 0, author: "Wiskyt", content: "Va voir sur google" };
var questions = [];
// for (let i = 0; i < 5; i++) questions.push(typicalQuestion);

var chatHistory = [],
   chatHistoryLength = 500,
   chatId = 0;

// ---------------------------- SOCKETS
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function (socket) { // Lorsqu'une connexion socket est crée on initialie les events
   console.log("Nouvel user");

   socket.on("chat message", function (chatMsg) {
      if (chatMsg.author && chatMsg.message) {
         chatMsg.id = chatId;
         chatId++;
         chatHistory.push(chatMsg);
         if (chatHistory.length > chatHistoryLength) chatHistory.shift();
         io.emit("chat message", chatMsg);
      }
   });

   socket.on("new question", function (newQuestion) {
      if (newQuestion.author && newQuestion.content) {
         newQuestion.date = date.getTime();
         newQuestion.id = questions.length;
         io.emit("new question", newQuestion);

         newQuestion.answers = [];
         questions.push(newQuestion);
      }
   });

   socket.on("question answer", function (questionAnswer) {
      if (questionAnswer.hasOwnProperty("questionId") && questionAnswer.author && questionAnswer.content) {
         let question = getQuestion(questionAnswer.questionId);
         console.log(question);
         questionAnswer.id = question.answers.length;
         question.answers.push(questionAnswer);
         io.emit("question answer", questionAnswer);
      }
   });

   socket.on("answer upvote", function (upvoteInfo) {
      if (upvoteInfo.hasOwnProperty("questionId") && upvoteInfo.hasOwnProperty("answerId")) {
         let answer = getAnswer(upvoteInfo.questionId, upvoteInfo.answerId);
         if (answer) {
            answer.upvotes++;
            io.emit("answer upvote", upvoteInfo);
         }
      }
   });
});

setInterval(function () {
   console.log("Question switch ! State : ", questions);
   if (questions[0]) {
      io.emit("next question", questions[0]);
      var questionSave = questions.shift();
   }
}, 10 * 1000); // 60 seconds

server.listen(3000);

function getQuestion(id) {
   return questions[questions.map(function (q) { return q.id; }).indexOf(id)] || null;
}

function getAnswer(answerId, questionId) {
   let q = getQuestion(questionId);
   return q.answers[q.answers.map(function (a) { return a.id; }).indexOf(answerId)] || null;
}

// FIN SOCKETS ------------------------

// Routes
var routes = require('./server/routes/index');
// var usersRoute = require('./server/routes/usersRoute');

// BodyParser middleware
app.use(cookieParser());
app.use(bodyParser.json());

// Express session
app.use(session({
   secret: 'reallysecret',
   saveUninitialized: true,
   resave: true
}));

// Serving static folder
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

// -------------------------------------------------------

app.use('/', routes);

app.listen(7077, function () {
   console.log('Listening on port 7077!');
});