"use strict";

var app = angular.module("askroom");

app.component("chat", {
    templateUrl: "components/chat/chat.html",
    controller: Chat
});

function Chat($scope, $resource, socket) {
    var _this = this;
    this.chatHistory = [];

    this.sendMessage = function() {
        var obj = {};
        obj.author = localStorage.getItem("username");
        obj.message = this.query;
        console.log(obj);
        socket.emit("chat message", obj);
    }

    socket.on("chat message", function(obj) { // Lorsque l'on recois un chat message
        _this.chatHistory.push(obj);
    });

    socket.on("disconnect", function() {
        clearInterval(interval);
    });
}