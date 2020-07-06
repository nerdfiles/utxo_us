'use strict';

/**
 * @ngdoc directive
 * @name utxoPmc.directive:customEnter
 * @description
 * # customEnter
 */
angular.module('utxoPmc')
  .directive('customEnter', function () {
    return {
      restrict: 'A',
      link: function postLink($scope, element, attrs) {
        element.bind("keyup", function (e) {
          if (e.which === 13) {
              $scope.$apply();
              $scope.$eval(attrs.customEnter);
              return
          }

          e.preventDefault()
        });
      }
    };
  });

