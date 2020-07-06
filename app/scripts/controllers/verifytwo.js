'use strict';

/**
 * @ngdoc function
 * @name utxoPmc.controller:VerifytwoCtrl
 * @description
 * # VerifytwoCtrl
 * Controller of the utxoPmc
 */
angular.module('utxoPmc')
  .controller('VerifytwoCtrl', function ($scope, person, $location, authentication, segmentio) {
    $scope.person = {};

    $scope._id = null;

    if (person && person.current) {
      $scope._id = person.current.$id;
      $scope.person = person.current;
    }

    if (person && person.current && person.current.data && person.current.data.data) {
      $scope._id = person.current.data.data.name;
    }

    /***
      Test codes for question sets

      Answer            Question
      309 Colver Rd     Which one of the following addresses is associated with you?
      812               Which one of the following area codes is associated with you?
      Jasper            Which one of the following counties is associated with you?
      49230             Which one of the following zip codes is associated with you?
      None of the above What state was your SSN issued in?
      None of the above Which one of the following adult individuals is most closely associated with you?
    ***/

    $scope.question_set = person.current.question_set;
    $scope.question_set_answer_set = {};

    authentication.loadSession().then(function () {

      try {

        if (person && person.current) {
          $scope._id = person.current.data.data.name;
          $scope.person = {};
        }
      } catch (e) {
        console.dir(e);
      }

    }, function () {
      $location.path('/');
    });

    $scope.updatePerson = function (_person) {

      var strategy = {
        handle   : $scope._id,
        property : 'verification',
        payload  : _person['verification']
      };

      person.write(strategy).then(function (personData) {
        var formObject = $scope.question_set_answer_set;
        formObject.id = $scope.question_set.id;
        authentication.score_question_set(formObject).then(function (questionSetResponse) {

          try {
            analytics.track('Passed Question Profile', {
              location: 'form',
              type: 'ng-submit'
            });
          } catch (e) {
            console.dir(e);
          }

          if (questionSetResponse.data && (parseFloat(questionSetResponse.data.score) > 60.0)) {
            person.current.question_set_score = questionSetResponse
            $location.path('/verifyThree');
          } else {
            person.current.questionable = true;
            $location.path('/error');
          }

        }, function (errorData) {
          $location.path('/error');
        });
      }, function (errorData) {
        $location.path('/error');
      });

    };


  });
