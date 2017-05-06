"use strict";

var app = angular.module("askroom");

app.component("room", {
    templateUrl: "views/room/room.html",
    controller: Room
});

function Room($scope, $resource) {
    var _this = this;

    $scope.test = "Yo mon pote";
}