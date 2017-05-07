"use strict";

var app = angular.module("askroom");

app.component("queue", {
    templateUrl: "components/queue/queue.html",
    controller: Queue
});

function Queue($scope, $resource, socket) {

    var _this = this;

    this.chatHistory = [];


    socket.on("new question", function(obj) { // Lorsque l'on recois un chat message
        _this.chatHistory.push(obj);
    });


    socket.on("disconnect", function() {
        clearInterval(interval);
    });

    $scope.hoverIn = function() {
        this.hoverEdit = true;
    };

    $scope.hoverOut = function() {
        this.hoverEdit = false;
    };

}