'use strict';

/**
 * @ngdoc overview
 * @name utxoPmc:routes
 * @description
 * # routes.js
 *
 * Configure routes for use with Angular, and apply authentication security
 * Add new routes using `yo angularfire:route` with the optional --auth-required flag.
 *
 * Any controller can be secured so that it will only load if user is logged in by
 * using `whenAuthenticated()` in place of `when()`. This requires the user to
 * be logged in to view this route, and adds the current user into the dependencies
 * which can be injected into the controller. If user is not logged in, the promise is
 * rejected, which is handled below by $routeChangeError
 *
 * Any controller can be forced to wait for authentication to resolve, without necessarily
 * requiring the user to be logged in, by adding a `resolve` block similar to the one below.
 * It would then inject `user` as a dependency. This could also be done in the controller,
 * but abstracting it makes things cleaner (controllers don't need to worry about auth state
 * or timing of displaying its UI components; it can assume it is taken care of when it runs)
 *
 *   resolve: {
 *     user: ['Auth', function(Auth) {
 *       return Auth.$getAuth();
 *     }]
 *   }
 *
 */

function viewConfigurator($locationProvider) {

  var __interface__ = {};
  __interface__.viewStateMode = {};
  __interface__.viewStateMode.__debug__ = ($routeParams.debug !== undefined) ? true : false;
  return __interface__;

}

var localStorageConfig = function(localStorageServiceProvider) {

  /*
  @ngdoc config
  @name routes.config:localStorageConfig
  @function localStorageConfig
  @description
    localStorage configuration.
   */
  localStorageServiceProvider
    .setPrefix('utxo')
    .setStorageType('localStorage')
    .setNotify(true, true);
};


var breadcrumb = function ($location) {
  var delay;
  delay = 300;
  return {
    restrict: 'A',
    priority: -1,
    link: function($scope, $element) {
      $scope.breadcrumbNavListView = [
        {
          page_title: 'Home',
          $id: 'home'
        }
      ];

      $scope.returnPage = function (page_title) {
        $location.path('/' + page_title.toLowerCase());
      };

    }
  };
};

String.prototype.capitalizeWord = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

