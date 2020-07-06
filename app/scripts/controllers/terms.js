'use strict';

/**
 * @ngdoc function
 * @name utxoPmc.controller:TermsCtrl
 * @description
 * # TermsCtrl
 * Controller of the utxoPmc
 */
angular.module('utxoPmc')
  .controller('TermsCtrl', function ($scope, person, $location, authentication, segmentio, $anchorScroll) {
    $scope.person = person.current;

    $scope._id = null;

    if (person && person.current && person.current.data && person.current.data.data) {
      $scope._id = person.current.data.data.name;
    }

    var initialize = function () {
      /**
       * @inner
       */

      if (person && person.current && person.current.data && person.current.data.data) {
        $scope._id = person.current.data.data.name;
      }

      if (person && person.current) {
        $scope._id = person.current.$id;
        $scope.person = person.current;
      }

      console.log($scope);

    };

    var bail = function () {
      $location.path('/');
    };

    authentication.loadSession().then(initialize, bail).finally(function () {
      var _property = 'overview';
      $scope.$broadcast('authenticated:session:overview', _property);
    });

    $scope.agree = function () {
      /**
       * @description
       * @returns
       */
      $location.hash('agree');
      $anchorScroll();
    };

    $scope.$on('authenticated:session:overview', function (event, section) {

      /**
       * Update Person
       *
       * @description
       * @param _person {object} A loaded person from local sessioin.
       * @returns {undefined}
       */
      $scope.updatePerson = function (_person) {

        $scope.person.overview = {};
        $scope.person.overview.terms = "true";

        if (_person.data && _person.data.data && _person.data.data.name) {
          $scope._id = _person.data.data.name;
        } else {
          $scope._id = person.current.$id;
        }

        var strategy = {
          handle   : $scope._id,
          property : section,
          payload  : $scope.person[section]
        };

        person.write(strategy).then(function (_personData) {

          try {
            analytics.track('Passed Terms', {
              location: 'form',
              type: 'ng-submit'
            });
          } catch (e) {
            console.dir(e);
          }
          console.log(_personData);

          if (!person.current.overview) {
            //person.current.overview = _personData.data.data;
          } else {
            person.current.overview.terms = 'true';
          }
          $location.hash('');
          $location.path('/verifyOne');
        }, function (errorData) {
          $location.path('/error');
          console.log(errorData);
        });

      };
    });

  });
