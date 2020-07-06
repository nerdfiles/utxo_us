'use strict';

/**
 * @ngdoc function
 * @name utxoPmc.controller:GenericerrorCtrl
 * @description
 * # GenericerrorCtrl
 * Controller of the utxoPmc
 */
angular.module('utxoPmc')
  .controller('GenericerrorCtrl', function ($scope, person) {
    $scope.person = person;
  });
