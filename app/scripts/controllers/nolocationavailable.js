'use strict';

/**
 * @ngdoc function
 * @name utxoPmc.controller:NolocationavailableCtrl
 * @description
 * # NolocationavailableCtrl
 * Controller of the utxoPmc
 */
angular.module('utxoPmc')
  .controller('NolocationavailableCtrl', function ($scope, person, $location, $geolocation, authentication, localStorageService) {

    $scope.person = person.current;
    $scope.sendDirections = function () {
      /**
        * @input person.order.physical_address
        */
      person.current.locationProvided = true;
      //authentication.loadSession().then(function () {
      var pa = localStorageService.get('pa');
      if (!pa) {
        pa = localStorageService.set('pa', $scope.person.order.physical_address);
      }
      person.current = $scope.person;
      $location.path('/mapView');

      //});
    };

  });
