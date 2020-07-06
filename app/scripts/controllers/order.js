'use strict';

/**
  * @ngdoc function
  * @name utxoPmc.controller:OrderCtrl
  * @description
  * # OrderCtrl
  * Controller of the utxoPmc
 */
angular.module('utxoPmc').controller('OrderCtrl', function($scope, person, $location, $timeout, authentication, $routeParams, $window) {
  $scope.person = null;
  $scope.loaded = false;
  if (!$routeParams.id) {
    return;
  }

  if (person && person.current && person.current.data && person.current.data.data) {
    $scope._id = person.current.data.data.name;
  }

  var portSpec = $window.location.port != "" ? (':' + $window.location.port) : '';
  var hostname = $window.location.hostname + portSpec;

  console.log($routeParams);

  $scope.updatePerson = function (_person) {
    $timeout(function () {
      $location.path('/215392070d0af07833020abdafc605d1821912b3');
    }, 2000);
  };

  authentication.loadSession($routeParams.id).then(function (currentPersonWithOrder) {
    var _currentPersonWithOrder = currentPersonWithOrder;
    console.dir(_currentPersonWithOrder);
    var _personCurrent = _currentPersonWithOrder || person.current;

    $timeout(function () {

      if ($routeParams.type == 'retake-selfie') {
        $location.path('/takeSelfie');
      }

      $scope.$apply(function () {
        $scope.person = _personCurrent;
        $scope.loaded = true;
      });
    }, 0);
  });
});
