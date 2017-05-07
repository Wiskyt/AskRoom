"use strict";

var app = angular.module("askroom");

app.component("question", {
    templateUrl: "components/question/question.html",
    controller: Question
});

function Question($scope, $resource, socket) {
    var _this = this;

}