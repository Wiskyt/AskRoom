"use strict";

var app = angular.module("askroom");

app.component("room", {
    templateUrl: "views/room/room.html",
    controller: Room
});

function Room($scope, $resource, socket) {
    var _this = this;
    //  this.chatHistory = [];

    //  var typicalChat = { author: "Wiskyt", message: "yo les noobs" };
    //  var typicalQuestion = { id: 0, author: "Wiskyt", content: "Comment devisser un tuyau d'arrosage ?" };
    //  var typicalAnswer = { id: 0, questionId: 0, author: "Wiskyt", content: "Va voir sur google" };
    //  var typicalUpvote = { questionId: 0, answerId: 0 };


    //  socket.emit("chat message", typicalChat); // on envoie un msg
    //  socket.emit("new question", typicalQuestion); // on envoie une new question


    //  socket.on("chat message", function(obj) { // on recois un msg
    //      console.log("CM Received", obj.author);
    //      _this.chatHistory.push(obj);
    //  });

    //  socket.on("new question", function(obj) {
    //      console.log("NQ Received", obj);

    //      socket.emit("question answer", typicalAnswer);
    //  });

    //  socket.on("question answer", function(obj) {
    //      console.log("QA Received", obj);
    //      socket.emit("answer upvote", typicalUpvote);
    //  });

    //  socket.on("answer upvote", function(obj) {
    //      console.log("AU Received", obj);
    //  });

    //  socket.on("disconnect", function() {
    //      clearInterval(interval);
    //  });
}