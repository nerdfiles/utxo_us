'use strict';

/**
 * @ngdoc function
 * @name utxoPmc.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the utxoPmc
 */
angular.module('utxoPmc')
  .factory('$api', function ($http) {
    /**
     * @inner
     */

    var __interface__ = {};
    __interface__.segmentio = {};
    __interface__.segmentio.apiKey = function () {
      var portSpec = $window.location.port !== "" ? (':' + $window.location.port) : '';
      var hostname = $window.location.hostname + portSpec;
      var url = $window.location.protocol + '//' + hostname + '/api/segmentio/apikey';
      return $http(url).success(function (responseData) {
        __interface__.__api__ = {};
        __interface__.__api__['/api/segmentio/apikey'] = responseData.data.mainEntity;
      });
    };
    return __interface__;

  })
  .controller('MainCtrl', function ($scope, authentication, $location, $window, person, Ref, segmentio, $api, $http, crypto, localStorageService, notification, $timeout) {
    /**
     * Main Controller
     * @description
     *
     * Index Controller for utxo to dispatch verification requests.
     */

    var portSpec = $window.location.port !== "" ? (':' + $window.location.port) : '';
    var hostname = $window.location.hostname + portSpec;
    var loaded = false;

    $scope.smsAuthentication = {};
    $scope.smsAuthentication.phone_number = null;
    $scope.validate_phone_number_form = {};
    $scope.validate_phone_number_form.validated = false;

    $scope.addMessage = function (message_construct) {
      /**
       * @inner
       * @description
       *
       * Universal add message function which updates the backend Slack
       * channel with the users message from Contact form.
       */
      $scope.new_message = $scope.newMessageId + ':' + message_construct

      if (!$scope.newMessageId)
        return;

      $scope.showConfirmation = true;
      UserInfo.getInfo(function(data) {
        var id = crypto.hash(data.ip_address);
        notification.postMessage(id.slice(0, 9) + ': ' + $scope.new_message);
      }, function(err) {
      });
      $timeout(function () {
        $scope.showConfirmation = false;
      }, 3000);
    };

    $scope.$watch('smsAuthentication.phone_number', function (newVal) {
      /**
       * @description
       *
       * Capture the phone number of the given user.
       */

      if (newVal === undefined || newVal === null) {
        return;
      }
      if (newVal === '') {
        loaded = false;
      }
    });

    $scope.$watch('smsAuthentication.sec_number', function (newVal, oldVal) {
      /**
       * @inner
       * @description
       *
       * SMS Authentication Number Security
       */

      if (viewConfigurator.DEBUG === true) {
        $location.path('verifyOne');
      }

      if (newVal && newVal.length > 5) {
        // If the user attempts to log in, we unlock for them to log in again.
        localStorageService.remove('lock_number');
      } else {
        return;
      }

      var hook_number = localStorageService.get('hook_number');

      if (newVal && (newVal === $scope.validate_phone_number_form.secCheck || newVal === hook_number)) {

        Ref.authAnonymously(function(error, authData) {
          localStorageService.remove('hook_number__timestamp');

          if (error) {
            $scope.error_sec = true;
          } else {
            var secured_phone = $scope.smsAuthentication.phone_number;
            $scope.error_sec = true;
            var _secured_phone = '' + crypto.encrypt(secured_phone, authData.token);
            localStorageService.remove('hook_number');
            localStorageService.set('hook', _secured_phone);

            console.log(person);

            // Refresh session.
            person.session.user = authData;

            person
              .get({
                mode: 'byId',
                handle: $scope.smsAuthentication.phone_number
              })
                .then(function (personData) {
                  person.current = personData;
                  if (!personData) {
                    person.current = {};

                    var formConstruct = {};
                    formConstruct.phone_number = $scope.smsAuthentication.phone_number;
                    var _payload = formConstruct;

                    // User does not exist, create user with basic properties.
                    if (_payload && _payload.phone_number && !person.current.phone_number) {

                      person.push({
                        payload: _payload
                      }).then(function (personData) {
                        person.current = personData;
                        $location.path('terms');
                      }, function (errorData) {
                        person.current = errorData;
                      });

                    }
                    return;
                  }

                  if (person.current && person.current.overview && person.current.overview.terms === 'true') {
                    if (person.current.overview.terms == 'true' && person.current.verification) {
                      $location.path('e24a4f9e18cf2fbba29b82d9b6b899aff70e10ea');
                    } else {
                      $location.path('verifyOne');
                    }
                  } else {
                    $location.path('terms');
                  }
                }, function (personData) {
                  //person.current = personData;
                  //$location.path('terms');
                });

          }
        });

      }
      else {
        $scope.error_sec = true;
      }
    });

    $scope.resetForm = function () {
      /**
       * @inner
       */

      $scope.validate_phone_number_form.validated = false;
      $scope.smsAuthentication.phone_number = null;
    };

    var counter = 0;
    var debugging = false;
    $scope.prepare = function () {
      //$scope.smsAuthentication._debug_phone_number = '';
      if (counter > 6) {
        $scope.smsAuthentication.phone_number = '7138583448';
        debugging = true;
      } else {

        counter++;
      }
      return;

    };

    var lock_number = Math.floor(Math.random()*10000000000000000);
    $scope.lock_number = localStorageService.get('lock_number', lock_number) || null;

    $scope.hook_number_timestamp = localStorageService.get('hook_number__timestamp');
    var now = moment();
    var u = moment($scope.hook_number_timestamp);
    console.log(u);
    var _u = u.add(1, 'minutes');
    $scope.hook_number__updated = now < _u;

    if ($scope.hook_number__updated) {
      $scope.hook_number__expired = true;
      if (!$scope.hook_number__expired) {
        $scope.lock_number = null;
      }
    }

    $scope.validate_phone_number = function () {
      /**
       * @inner
       * @description
       * Validate phone number.
       */
      var _now = moment();
      var _u = u.add(1, 'minutes');
      $scope.hook_number__updated = _now < _u;

      if ($scope.hook_number__updated) {
        $scope.hook_number__expired = true;
        if (!$scope.hook_number__expired) {
          $scope.lock_number = null;
        }
      }

      if ($scope.lock_number || debugging) {
        $scope.validate_phone_number_form.validated = true;
        //return;
      } else {
        localStorageService.set('lock_number', lock_number);
      }

      // Validate Phone Number to initialize Blockscore
      if ($scope.validate_phone_number_form.$invalid === true) {
        console.log("We've received a response from the backend to authenticate the given person (People).");
        return;
      }

      if (loaded === false) {
        loaded = true;
      } else {
        return;
      }

      try {

        analytics.page('Verification', 'Main', {
          url: $location.abspath
        });

      } catch (e) {
        console.dir(e);
      }

      var formObject = $scope.smsAuthentication;
      formObject.phone_number = $scope.smsAuthentication.phone_number.replace(/-/g, '');
      //console.log(formObject);

      authentication
        .validate_phone_number(formObject)
        .then(function (validatedForm) {
          /**
           * Successful Lookup Condition
           */
          $scope.validate_phone_number_form.validated = true;
          $scope.validate_phone_number_form.s = validatedForm
          $scope.validate_phone_number_form.sec = validatedForm.data.split(': ');
          $scope.validate_phone_number_form.secCheck = _.last($scope.validate_phone_number_form.sec);
          var phone_number = formObject.phone_number;
          var hook_number = $scope.validate_phone_number_form.secCheck
          var hook_number__timestamp = moment().toString()

          localStorageService.set('hook_number', hook_number)
          localStorageService.set('hook_number__timestamp', hook_number__timestamp)

          try {

            analytics.ready(function () {
              UserInfo.getInfo(function(data) {
                var id = crypto.hash(data.ip_address);
                $window.mixpanel.identify(id.slice(0, 9));
                $window.mixpanel.people.set({
                    "$last_login": moment().toString(),
                    "phone_number": phone_number
                });
                var portSpec = $window.location.port !== "" ? (':' + $window.location.port) : '';
                var hostname = $window.location.hostname + portSpec;
                var url = $window.location.protocol + '//' + hostname + '/verification/start';
                $http.post(url);
              }, function(err) {
                console.dir(err);
              });

            });
          } catch (e) {
            console.dir(e);
          }

          try {
            // Assuming validation success, pull up the relevant person by phone if available in Firebase.
            person
              .get({
                mode: 'byId',
                handle: phone_number
              })
                .then(function (personData) {
                  var personData = personData !== null ? personData : {};
                  $scope.validate_phone_number_form.$person = personData;

                  //localStorageService.remove('hook');

                  if (personData) {
                    person.current = personData;
                  }
                  if (person.current.overview.terms == 'true') {
                    //$location.path('e24a4f9e18cf2fbba29b82d9b6b899aff70e10ea');
                  } else if (person.current.overview.terms != 'true') {
                    //$location.path('terms');
                  } else {
                    //$location.path('verifyOne');
                  }

                  try {
                    analytics.track('Passed Login', {
                      location: 'form',
                      type: 'ng-submit'
                    });
                  } catch (e) {
                    console.dir(e);
                  }

                }, function (errorData) {
                  $scope.validate_phone_number_form.$person = person.current = errorData;
                });
          } catch (e) {
            console.log(e);
          }

        }, function (errorData) {
          /**
           * Error Validation Condition
           */
          $scope.validate_phone_number_form.validated = false;
          $scope.validate_phone_number_form.error = true;
          $scope.validate_phone_number_form.$person = errorData;
        });

    };

    $scope.$watchCollection('validate_phone_number_form.$person', function (newVal, oldVal) {
      /**
       * User Not Found, but User has provided a phone number.
       *
       * $person on `$scope.validate_phone_number_form` will no longer be `undefined` but an empty object.
       *
       * @inner
       */

      var formConstruct = {};
      formConstruct.phone_number = $scope.smsAuthentication.phone_number;
      var _payload = formConstruct;

      // User does not exist, create user with basic properties.
      if (_payload && _payload.phone_number && !person.current.phone_number) {

        person.push({
          payload: _payload
        }).then(function (personData) {
          person.current = personData;
        }, function (errorData) {
          person.current = errorData;
        });

      }
    });

  });

