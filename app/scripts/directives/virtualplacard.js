'use strict';

/**
 * @ngdoc directive
 * @name utxoPmc.directive:virtualPlacard
 * @description
 * # virtualPlacard
 *
 * Microservice authorization directive for acceptance of contacts.
 */
angular.module('utxoPmc')
  .directive('virtualPlacard', function ($location, person, crypto, authentication) {

    return {
      restrict: 'A',
      templateUrl: '/static/virtual-placard.html',
      controller: function ($scope) {

        $scope.loaded = false;
        $scope._id = null;

      },
      link: function postLink($scope, element, attrs) {

        $scope.acceptDiscoveredLocation = function () {
          /**
           *
           * @description
           * @inner acceptDiscoveredLocation
           *
           */
          $location.path('/refNumber');
          $location.replace();
        };

        $scope._loadRefNumber = function () {
          /**
           * @description
           *
           * Authorization initialization.
           */
          authentication.loadSession().then(function () {
            if (person && person.current && person.current.$id) {
              $scope._id = person.current.$id;
            }

            if (person && person.current && person.current.data && person.current.data.data) {
              $scope._id = person.current.data.data.name;
            }

            if (person.current && person.current.order)
              person.current.order.cheesed = 'true';
            var l = person.current.order.timestamp;

            var strategy = {
              handle   : $scope._id,
              property : 'orders' + '/' + crypto.hash(l),
              payload  : person.current.order
            };

            person.order(strategy).then(function (orderData) {
              var d = orderData.data.data;
              var h = {};
              var _h = crypto.hash(d.timestamp);
              h[_h] = d;
              if (_.size(person.current.orders) > 0) {
                person.current.orders = _.merge({}, person.current.orders, h);
              } else {
                // First order.
                person.current.orders = _.extend({}, h);
              }

              try {
                analytics.track('New Order - Banked the Cheese', {
                  location: 'form',
                  type: 'ng-submit'
                });
              } catch (e) {
                console.log(e);
              }

              $scope.loaded = true;

            }, function (errorData) {

              try {
                analytics.track('New Order - Error (Banked the Cheese)', {
                  location: 'form',
                  type: 'ng-submit'
                });
              } catch (e) {
                console.log(e);
              }

              $scope.loaded = true;

            });

          });
        };

        $scope._loadRefNumber();
      }
    };
  })
  .directive('cheeseCounter', function ($location, person, authentication, $timeout) {
    return {
      restrict: 'A',
      templateUrl: '/static/cheese-counter.html',
      require: '^virtualPlacard',
      link: function postLink($scope, element, attrs) {

        var cachedPerson = person.current;
        $scope.loaded = false;

        authentication.loadSession().then(function (sessionPerson) {
          var t = null;
          if (!cachedPerson || cachedPerson.order !== null) {
            t = (cachedPerson.order.updated__time) ? cachedPerson.order.updated__time : cachedPerson.order.timestamp;
          } else {
            t = (sessionPerson.order.updated__time) ? sessionPerson.order.updated__time : sessionPerson.order.timestamp;
          }

          var modifiedCountdownBase = ( new Date(t)).getTime() + 2700000;

          $('.cheese--countdown')
            .countdown(modifiedCountdownBase, {
              elapse: true
            })
            .on('update.countdown', function(event) {
              var $this = $(this);
              var expired = false;

              $scope.loaded = true;

              $scope.duration = event.strftime('%M:%S');

              $this.html($scope.duration);
            });

        });

      }
    }
  });
