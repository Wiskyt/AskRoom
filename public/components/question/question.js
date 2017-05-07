"use strict";

var app = angular.module("askroom");

app.component("question", {
    templateUrl: "components/question/question.html",
    controller: Question
});

var question;

function Question($scope, $resource, socket) {
    var _this = this;

    socket.on("init question", function(question) {
        swapQuestion(question, _this);
    });

    socket.on("next question", function(nextQuestion) {
        swapQuestion(nextQuestion, _this);
    });
}

function swapQuestion(newQuestion, context) {
    question = newQuestion;

    // Effectuer animations et transitions

    context.author = newQuestion.author;
    context.content = newQuestion.content;
}