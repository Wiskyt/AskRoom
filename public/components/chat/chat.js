"use strict";

var app = angular.module("askroom");

app.component("chat", {
    templateUrl: "components/chat/chat.html",
    controller: Chat
});

function Chat($scope, $resource) {
    var _this = this;

    //  $scope.test = "Yo mon pote"; 

    var socket = io("http://localhost:3000");

    socket.on("connect", function() {
        console.log("Socket connectd");
        var msg = { author: "Wiskyt", message: "Yo les noobs" }; // Example chat message

        // to make things interesting, have it send every second
        var interval = setInterval(function() {
            socket.emit("chat message", msg); // send msg with indicatif 'chat message'
            console.log("Message sent");
        }, 1000);

        socket.on("chat message", function(obj) { // Lorsque l'on recois un chat message
            console.log("Received", obj); // on affiche l'obj passé
        });

        socket.on("disconnect", function() {
            clearInterval(interval);
        });
    });
}