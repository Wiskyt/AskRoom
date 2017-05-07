"use strict";

var app = angular.module("askroom");

app.component("room", {
    templateUrl: "views/room/room.html",
    controller: Room
});

function Room($scope, $resource, socket) {
    var _this = this;

    this.postQuestion = function() {
        var obj = {};
        obj.author = localStorage.getItem("username");
        obj.content = this.inputText;
        console.log("pq", obj);
        socket.emit("new question", obj);
    }

    this.postAnswer = function() {
        var obj = {};
        obj.author = localStorage.getItem("username");
        obj.content = this.inputText;
        obj.questionId = 0;
        console.log("pa", obj);
        socket.emit("question answer", obj);
    }
}