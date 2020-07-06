'use strict';

/**
 * @ngdoc function
 * @name utxoPmc.controller:MapviewCtrl
 * @description
 * # MapviewCtrl
 * Controller of the utxoPmc
 */
angular.module('utxoPmc')
  .controller('MapviewCtrl', function ($scope, $http, Geocoder, $geolocation, $timeout, person, $window, authentication, $location, $rootScope, map, localStorageService) {

    $scope.person = {};
    $scope.isAfterdark = person.isAfterdark() != true;
    $scope.pageStyle = $scope.isAfterdark ? 'full-height' : '';
    $scope._$map = null;

    $scope.$on('isAfterdark:ready', function () {
    });

    var transactionDetails;
    $scope.passOn = function (position, query) {
      /**
        * @param position Coords, etc.
        */

      var devicePosition;
      $scope.center = {};
      var _position;
      try {
        var resultSet = position.data.results[0];
        _position = {
          lat: resultSet.geometry.location.lat,
          lng: resultSet.geometry.location.lng
        };
      } catch (e) {
        console.log(e);
      }
      try {
        devicePosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      } catch (e) {
        console.log(e);
      }

      try {

        $scope.center.lat = (devicePosition && devicePosition.lat) ? devicePosition.lat : _position.lat;
        $scope.center.lng = (devicePosition && devicePosition.lng) ? devicePosition.lng : _position.lng;
      } catch (e) {
        console.dir(e);
      }

      $scope.person = person.current;

      if ($scope.person.order) {
        transactionDetails = {
          depositSlip      : 'USD' + numeral($scope.person.order.usd).format('0,00') + ' for ' + parseFloat($scope.person.order.btc).toFixed(2) + 'BTC',
          organizationName : 'The CryptoStandard, LLC.',
          routingNumber    : '28-2938',
          accountNumber    : '29849839',
          isAfterdark      : $scope.isAfterdark
        };

      };

      if ($scope.isAfterdark) {
        /**
         * @note Under isAfterdark setting, discovered_address will not be provided.
         */
        person.current.transactionDetails = transactionDetails;
      }

      Geocoder.getPlaces(query, $scope.center, transactionDetails, $scope._$map, person.current.order).then(function (responseData) {

        var mapData = responseData.map;

        var marker = new google.maps.Marker({
          map: mapData,
          position: $scope.center,
          icon: {
            url        : '/static/images/icons/street-view_000000_24.png',
            anchor     : new google.maps.Point(24, 24),
            scaledSize : new google.maps.Size(24, 24)
          }
        });

      });
    };

    angular.element(document).ready(function () {
      $scope._$map = document.querySelector('#map');
      var $map = $($scope._$map);

      $scope.$on('$locationChangeStart', function () {
        $($map).remove();
      });

      $timeout(function () {
        $map.height($window.innerHeight);
        $map.width($window.innerWidth);
      }, 0)
    });

    $scope.$watch('noLocationAvailable', function (newVal, oldVal) {

      if (newVal == true) {
        if ($scope.person.order) {
          transactionDetails = {
            depositSlip      : 'USD' + numeral($scope.person.order.usd).format('0,00') + ' for ' + parseFloat($scope.person.order.btc).toFixed(2) + 'BTC',
            organizationName : 'The CryptoStandard, LLC.',
            routingNumber    : '28-2938',
            accountNumber    : '29849839',
            isAfterdark      : $scope.isAfterdark
          };

        }

        person.current.transactionDetails = transactionDetails;
        $location.path('/noLocationAvailable');
      }

    });

    authentication.loadSession().then(function detailView () {

      //$http.get(environment.rest.maps.index).then(function(mapConstruct) {

      //var data = _.extend({}, mapConstruct.data);
      var query = 'credit+unions+near+Houston+dir+Houston';
      var details
      //var u = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&sensor=true';
      var foundPostalCode = false;
      var foundPostalCodeConstruct = '';
      $geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }).then(function(position) {
        try {
          $http.get(authentication.scrapeUrl + 'position/' + $geolocation.position.coords.latitude + ',' + $geolocation.position.coords.longitude).success(function (data) {
            var _data = data.results;
            _.forEach(_data,function (postalCodeConstruct) {
              var a_c = postalCodeConstruct.address_components;
              _.forEach(a_c, function (ac) {
                if (ac['types'][0] === 'postal_code') {
                  foundPostalCode = true;
                  foundPostalCodeConstruct = ac['short_name'];
                }
              });
            });
            var scrapeUrl = authentication.scrapeUrl + foundPostalCodeConstruct;
            var pa = person.current.order.physical_address ? person.current.order.physical_address : localStorageService.get('pa');
            var pa_test = localStorageService.get('pa');
            var unitedStatesLocationConstruct = null;

            $http.get(scrapeUrl).success(function (responseData) {
              $rootScope.locales = responseData.data;
            }).error(function (errorData) {
              console.log(errorData);
            });
          });
        } catch (e) {
          console.dir(e);
        }
      });

      if ($scope.isAfterdark) {
        $scope.$broadcast('isAfterdark:ready', true);
      }

      $scope.noLocationAvailable = false;
      if (person.current && person.current.order && person.current.order.physical_address) {
        /**
          * Location Provided
          *
          * @input physical_address # Inline unit test for user address entry field.
          * @description Location Provided by the user will trigger the given map route,
          *              and the user will be centered at a Google blessed Geocoded address.
          */
        var pa = person.current.order.physical_address ? person.current.order.physical_address : localStorageService.get('pa');
        var pa_test = localStorageService.get('pa');
        map.Owlish.verifyAddress(pa).then(function (position) {
          $scope.position = position;
          $scope.passOn(position, query);
        });
        return;

      } else {

        /**
          * Get Current Position
          *
          * @description The device probably has a GPS.
          */

        $geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 60000,
          maximumAge: 0
        }).then(function(position) {
          $scope.passOn(position, query);
          $scope.position = position;
          $scope.noLocationAvailable = false;
        }, function () {
          $scope.noLocationAvailable = true;
          console.log('Person Current Location Provided.')

        });
      }
      //});

    }, function (errorData) {
      $location.path('/');
    });

  });
