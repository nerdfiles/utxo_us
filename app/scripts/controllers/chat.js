'use strict';
/**
 * @ngdoc function
 * @name utxoPmc.controller:ChatCtrl
 * @description
 * # ChatCtrl
 *
 * Unused at the moment.
 */
angular.module('utxoPmc')
  .controller('ChatCtrl', function ($scope, Ref, $firebaseArray, $timeout) {

    function _alert(msg) {
      $scope.err = msg;
      $timeout(function() {
        $scope.err = null;
      }, 5000);
    }

    $scope.messages = $firebaseArray(Ref.child('messages').limitToLast(10));

    $scope.messages.$loaded()['catch'](_alert);

    $scope.addMessage = function(newMessage) {
      if( newMessage ) {
        $scope.messages.$add({text: newMessage})['catch'](_alert);
      }
    };

  });
