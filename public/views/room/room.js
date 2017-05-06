"use strict";

var app = angular.module("askroom");

app.component("room", {
    templateUrl: "views/room/room.html",
    controller: Room
});

function Room($scope, $resource) {
    var _this = this;

    $scope.test = "Yo mon pote";

    var socket = io("http://localhost:3000");

    socket.on("connect", function() {
        console.log("lets go");
        var msg = { author: "Wiskyt", message: "Yo les noobs" };

        // to make things interesting, have it send every second
        var interval = setInterval(function() {
            socket.emit("chat message", msg);
            console.log("on est la");
        }, 1000);

        socket.on("chat message", function(obj) {
            console.log("Received", obj);
        });

        socket.on("disconnect", function() {
            clearInterval(interval);
        });
    });
}