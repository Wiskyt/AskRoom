"use strict";

var app = angular.module("askroom");

app.component("question", {
    templateUrl: "components/question/question.html",
    controller: Question
});

var question;

function Question($scope, $resource, socket) {
    var _this = this;


    var _this = this;

    socket.on("init question", function(question) {
        swapQuestion(question, _this);
        refreshAnswers(question.answers, _this);
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

function refreshAnswers(newAnswers, context) {
    context.answers = newAnswers;
    //  console.log()
    context.answersLayout = [];

    var rowNumber = newAnswers.length > 6 ? 6 : newAnswers.length;

    var nCells = 1;
    for (let i = 0; i < 3; i++, nCells++) {
        var newArr = [];
        for (let n = 0; n < nCells; n++) {
            var ans = newAnswers.splice(0, 1)[0];
            if (ans) newArr.push(ans);
            else {
                i = 5;
                break;
            }
        }
        console.log(newArr);
        context.answersLayout.push(newArr);
    }
    console.log(context.answersLayout)
}