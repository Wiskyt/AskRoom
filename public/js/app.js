"use strict";

var username = localStorage.getItem('username');
if (!username) {
    localStorage.setItem('username', prompt("Username"));
}

var app = angular.module("askroom", ["ui.router", "ngResource", "ngAnimate"]);

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
        },
        {
            name: "chat",
            url: "/chat",
            component: "chat"
        }, {
            name: "question",
            url: "/question",
            component: "question"
        }, {
            name: "queue",
            url: "/queue",
            component: "queue"
        }
    ];

    $urlRouterProvider.otherwise("/room"); // Page par défaut
    states.forEach(function(state) {
        $stateProvider.state(state);
    });
});

app.factory('socket', function($rootScope) {
    var socket = io.connect("http://localhost:3000");
    return {
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});