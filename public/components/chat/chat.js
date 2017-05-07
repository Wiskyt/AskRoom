"use strict";

var app = angular.module("askroom");

app.component("chat", {
    templateUrl: "components/chat/chat.html",
    controller: Chat
});

function Chat($scope, $resource, socket) {
    var _this = this;

    //  $scope.test = "Yo mon pote"; 
    this.chatHistory = [];


    var msg = { author: "Wiskyt", message: "Yo les jjjj" }; // Example chat message

    // to make things interesting, have it send every second
    var interval = setInterval(function() {
        socket.emit("chat message", msg); // send msg with indicatif 'chat message'
        console.log("Message sent");
    }, 3000);

    socket.on("chat message", function(obj) { // Lorsque l'on recois un chat message
        _this.chatHistory.push(obj);
        //console.log(obj);
        // console.log(_this.chatHistory);

        //  console.log("Received", obj); // on affiche l'obj passé

    });

    socket.on("disconnect", function() {
        clearInterval(interval);
    });

}