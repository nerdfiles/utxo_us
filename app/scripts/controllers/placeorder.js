'use strict';

/**
 * @ngdoc function
 * @name utxoPmc.controller:PlaceorderCtrl
 * @description
 * # PlaceorderCtrl
 * Controller of the utxoPmc
 */
angular.module('utxoPmc')
  .controller('PlaceorderCtrl', function ($scope, person, $location, crypto, $timeout, authentication, notification, segmentio) {
    $scope.person = {};

    $scope._id = null;

    if (person && person.current && person.current.data && person.current.data.data) {
      $scope._id = person.current.data.data.name;
    }

    authentication.loadSession().then(function () {

      if (person && person.current && person.current.data && person.current.data.data) {
        $scope._id = person.current.data.data.name;
      }

      if (person && person.current) {
        $scope._id = person.current.$id;
        $scope.person = person.current;
      }

    }, function () {
      $location.path('/');
    });

    $scope._now = null;

    $scope.updatePriceExchangeRatesBtc = function (_person) {

      var dataBtcPrice$ = $('[data-btc-price]');
      var dataBtcPriceValue = dataBtcPrice$.text();
      var _dataBtcPriceValue = dataBtcPriceValue.split(' ');
      $scope.dataBtcPriceValue = _dataBtcPriceValue[0];
      $scope._now = moment();
      $scope.now = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
      //var factor = 1 / 350;

      $timeout(function () {
        var priceExtension = (parseFloat($scope.orderBtc) * (parseFloat(_dataBtcPriceValue[0])));
        $scope.orderUsd = !_.isNaN(priceExtension) ? priceExtension.toFixed(2) : null;
        $scope.$apply();
      }, 0);

    };

    $scope.updatePriceExchangeRatesUsd = function (_person) {

      var dataBtcPrice$ = $('[data-btc-price]');
      var dataBtcPriceValue = dataBtcPrice$.text();
      var _dataBtcPriceValue = $scope.dataBtcPriceValue = dataBtcPriceValue.split(' ');
      $scope.dataBtcPriceValue = _dataBtcPriceValue[0];
      $scope._now = moment();
      $scope.now = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
      var factor = 0.1;

      $timeout(function () {
        var priceExtension = (parseFloat($scope.orderUsd) / parseFloat(_dataBtcPriceValue[0]));
        $scope.orderBtc = !_.isNaN(priceExtension) ? priceExtension.toFixed(8) : null;
        $scope.$apply();
      }, 0);

    };

    $scope.updatePerson = function (_person) {

      _person.order = {};

      _person.order.timestamp = $scope._now.toString();
      _person.order.status = 0;
      _person.order.selfie_link = null;
      _person.order.selfie_state1 = false;
      _person.order.selfie_state2 = false;
      _person.order.selfie_state3 = false;
      _person.order.selfie_retake = false;
      _person.order.selfie_retake__sms = false;
      if (parseFloat($scope.orderUsd) > 10000) {
        _person.order.fincen_state1 = true;

        try {

          $window.analytics.track('New Order - FinCEN Check', {
            location: 'form',
            type: 'ng-submit'
          });
        } catch (e) {
          console.log(e);
        }

      } else {
        _person.order.fincen_state1 = false;
      }
      _person.order.usd = $scope.orderUsd;
      _person.order.btc = $scope.orderBtc;
      _person.order.fincen_state2 = false;
      _person.order.fincen_state3 = false;
      _person.order.btc_address = null;
      _person.order.btc_address__edited = false;
      _person.order.completed = false;
      _person.order.completed__link = null;
      _person.order.completed__sms = false;
      _person.order.force_exp = false;
      _person.order.force_exp__sms = false;
      _person.order.extend = false;
      _person.order.extend__time = null;
      _person.order.extend__price_lock = null;
      _person.order.extend__sms = false;
      _person.order.notes = null;
      _person.order.confirmed = false

      UserInfo.getInfo(function(response) {
        var last_order = crypto.hash(_person.order.timestamp);
        _person.order.user_agent_string = navigator.userAgent;
        _person.order.ip_address = response.ip_address;
        _person.order.city_code = response.city.code;
        _person.order.city_name = response.city.name;
        _person.order.continent_code = response.continent.code;
        _person.order.continent_name = response.continent.name;
        _person.order.country_code = response.country.code;
        _person.order.country_name = response.country.name;
        _person.order.request_date = response.request_date;
        _person.order.position_lat = response.position.latitude;
        _person.order.position_lng = response.position.longitude;
        _person.last_order = last_order;

        delete _person.order.$$hashkey;
        delete _person.order.$$id;
        delete _person.order.string_construct;

        var strategy = {
          handle   : $scope._id,
          property : 'orders' + '/' + last_order,
          payload  : _person.order
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
          person.current.order = _person.order;

          try {

            analytics.track('New Order - Created', {
              location: 'form',
              type: 'ng-submit'
            });
          } catch (e) {
            console.log(e);
          }

          try {
            notification.postOrder('New order created for ' + $scope.orderBtc + 'BTC! Check https://utxo.us/en/admin/#/dashboard to review.');
          } catch (e) {
            console.log(e);
          }

          $timeout(function () {
            $location.path('/mapView');
          }, 1000);
        }, function (errorData) {

          try {

            analytics.track('New Order - Error (Write Order)', {
              location: 'form',
              type: 'ng-submit'
            });
          } catch (e) {
            console.log(e);
          }

          $location.path('/error');
        });

      }, function (errorData) {
        console.log(errorData);

      });

    };

  });
