   "use strict";

   var app = angular.module("askroom");

   app.component("question", {
       templateUrl: "components/question/question.html",
       controller: Question
   });

   var question;

   function Question($scope, $resource, socket) {
       var _this = this;
       this.histo = [];

       socket.on("init question", function(question) {
           swapQuestion(question, _this);

           _this.histo = question.answers;
           refreshAnswers(_this);
       });

       socket.on("next question", function(nextQuestion) {
           console.log(nextQuestion);
           swapQuestion(nextQuestion, _this);
       });

       socket.on("question answer", function(answer) {
           _this.histo.push(answer);

           console.log(_this);
           refreshAnswers(_this);
       });
   }

   function swapQuestion(newQuestion, context) {
       question = newQuestion;

       // Effectuer animations et transitions

       context.author = newQuestion.author;
       context.content = newQuestion.content;
   }

   function refreshAnswers(context) {
       console.log(context);
       //  console.log()
       context.answersLayout = [];
       console.log("BASE", context.histo);
       var rowNumber = context.histo.length > 6 ? 6 : context.histo.length;

       var nCells = 1;
       for (let i = 0; i < 3; i++, nCells++) {
           var newArr = [];
           for (let n = 0; n < nCells; n++) {
               var ans = context.histo[nCells];
               nCells++;
               if (ans) newArr.push(ans);
               else {
                   i = 3;
                   break;
               }
           }
           context.answersLayout.push(newArr);
       }
       console.log("LAYOUT", context.answersLayout);
   }