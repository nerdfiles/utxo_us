'use strict';

/**
 * @ngdoc service
 * @name utxoPmc.person
 * @description
 * # person
 * Service in the utxoPmc.
 */
angular.module('utxoPmc')
  .factory('people', function ($q, $http, $timeout, $cookies, notification, $location) {
    var __service__ = {};
    __service__.list = null;
    return __service__;
  })
  .factory('person', function ($q, $http, $timeout, $cookies, notification, $location, people, Auth, localStorageService, crypto) {

    var __service__ = {};

    __service__.session = {};

    // Persistent session.
    __service__.session.user = Auth.$getAuth();
    __service__.current = {};
    __service__.current.order = null;

    __service__.sendSms = function (handle, message_construct) {
      /**
       * Send Arbitrary Message to Number
       */
      var baseUrl = environment.rest.sendSms.create;
      var def = $q.defer();

      var _formObject = {
        handle: handle,
        message_construct: message_construct
      }

      var payload = $.param(_formObject);

      $http
        .post(
          baseUrl,
          payload
        )
        .success(function (responseData) {
          def.resolve(responseData);
        })
        .error(function (errorData) {
          def.reject(errorData);
        });

      return def.promise;
    };

    __service__.isAfterdark = function () {
      var _now = moment().hour(18);
      var __now = moment().hour(8);
      var now = moment();
      return now.isAfter(_now) || now.isBefore(__now)
    };

    __service__.push = function (_strategy) {
      /**
       * @param {object} _strategy
       *    .payload {object}
       * @usage
       *     curl -X POST -d '{"user_id" : "jack", "text" : "Ahoy!"}' \
       *       'https://utxo.firebaseio.com/people.json'
       * @response
       *     { "name": "-INOQPH-aV_psbk3ZXEX" }
       */
      var payload = $.param(_strategy.payload);
      var _url = (_strategy.property !== null && _strategy.property !== undefined)
        ? environment.rest.people.person.__update__(_strategy.handle, _strategy.property)
        : environment.rest.people.person.__base__();
      return $http.post(
        _url,
        payload
      )
      .success(function (response) {
        console.log(response);
        return response;
      })
      .error(function (errorResponse) {
        console.log(errorResponse);
        return errorResponse;
      });
    };

    __service__.order = function (_strategy) {
      /**
       * @param {object} _strategy
       *     .handle   {string}
       *     .property {string}
       *     .payload  {object} A map of property-value pairs to update with values.
       * @usage
       *     curl -X PUT -d '{ "first": "Jack", "last": "Sparrow" }' \
       *       'https://utxo.firebaseio.com/people/<number>/<property>.json'
       * @response
       *     { "first": "Jack", "last": "Sparrow" }
       */
      if (_strategy.payload === undefined) {
        $location.path('/');
      }
      var payload = null;
      try {
        payload = $.param(_strategy.payload);
      } catch (e) {

        console.dir(e);
      }

      return $http.put(
          environment.rest
            .orders.order
              .__update__(
                _strategy.handle,
                _strategy.property
              ),
          payload
        )
          .success(function (response) {
            console.log(response);
            return response;
          })
          .error(function (errorResponse) {
            console.log(errorResponse);
            return errorResponse;
          });
    };

    __service__.write = function (_strategy) {
      /**
       * @param {object} _strategy
       *     .handle   {string}
       *     .property {string}
       *     .payload  {object} A map of property-value pairs to update with values.
       * @usage
       *     curl -X PUT -d '{ "first": "Jack", "last": "Sparrow" }' \
       *       'https://utxo.firebaseio.com/people/<number>/<property>.json'
       * @response
       *     { "first": "Jack", "last": "Sparrow" }
       */
      var payload = $.param(_strategy.payload);
      return $http.put(
          environment.rest
            .people.person
              .__update__(
                _strategy.handle,
                _strategy.property
              ),
          payload
        )
          .success(function (response) {
            console.log(response);
            return response;
          })
          .error(function (errorResponse) {
            console.log(errorResponse);
            return errorResponse;
          });
    };

    __service__.update = function (_strategy) {
      /**
       * @param {object} _strategy
       *     .handle   {string}
       *     .property {string}
       *     .payload  {object} A property-value pair.
       * @usage
       *     curl -X PATCH -d '{"last":"Jones"}' \
       *       'https://utxo.firebaseio.com/people/<number>/<property>/.json'
       * @response
       *     { "last": "Jones" }
       */
      var strategy = _strategy ? _strategy : {};
      var payload = $.param(_strategy.payload);
      return $http.patch(
        environment.rest.people.person.__update__(_strategy.handle),
        payload
      )
        .success(function(response) {
          console.log(response);
          return response;
        })
        .error(function(errorResponse) {
          console.log(errorResponse);
          return errorResponse;
        });
    };

    __service__.all = function () {
      /**
       * Load All Users
       */
      var baseUrl = environment.rest.people.person.__base__() + 'list/' + (Math.floor(Math.random()*10000000000000000)) + '/';
      //var baseUrl = environment.rest.people.person.__base__();
      return $http.get(
        baseUrl
      ).success(function(response) {
        people.list = response;
        return response;
      }).error(function(errorResponse) {
        return errorResponse;
      });
    };

    __service__.get = function (_strategy) {
      /**
       * Get Person
       *
       * Template-based strategy to calling and capturing REST responses.
       *
       * @param {object} strategy
       *     @property mode
       *     @property handle
       * @usage
       *
       *     personService
       *      .getPerson({ mode: 'byId', handle: '{{personId}}', property: '{{propertyKey}}' })
       *      .then(noop, noop)
       *
       * @usage
       *
       *   curl 'https://utxo.firebaseio.com/people/<number>/<property>.json'
       *
       * @response
       *
       *   { "first": "Jack", "last": "Sparrow" }
       */
      var defaultStrategy = 'byId';
      var strategy = _strategy ? _strategy : defaultStrategy;
      var strategyConstruct = {};
      var def = $q.defer();
      var personData;
      var errorMessageConstruct = {};
      var now = new Date();
      var sep = '/';
      console.time(strategy);

      strategyConstruct.byId = function () {
        /**
         * @inner
         */
        personData = $http
        .get(environment.rest.people.person.__get__(_strategy.handle), { cache: false }).
          success(function (response) {
            if (response && response.data) {
              def.resolve(response.data);
            } else {
              def.resolve(null);
              console.log('Zero data for', this);
            }
            console.timeEnd('Complete:' + strategy);
          }).
          error(function (errorData) {
            if (errorData) {
              errorMessageConstruct.message = errorData.error;
              errorMessageConstruct.status = errorData.status;
              notification.displayError(errorMessageConstruct);
              def.reject(errorData);
            } else {
              errorMessageConstruct.message = 'No person found.';
              console.log(errorMessageConstruct.message);
              def.reject(errorData);
            }
            console.timeEnd('Complete:' + strategy);
          });

      };

      strategyConstruct.byProperty = function () {
        /**
         * @inner
         */
        personData = $http
        .get(environment.rest.people.person.__get__(_strategy.handle)).
          success(function (response) {
            if (response && response.data && response.data[_strategy.property]) {
              def.resolve(response.data[_strategy.property]);
            } else {
              def.reject({});
              console.log('Zero data for', this);
            }
            console.timeEnd('Complete:' + strategy);
          }).
          error(function (errorData) {
            errorMessageConstruct.message = errorData.error;
            errorMessageConstruct.status = error.status;
            notification.displayError(errorMessageConstruct);
            def.reject(errorData);
            console.timeEnd('Complete:' + strategy);
          });
      };

      var initializeStrategy;

      if (typeof strategyConstruct[strategy.mode] === 'function') {
        initializeStrategy = strategyConstruct[strategy.mode];
      }

      try {
        initializeStrategy();
      } catch (e) {
        console.log(e);
      }

      return def.promise;
    };

    return __service__;

  });
