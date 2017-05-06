"use strict";
var app = angular.module("askroom", ["ui.router", "ngResource"]);

app.config(function($stateProvider, $urlRouterProvider) {
    var states = [{
            name: "home",
            url: "/home",
            component: "home"
        },
        {
            name: "room",
            url: "/room",
            component: "room"
        }
    ];
    $urlRouterProvider.otherwise("/room"); // Page par défaut
    states.forEach(function(state) {
        $stateProvider.state(state);
    });
});