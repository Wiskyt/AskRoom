"use strict";

var app = angular.module("askroom");

app.component("queue", {
    templateUrl: "components/queue/queue.html",
    controller: Queue
});

function Queue($scope, $resource, socket) {

    console.log("on est la");
    var _this = this;

    //  $scope.test = "Yo mon pote"; 
    this.chatHistory = [];

    var msg = { author: "Wiskyt", message: "Yo les gars ca va man ? t'estdefoncerman? mecamecamecanichienmemecamichienmecacamecacamemecamechien" }; // Example chat message

    // to make things interesting, have it send every second
    var interval = setInterval(function() {
        socket.emit("chat message", msg); // send msg with indicatif 'chat message'
        console.log("Message sent");
    }, 3000);

    socket.on("chat message", function(obj) { // Lorsque l'on recois un chat message
        _this.chatHistory.push(obj);

        console.log("Received", obj); // on affiche l'obj passé
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