"use strict";

var app = angular.module("askroom");

app.component("chat", {
    templateUrl: "components/chat/chat.html",
    controller: Chat
});

function Chat($scope, $resource) {
    var _this = this;

    //  $scope.test = "Yo mon pote"; 
    this.chatHistory = [];

    var socket = io("http://localhost:3000");

    socket.on("connect", function() {
        console.log("Socket connectd");
        var msg = { author: "Wiskyt", message: "Yo les jjjj" }; // Example chat message

        // to make things interesting, have it send every second
        var interval = setInterval(function() {
            socket.emit("chat message", msg); // send msg with indicatif 'chat message'
            console.log("Message sent");
        }, 3000);

        socket.on("chat message", function(obj) { // Lorsque l'on recois un chat message

            //  console.log("Received", obj); // on affiche l'obj passé
            _this.chatHistory.push(obj);

        });

        socket.on("disconnect", function() {
            clearInterval(interval);
        });
        $scope.obj = obj;
    });


}