var cmsView = function ($http, $templateCache, $location, $timeout, $rootScope) {

  var delay;
  delay = 300;
  return {
    restrict: 'A',
    link: function($scope, $element) {

      $scope.oldUrl = null;
      $rootScope.loadedCmsViewReady = false;

      var elemList = [
        'Home',
        'About',
        'Legal',
        'Contact'
      ];

      var t = null;
      var foundNavItem = false;

      $scope.$on('cmsView:ready', function (event, viewConstruct) {
        angular.element(document).ready(function () {
          $timeout(function () {
            $scope.cmsViewReady = true;
            foundNavItem = true;
            $rootScope.loadedCmsViewReady = true;
            $scope.$apply()
            $rootScope.$apply()
          }, 0);
        });
      });

      angular.element(document).ready(function () {

        $scope.cmsViewReady = true;
        var currUrl = _.last($location.$$absUrl.split('/'));
        var _currUrl = currUrl.capitalizeWord();
        var body$ = angular.element(angular.element.find('body'));

        _.forEach(elemList, function (elemName) {
          body$.removeClass('page--' + elemName);
        });

        body$.addClass('page--' + _currUrl.replace(/\#/g, '-'));

        for (var i = 0; i < elemList.length; ++i) {
          if (elemList.indexOf(currUrl.capitalizeWord()) !== -1) {
            foundNavItem = true;
          }
        }

        if (currUrl == '') {
          foundNavItem = true;
        }

        if (foundNavItem == false) {
          $scope.$broadcast('cmsView:ready', $scope);
          return;
        }

        $http.get('/api/cms/page/' + currUrl).success(function (templateData) {
          var portSpec = window.location.port != "" ? (':' + window.location.port) : '';
          var pathname = window.location.pathname;
          var a = window.location.hostname + portSpec + '';
          var baseUrl = window.location.protocol + '//' + a;
          var original = $element.find('.cms--sub-page');
          original.parent().find('.floating-title').remove();
          original.parent().prepend('<a href="' + baseUrl + '/en/#/"><div class="floating-title"><span>' + currUrl + '</span></div></a>');
          original.before(templateData);
          original.remove();
          $scope.$broadcast('cmsView:ready', $scope);

          $timeout(function () {
            $scope.$apply();
          }, 0);

          $scope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {

            $timeout.cancel(t);
            $('body').removeClass('show-sticky-bg');

            if (newUrl !== oldUrl && newUrl.split('/')[4] === '') {
              console.log(newUrl);
              $('.cms--sub-page').parent()
                .addClass('animated')
                .addClass('fadeOut');

              $timeout(function () {
                $('.cms--sub-page').parent()
                  .removeClass('animated')
                  .removeClass('fadeOut');
              }, 0);
            }

            if (newUrl) {

              $timeout.cancel(t);

              var u = _.last(newUrl.split('/'));
              var _u = _.last(oldUrl.split('/'));
              var __u = _u.capitalizeWord();

              var body$ = angular.element(angular.element.find('body'));
              var foundNavItem = false;
              body$.removeClass('page--' + __u);
              $timeout(function () {
                body$.addClass('page--' + u.capitalizeWord().replace(/\#/g, '-'));
              }, 750);
              for (var i = 0; i < elemList.length; ++i) {
                if (elemList.indexOf(u.capitalizeWord()) !== -1) {
                  foundNavItem = true;
                }
              }

              if (foundNavItem) {
                $('.cms--sub-page').addClass('fadeOut').addClass('animated');
              } else {
                $('.cms--sub-page').removeClass('fadeOut').removeClass('animated');
              }

              if (u == '') {
                foundNavItem = true;
              }

              if (foundNavItem == false) {
                $scope.$broadcast('cmsView:ready', $scope);
                return;
              }

              $http.get('/api/cms/page/' + u).success(function (templateData) {
                var original = $element.find('.cms--sub-page');
                var portSpec = window.location.port != "" ? (':' + window.location.port) : '';
                var pathname = window.location.pathname;
                var a = window.location.hostname + portSpec + '/en/#/';
                var baseUrl = window.location.protocol + '//' + a;
                original.parent().find('.floating-title').remove();
                original.parent().prepend('<a href="' + baseUrl + '"><div class="floating-title"><span>' + u.capitalizeWord() + '</span></div></a>');
                original.before(templateData);
                original.remove();
                $scope.oldUrl = oldUrl;
                $scope.$broadcast('cmsView:ready', $scope);
                $timeout(function () {
                  $('body').addClass('show-sticky-bg');
                }, 0);
              });

            }

          });

        });

      });


    }

  };

};

var clickMonad = function($timeout) {

  /*
  @ngdoc directive
  @name interface.directive:clickMonad
  @element a
  @function clickMonad
  @description

  Prevent double trigger on click events for ng-click directives, and possibly
  other simple interactive captures.

  @example

      <a
        module="interface"
        click-monad
        ng-click="someFunction()"
      >
        <span class="fa fa-flash"></span>
      </a>
    */
  var delay;
  delay = 300;
  return {
    restrict: 'A',
    priority: -1,
    link: function($scope, element) {

      var clickHandler, disabled;
      disabled = false;

      clickHandler = function(event) {
        if (disabled) {
          event.preventDefault();
          return event.stopImmediatePropagation();
        } else {
          disabled = true;
          return $timeout(function() {
            disabled = false;
          }, delay, false);
        }
      };

      $scope.$on('$destroy', function() {
        return element.off('click', clickHandler);
      });

      element.on('click', clickHandler);
    }
  };
};

angular.module('utxoPmc')

/**
 * Adds a special `whenAuthenticated` method onto $routeProvider. This special method,
 * when called, invokes Auth.$requireAuth() service (see Auth.js).
 *
 * The promise either resolves to the authenticated user object and makes it available to
 * dependency injection (see AccountCtrl), or rejects the promise if user is not logged in,
 * forcing a redirect to the /login page
 */
  .config(['$routeProvider', 'SECURED_ROUTES', function($routeProvider, SECURED_ROUTES) {
    // credits for this idea: https://groups.google.com/forum/#!msg/angular/dPr9BpIZID0/MgWVluo_Tg8J
    // unfortunately, a decorator cannot be use here because they are not applied until after
    // the .config calls resolve, so they can't be used during route configuration, so we have
    // to hack it directly onto the $routeProvider object
    $routeProvider.whenAuthenticated = function(path, route) {
      route.resolve = route.resolve || {};
      route.resolve.user = ['Auth', function(Auth) {
        return Auth.$requireAuth();
      }];
      $routeProvider.when(path, route);
      SECURED_ROUTES[path] = true;
      return $routeProvider;
    };
  }])

  // AngularJS 1.1.x dropped this default Ajax HTTP Header, which Django still supports.
  // @see http://django-angular.readthedocs.org/en/latest/integration.html
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  }])

  // Choose whether or not to use {% verbatim %} to facilitate AngularJS
  // template symbols, i.e. {{ angularjs_variable_name }} won't be processed
  // by Django server-side inside of a partial while other Django variables
  // outside of {% verbatim %} blocks will be processed.
  //
  // @see http://django-angular.readthedocs.org/en/latest/integration.html
  // @usage
  //   {% verbatim %}
  //     {{if dying}}Still alive.{{/if}}
  //   {% endverbatim %}
  // @usage
  //   {% verbatim myblock %}
  //     Avoid template rendering via the {% verbatim %}{% endverbatim %} block.
  //   {% endverbatim myblock %}
  .config(['$interpolateProvider', function($interpolateProvider) {
    // We will not use this strategy since third-party AngularJS directives might
    // be used.
    return;
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');
  }])

  // @note ...
  .factory('viewConfigurator', [
    '$locationProvider',
    viewConfigurator
  ])

  .factory('crypt', function () {
    return {
      hash: function (value) {
        var str = JSON.stringify(value);
        return CryptoJS.SHA1(str).toString();
      }
    };
  })

  .factory('httpAuthInterceptor', function ($q, $location) {
    return {
      'responseError': function (response) {
        if ([401, 403].indexOf(response.status) >= 0) {
          $location.path('/');
          return response;
        } else {
          return $q.reject(rejection);
        }
      }
    };
  })

  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpAuthInterceptor');
  })

  .config([
    'localStorageServiceProvider',
    localStorageConfig
  ])

  // configure static; whenAuthenticated adds a resolve method to ensure users authenticate
  // before trying to access that route
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(false);
    //$locationProvider.hashPrefix('!');

    function uploadFileslice (slice) {
        /**
         * slice is a blob
         */
        var fileReader = new FileReader()
        fileReader.onload = function(event){
            var arrayBuffer = event.target.result
            var wordArray = CryptoJS.lib.WordArray.create(arrayBuffer)
            var sha1crc = CryptoJS.SHA1(wordArray).toString(CryptoJS.enc.Hex)
            var slice = [];
            requestParams.append('fileslice', slice)
            requestParams.append('sha1crc', sha1crc)
        }
        fileReader.readAsArrayBuffer(slice)
    }

    String.prototype.stylize = function (type) {
      var string_construct;
      var c = new Chance();
      environment.route_contract = {};
      string_construct = CryptoJS.SHA1(this).toString(CryptoJS.enc.Hex);
      environment.route_contract[this.toString()] = string_construct;
      return string_construct;
    };

    $routeProvider
      .when('/', {
        templateUrl: 'static/main.html',
        controller: 'MainCtrl'
      })

      .when('/chat', {
        templateUrl: 'static/chat.html',
        controller: 'ChatCtrl'
      })

      .when('/login', {
        templateUrl: 'static/login.html',
        controller: 'LoginCtrl'
      })

      .whenAuthenticated('/account', {
        templateUrl: 'static/account.html',
        controller: 'AccountCtrl'
      })

      .when('/help', {
        templateUrl: 'static/help.html',
        controller: 'HelpCtrl'
      })

      .when('/contact', {
        templateUrl: 'static/contact.html',
        controller: 'MainCtrl'
      })

      .when('/about', {
        templateUrl: 'static/main.html',
        controller: 'MainCtrl'
      })

      .when('/legal', {
        templateUrl: 'static/main.html',
        controller: 'MainCtrl'
      })

      .when('/verifyOne', {
        templateUrl: 'static/verifyone.html',
        controller: 'VerifyoneCtrl'
      })

      .when('/verifyTwo', {
        templateUrl: 'static/verifytwo.html',
        controller: 'VerifytwoCtrl'
      })

      .when('/verifyThree', {
        templateUrl: 'static/verifythree.html',
        controller: 'VerifythreeCtrl'
      })

      .when('/verifyFour', {
        templateUrl: 'static/verifyfour.html',
        controller: 'VerifyfourCtrl'
      })

      .when('/' + 'placeOrder'.stylize('hash'), {
        templateUrl: 'static/placeorder.html',
        controller: 'PlaceorderCtrl'
      })

      .when('/terms', {
        templateUrl: 'static/terms.html',
        //templateUrl: 'terms/2015/08/31/terms-v1/',
        controller: 'TermsCtrl'
      })

      .when('/' + 'openOrders'.stylize('hash'), {
        templateUrl: 'static/openorders.html',
        controller: 'OpenordersCtrl'
      })

      .when('/' + 'history'.stylize('hash'), {
        templateUrl: 'static/history.html',
        controller: 'HistoryCtrl'
      })

      .when('/mapView', {
        templateUrl: 'static/mapview.html',
        controller: 'MapviewCtrl'
      })

      .when('/businessCardView', {
        templateUrl: 'static/businesscardview.html',
        controller: 'BusinesscardviewCtrl'
      })

      .when('/refNumber', {
        templateUrl: 'static/refnumber.html',
        controller: 'RefnumberCtrl'
      })

      .when('/error', {
        templateUrl: 'static/genericerror.html',
        controller: 'GenericerrorCtrl'
      })

      .when('/genericError', {
        templateUrl: 'static/genericerror.html',
        controller: 'GenericerrorCtrl'
      })

      .when('/takeSelfie', {
        templateUrl: 'static/takeselfie.html',
        controller: 'TakeselfieCtrl'
      })

      .when('/noLocationAvailable', {
        templateUrl: 'static/nolocationavailable.html',
        controller: 'NolocationavailableCtrl'
      })

      .when('/takeSelfieConfirm', {
        templateUrl: 'static/takeselfieconfirm.html',
        controller: 'TakeselfieconfirmCtrl'
      })

      .when('/dashboard', {
        templateUrl: 'static/dashboard.html',
        controller: 'DashboardCtrl'
      })
      .when('/landing', {
        templateUrl: 'static/landing.html',
        controller: 'LandingCtrl'
      })
      .when('/completeOrder', {
        templateUrl: 'static/completeorder.html',
        controller: 'CompleteorderCtrl'
      })
      .when('/order/:type/:id', {
        templateUrl: 'static/order.html',
        controller: 'OrderCtrl'
      })

      .otherwise({redirectTo: '/'});
  }])

  /**
   * Apply some route security. Any route's resolve method can reject the promise with
   * "AUTH_REQUIRED" to force a redirect. This method enforces that and also watches
   * for changes in auth status which might require us to navigate away from a path
   * that we can no longer view.
   */
  .run(['$http', '$cookies', '$rootScope', '$location', 'Auth', 'SECURED_ROUTES', 'loginRedirectPath', '$geolocation', '$window', 'person',
    function($http, $cookies, $rootScope, $location, Auth, SECURED_ROUTES, loginRedirectPath, $geolocation, $window, person) {
      $rootScope.moment = moment;
      $rootScope.$ = jQuery;
      $rootScope.numeral = numeral;

      $rootScope.openInMap = function (daddr) {
          if( (navigator.platform.indexOf("iPhone") != -1)
              || (navigator.platform.indexOf("iPod") != -1)
              || (navigator.platform.indexOf("iPad") != -1))
               $window.open("maps://maps.google.com/maps?daddr="+daddr+"&amp;ll=", "_blank");
          else
               $window.open("http://maps.google.com/maps?daddr="+daddr+"&amp;ll=", "_blank");
      };

      $rootScope.openWithDirectionsInMap = function (daddr) {

        $geolocation.getCurrentPosition({
          timeout: 60000
        }).then(function(position) {

          var _saddr = [
            position.coords.latitude,
            position.coords.longitude
          ];

          var saddr = _saddr.join(',')

          if( (navigator.platform.indexOf("iPhone") != -1)
              || (navigator.platform.indexOf("iPod") != -1)
              || (navigator.platform.indexOf("iPad") != -1))
               $window.open("maps://maps.google.com/maps?daddr="+daddr+"&saddr="+saddr+"&amp;ll=", "_blank");
          else
               $window.open("http://maps.google.com/maps?daddr="+daddr+"&saddr="+saddr+"&amp;ll=", "_blank");
        }, function () {
          console.log('Person Current Location Provided.')
        });

      };

      // watch for login status changes and redirect if appropriate
      Auth.$onAuth(check);
      //console.log(Auth);

      $rootScope.$on('$locationChangeStart', function (e, newLocation) {
        var route_construct = _.extend({}, newLocation.split('/'));

        try {
          var logoutLink = 'logout'.stylize('hash');
          if (newLocation && _.size(route_construct) === 6 && newLocation.indexOf(logoutLink) !== -1) {
            /**
            * This is primarily for minimalistic logout functionality. See SECURED_ROUTES
            * for route contract authentication.
            */
            delete person.current;
            localStorageService.remove('hook_number__timestamp');
            Auth.$unauth();
          }
        } catch (e) {
          console.dir('Fresh session loaded.');
        }

      });

      // some of our routes may reject resolve promises with the special {authRequired: true} error
      // this redirects to the login page whenever that is encountered
      $rootScope.$on('$routeChangeError', function(e, next, prev, err) {
        if( err === 'AUTH_REQUIRED' ) {
          $location.path(loginRedirectPath);
        }
      });

      function check(user) {
        if( !user && authRequired($location.path()) ) {
          $location.path(loginRedirectPath);
        }
      }

      function authRequired(path) {
        return SECURED_ROUTES.hasOwnProperty(path);
      }

      /*
       *$http.defaults.headers.delete['X-CSRFToken'] = $cookies.get('csrftoken');
       *$http.defaults.headers.delete["Content-Type"] = "application/x-www-form-urlencoded";
       */
      /*
       *$http.defaults.headers.patch['X-CSRFToken'] = $cookies.get('csrftoken');
       *$http.defaults.headers.patch["Content-Type"] = "application/x-www-form-urlencoded";
       */
      $http.defaults.headers.put['X-CSRFToken'] = $cookies.get('csrftoken');
      $http.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded";
      $http.defaults.headers.post['X-CSRFToken'] = $cookies.get('csrftoken');
      $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

    }
  ])

  .directive('clickMonad', ['$timeout', clickMonad])

  .directive('cmsView', ['$http', '$templateCache', '$location', '$timeout', '$rootScope', cmsView])

  .directive('breadcrumb', ['$location', breadcrumb])

  // used by route security
  .constant('SECURED_ROUTES', {
    '/verifyOne'   : true,
    '/verifyTwo'   : true,
    '/verifyThree' : true,
    '/verifyFour'  : true
  });

$(document).ready(function () {
});
