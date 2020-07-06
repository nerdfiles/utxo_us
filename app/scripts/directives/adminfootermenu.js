'use strict';

/**
 * @ngdoc directive
 * @name utxoPmc.directive:adminFooterMenu
 * @description
 * # adminFooterMenu
 */
angular.module('utxoPmc')
  .directive('adminFooterMenu', function ($timeout, $window) {
    return {
      restrict: 'A',
      templateUrl: '/static/admin-footer-menu.html',
      link: function postLink($scope, element, attrs) {
        var portSpec = $window.location.port != "" ? (':' + $window.location.port) : '';
        var pathname = $window.location.pathname;
        console.log(pathname);
        var a = $window.location.hostname + portSpec + pathname + '../#/';
        $scope.baseUrl = $window.location.protocol + '//' + a;

        $timeout(function () {
          $scope.$apply(function () {
            $(".button-collapse").sideNav({
              closeOnClick: function () {
                return true;
              }
            });

            $timeout(function () {
              var mobileNav = angular.element('#mobile').find('a');
              //console.log(mobileNav);
              mobileNav.on('click', function () {
                $('#sidenav-overlay').fadeOut().remove();
                mobileNav.eq(0).off('click');
              });
            }, 1000);

          });
        });

        //element.text('this is the adminFooterMenu directive');
      }
    };
  });
