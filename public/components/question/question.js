   "use strict";

   var app = angular.module("askroom");

   app.component("question", {
       templateUrl: "components/question/question.html",
       controller: Question
   });

   var question;

   function Question($scope, $resource, socket) {
       var _this = this;
       this.answers = [];
       console.log(this.answers);
       socket.on("init question", function(question) {
           console.log("IQ", question);
           swapQuestion(question, _this);

           _this.answers = question.answers;
           refreshAnswers(_this);
       });

       socket.on("next question", function(nextQuestion) {
           swapQuestion(nextQuestion, _this);
       });

       socket.on("question answer", function(answer) {
           _this.answers.push(answer);
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
       //  console.log()
       context.answersLayout = [];
       console.log("BASE", context.answers);
       var rowNumber = context.answers.length > 6 ? 6 : context.answers.length;

       var nCells = 1;
       for (let i = 0; i < 3; i++, nCells++) {
           var newArr = [];
           for (let n = 0; n < nCells; n++) {
               var ans = context.answers.splice(0, 1)[0];
               if (ans) newArr.push(ans);
               else {
                   i = 5;
                   break;
               }
           }
           context.answersLayout.push(newArr);
       }
       console.log("LAYOUT", context.answersLayout);
   }