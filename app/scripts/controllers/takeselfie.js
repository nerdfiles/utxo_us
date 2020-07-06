'use strict';

/**
 * @ngdoc function
 * @name utxoPmc.controller:TakeselfieCtrl
 * @description
 * # TakeselfieCtrl
 * Controller of the utxoPmc
 */
angular.module('utxoPmc')
  .controller('TakeselfieCtrl', function ($scope, person, $location) {
    $scope.person = person.current;
    console.dir($scope.person);
    $scope.updatePerson = function (_person) {
      $location.path('/takeSelfieConfirm');
    };

  });
