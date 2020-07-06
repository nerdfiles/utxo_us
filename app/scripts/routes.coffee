
###*
@ngdoc overview
@name utxoPmc:routes
@description
# routes.js

Configure routes for use with Angular, and apply authentication security
Add new routes using `yo angularfire:route` with the optional --auth-required flag.

Any controller can be secured so that it will only load if user is logged in by
using `whenAuthenticated()` in place of `when()`. This requires the user to
be logged in to view this route, and adds the current user into the dependencies
which can be injected into the controller. If user is not logged in, the promise is
rejected, which is handled below by $routeChangeError

Any controller can be forced to wait for authentication to resolve, without necessarily
requiring the user to be logged in, by adding a `resolve` block similar to the one below.
It would then inject `user` as a dependency. This could also be done in the controller,
but abstracting it makes things cleaner (controllers don't need to worry about auth state
or timing of displaying its UI components; it can assume it is taken care of when it runs)

resolve: {
user: ['Auth', function(Auth) {
return Auth.$getAuth();
}]
}
###
viewConfigurator = ($locationProvider) ->
  __interface__ = {}
  __interface__.viewStateMode = {}
  __interface__.viewStateMode.__debug__ = (if ($routeParams.debug isnt `undefined`) then true else false)
  __interface__
"use strict"
localStorageConfig = (localStorageServiceProvider) ->
  
  #
  #  @ngdoc config
  #  @name routes.config:localStorageConfig
  #  @function localStorageConfig
  #  @description
  #    localStorage configuration.
  #   
  localStorageServiceProvider.setPrefix("utxo").setStorageType("localStorage").setNotify true, true
  return

breadcrumb = ($location) ->
  delay = undefined
  delay = 300
  restrict: "A"
  priority: -1
  link: ($scope, $element) ->
    $scope.breadcrumbNavListView = [
      page_title: "Home"
      $id: "home"
    ]
    $scope.returnPage = (page_title) ->
      $location.path "/" + page_title.toLowerCase()
      return

    return

String::capitalizeWord = ->
  @charAt(0).toUpperCase() + @slice(1)

cmsView = ($http, $templateCache, $location, $timeout, $rootScope) ->
  delay = undefined
  delay = 300
  restrict: "A"
  link: ($scope, $element) ->
    $scope.oldUrl = null
    $rootScope.loadedCmsViewReady = false
    elemList = [
      "Home"
      "About"
      "Legal"
      "Contact"
    ]
    t = null
    foundNavItem = false
    $scope.$on "cmsView:ready", (event, viewConstruct) ->
      angular.element(document).ready ->
        $timeout (->
          $scope.cmsViewReady = true
          foundNavItem = true
          $rootScope.loadedCmsViewReady = true
          $scope.$apply()
          $rootScope.$apply()
          return
        ), 0
        return

      return

    angular.element(document).ready ->
      $scope.cmsViewReady = true
      currUrl = _.last($location.$$absUrl.split("/"))
      _currUrl = currUrl.capitalizeWord()
      body$ = angular.element(angular.element.find("body"))
      _.forEach elemList, (elemName) ->
        body$.removeClass "page--" + elemName
        return

      body$.addClass "page--" + _currUrl
      i = 0

      while i < elemList.length
        foundNavItem = true  if elemList.indexOf(currUrl.capitalizeWord()) isnt -1
        ++i
      foundNavItem = true  if currUrl is ""
      if foundNavItem is false
        $scope.$broadcast "cmsView:ready", $scope
        return
      $http.get("/api/cms/page/" + currUrl).success (templateData) ->
        portSpec = (if window.location.port isnt "" then (":" + window.location.port) else "")
        pathname = window.location.pathname
        a = window.location.hostname + portSpec + pathname + "#/"
        baseUrl = window.location.protocol + "//" + a
        original = $element.find(".cms--sub-page")
        original.parent().find(".floating-title").remove()
        original.parent().prepend "<a href=\"" + baseUrl + "#/\"><div class=\"floating-title\"><span>" + _currUrl + "</span></div></a>"
        original.before templateData
        original.remove()
        $scope.$broadcast "cmsView:ready", $scope
        $timeout (->
          $scope.$apply()
          return
        ), 0
        $scope.$on "$locationChangeStart", (event, newUrl, oldUrl) ->
          $timeout.cancel t
          $("body").removeClass "show-sticky-bg"
          if newUrl isnt oldUrl and newUrl.split("/")[4] is ""
            console.log newUrl
            $(".cms--sub-page").parent().addClass("animated").addClass "fadeOut"
            $timeout (->
              $(".cms--sub-page").parent().removeClass("animated").removeClass "fadeOut"
              return
            ), 0
          if newUrl
            $timeout.cancel t
            u = _.last(newUrl.split("/"))
            _u = _.last(oldUrl.split("/"))
            __u = _u.capitalizeWord()
            body$ = angular.element(angular.element.find("body"))
            foundNavItem = false
            body$.removeClass "page--" + __u
            body$.addClass "page--" + u.capitalizeWord()
            i = 0

            while i < elemList.length
              foundNavItem = true  if elemList.indexOf(u.capitalizeWord()) isnt -1
              ++i
            if foundNavItem
              $(".cms--sub-page").addClass("fadeOut").addClass "animated"
            else
              $(".cms--sub-page").removeClass("fadeOut").removeClass "animated"
            foundNavItem = true  if u is ""
            if foundNavItem is false
              $scope.$broadcast "cmsView:ready", $scope
              return
            $http.get("/api/cms/page/" + u).success (templateData) ->
              original = $element.find(".cms--sub-page")
              portSpec = (if window.location.port isnt "" then (":" + window.location.port) else "")
              pathname = window.location.pathname
              a = window.location.hostname + portSpec + pathname + "#/"
              baseUrl = window.location.protocol + "//" + a
              original.parent().find(".floating-title").remove()
              original.parent().prepend "<a href=\"" + baseUrl + "#/\"><div class=\"floating-title\"><span>" + u.capitalizeWord() + "</span></div></a>"
              original.before templateData
              original.remove()
              $scope.oldUrl = oldUrl
              $scope.$broadcast "cmsView:ready", $scope
              $timeout (->
                $("body").addClass "show-sticky-bg"
                return
              ), 0
              return

          return

        return

      return

    return

clickMonad = ($timeout) ->
  
  #
  #  @ngdoc directive
  #  @name interface.directive:clickMonad
  #  @element a
  #  @function clickMonad
  #  @description
  #
  #  Prevent double trigger on click events for ng-click directives, and possibly
  #  other simple interactive captures.
  #
  #  @example
  #
  #      <a
  #        module="interface"
  #        click-monad
  #        ng-click="someFunction()"
  #      >
  #        <span class="fa fa-flash"></span>
  #      </a>
  #    
  delay = undefined
  delay = 300
  restrict: "A"
  priority: -1
  link: ($scope, element) ->
    clickHandler = undefined
    disabled = undefined
    disabled = false
    clickHandler = (event) ->
      if disabled
        event.preventDefault()
        event.stopImmediatePropagation()
      else
        disabled = true
        $timeout (->
          disabled = false
          return
        ), delay, false

    $scope.$on "$destroy", ->
      element.off "click", clickHandler

    element.on "click", clickHandler
    return


###*
Adds a special `whenAuthenticated` method onto $routeProvider. This special method,
when called, invokes Auth.$requireAuth() service (see Auth.js).

The promise either resolves to the authenticated user object and makes it available to
dependency injection (see AccountCtrl), or rejects the promise if user is not logged in,
forcing a redirect to the /login page
###

# credits for this idea: https://groups.google.com/forum/#!msg/angular/dPr9BpIZID0/MgWVluo_Tg8J
# unfortunately, a decorator cannot be use here because they are not applied until after
# the .config calls resolve, so they can't be used during route configuration, so we have
# to hack it directly onto the $routeProvider object

# AngularJS 1.1.x dropped this default Ajax HTTP Header, which Django still supports.
# @see http://django-angular.readthedocs.org/en/latest/integration.html

# Choose whether or not to use {% verbatim %} to facilitate AngularJS
# template symbols, i.e. {{ angularjs_variable_name }} won't be processed
# by Django server-side inside of a partial while other Django variables
# outside of {% verbatim %} blocks will be processed.
#
# @see http://django-angular.readthedocs.org/en/latest/integration.html
# @usage
#   {% verbatim %}
#     {{if dying}}Still alive.{{/if}}
#   {% endverbatim %}
# @usage
#   {% verbatim myblock %}
#     Avoid template rendering via the {% verbatim %}{% endverbatim %} block.
#   {% endverbatim myblock %}

# We will not use this strategy since third-party AngularJS directives might
# be used.

# @note ...

# ---
# generated by coffee-script 1.9.2
# configure static; whenAuthenticated adds a resolve method to ensure users authenticate
# before trying to access that route

###*
slice is a blob
###

#templateUrl: 'terms/2015/08/31/terms-v1/',

###*
Apply some route security. Any route's resolve method can reject the promise with
"AUTH_REQUIRED" to force a redirect. This method enforces that and also watches
for changes in auth status which might require us to navigate away from a path
that we can no longer view.
###

# watch for login status changes and redirect if appropriate

#console.log(Auth);

###*
This is primarily for minimalistic logout functionality. See SECURED_ROUTES
for route contract authentication.
###

# some of our routes may reject resolve promises with the special {authRequired: true} error
# this redirects to the login page whenever that is encountered

#
#       *$http.defaults.headers.delete['X-CSRFToken'] = $cookies.get('csrftoken');
#       *$http.defaults.headers.delete["Content-Type"] = "application/x-www-form-urlencoded";
#       

#
#       *$http.defaults.headers.patch['X-CSRFToken'] = $cookies.get('csrftoken');
#       *$http.defaults.headers.patch["Content-Type"] = "application/x-www-form-urlencoded";
#       

# used by route security
angular.module("utxoPmc").config([
  "$routeProvider"
  "SECURED_ROUTES"
  ($routeProvider, SECURED_ROUTES) ->
    $routeProvider.whenAuthenticated = (path, route) ->
      route.resolve = route.resolve or {}
      route.resolve.user = [
        "Auth"
        (Auth) ->
          return Auth.$requireAuth()
      ]
      $routeProvider.when path, route
      SECURED_ROUTES[path] = true
      $routeProvider
]).config([
  "$httpProvider"
  ($httpProvider) ->
    $httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"
]).config([
  "$interpolateProvider"
  ($interpolateProvider) ->
    return
    $interpolateProvider.startSymbol "{$"
    $interpolateProvider.endSymbol "$}"
]).factory("viewConfigurator", [
  "$locationProvider"
  viewConfigurator
]).factory("crypt", ->
  hash: (value) ->
    str = JSON.stringify(value)
    CryptoJS.SHA1(str).toString()
).factory("httpAuthInterceptor", ($q, $location) ->
  responseError: (response) ->
    if [
      401
      403
    ].indexOf(response.status) >= 0
      $location.path "/"
      response
    else
      $q.reject rejection
).config(($httpProvider) ->
  $httpProvider.interceptors.push "httpAuthInterceptor"
  return
).config([
  "localStorageServiceProvider"
  localStorageConfig
]).config([
  "$routeProvider"
  "$locationProvider"
  ($routeProvider, $locationProvider) ->
    uploadFileslice = (slice) ->
      fileReader = new FileReader()
      fileReader.onload = (event) ->
        arrayBuffer = event.target.result
        wordArray = CryptoJS.lib.WordArray.create(arrayBuffer)
        sha1crc = CryptoJS.SHA1(wordArray).toString(CryptoJS.enc.Hex)
        slice = []
        requestParams.append "fileslice", slice
        requestParams.append "sha1crc", sha1crc
        return

      fileReader.readAsArrayBuffer slice
      return
    $locationProvider.html5Mode false
    String::stylize = (type) ->
      string_construct = undefined
      c = new Chance()
      environment.route_contract = {}
      string_construct = CryptoJS.SHA1(this).toString(CryptoJS.enc.Hex)
      environment.route_contract[@toString()] = string_construct
      string_construct

    $routeProvider.when("/",
      templateUrl: "static/main.html"
      controller: "MainCtrl"
    ).when("/chat",
      templateUrl: "static/chat.html"
      controller: "ChatCtrl"
    ).when("/login",
      templateUrl: "static/login.html"
      controller: "LoginCtrl"
    ).whenAuthenticated("/account",
      templateUrl: "static/account.html"
      controller: "AccountCtrl"
    ).when("/help",
      templateUrl: "static/help.html"
      controller: "HelpCtrl"
    ).when("/contact",
      templateUrl: "static/connect.html"
      controller: "MainCtrl"
    ).when("/channel",
      templateUrl: "static/connect.html"
      controller: "MainCtrl"
    ).when("/about",
      templateUrl: "static/main.html"
      controller: "MainCtrl"
    ).when("/legal",
      templateUrl: "static/main.html"
      controller: "MainCtrl"
    ).when("/verifyOne",
      templateUrl: "static/verifyone.html"
      controller: "VerifyoneCtrl"
    ).when("/verifyTwo",
      templateUrl: "static/verifytwo.html"
      controller: "VerifytwoCtrl"
    ).when("/verifyThree",
      templateUrl: "static/verifythree.html"
      controller: "VerifythreeCtrl"
    ).when("/verifyFour",
      templateUrl: "static/verifyfour.html"
      controller: "VerifyfourCtrl"
    ).when("/" + "placeOrder".stylize("hash"),
      templateUrl: "static/placeorder.html"
      controller: "PlaceorderCtrl"
    ).when("/terms",
      templateUrl: "static/terms.html"
      controller: "TermsCtrl"
    ).when("/" + "openOrders".stylize("hash"),
      templateUrl: "static/openorders.html"
      controller: "OpenordersCtrl"
    ).when("/" + "history".stylize("hash"),
      templateUrl: "static/history.html"
      controller: "HistoryCtrl"
    ).when("/mapView",
      templateUrl: "static/mapview.html"
      controller: "MapviewCtrl"
    ).when("/refNumber",
      templateUrl: "static/refnumber.html"
      controller: "RefnumberCtrl"
    ).when("/error",
      templateUrl: "static/genericerror.html"
      controller: "GenericerrorCtrl"
    ).when("/genericError",
      templateUrl: "static/genericerror.html"
      controller: "GenericerrorCtrl"
    ).when("/takeSelfie",
      templateUrl: "static/takeselfie.html"
      controller: "TakeselfieCtrl"
    ).when("/noLocationAvailable",
      templateUrl: "static/nolocationavailable.html"
      controller: "NolocationavailableCtrl"
    ).when("/takeSelfieConfirm",
      templateUrl: "static/takeselfieconfirm.html"
      controller: "TakeselfieconfirmCtrl"
    ).when("/dashboard",
      templateUrl: "static/dashboard.html"
      controller: "DashboardCtrl"
    ).when("/landing",
      templateUrl: "static/landing.html"
      controller: "LandingCtrl"
    ).when("/completeOrder",
      templateUrl: "static/completeorder.html"
      controller: "CompleteorderCtrl"
    .when '/order',
      templateUrl: 'views/order.html'
      controller: 'OrderCtrl'
    .when '/businessCardView',
      templateUrl: 'views/businesscardview.html'
      controller: 'BusinesscardviewCtrl'
    ).otherwise redirectTo: "/"
]).run([
  "$http"
  "$cookies"
  "$rootScope"
  "$location"
  "Auth"
  "SECURED_ROUTES"
  "loginRedirectPath"
  "$geolocation"
  "$window"
  ($http, $cookies, $rootScope, $location, Auth, SECURED_ROUTES, loginRedirectPath, $geolocation, $window) ->
    check = (user) ->
      console.log user
      $location.path loginRedirectPath  if not user and authRequired($location.path())
      return
    authRequired = (path) ->
      console.log path
      SECURED_ROUTES.hasOwnProperty path
    $rootScope.moment = moment
    $rootScope.$ = jQuery
    $rootScope.numeral = numeral
    $rootScope.openInMap = (daddr) ->
      if (navigator.platform.indexOf("iPhone") isnt -1) or (navigator.platform.indexOf("iPod") isnt -1) or (navigator.platform.indexOf("iPad") isnt -1)
        $window.open "maps://maps.google.com/maps?daddr=" + daddr + "&amp;ll=", "_blank"
      else
        $window.open "http://maps.google.com/maps?daddr=" + daddr + "&amp;ll=", "_blank"
      return

    $rootScope.openWithDirectionsInMap = (daddr) ->
      $geolocation.getCurrentPosition(timeout: 60000).then ((position) ->
        _saddr = [
          position.coords.latitude
          position.coords.longitude
        ]
        saddr = _saddr.join(",")
        if (navigator.platform.indexOf("iPhone") isnt -1) or (navigator.platform.indexOf("iPod") isnt -1) or (navigator.platform.indexOf("iPad") isnt -1)
          $window.open "maps://maps.google.com/maps?daddr=" + daddr + "&saddr=" + saddr + "&amp;ll=", "_blank"
        else
          $window.open "http://maps.google.com/maps?daddr=" + daddr + "&saddr=" + saddr + "&amp;ll=", "_blank"
        return
      ), ->
        console.log "Person Current Location Provided."
        return

      return

    Auth.$onAuth check
    $rootScope.$on "$locationChangeStart", (e, newLocation) ->
      console.dir e
      console.dir newLocation
      route_construct = _.extend({}, newLocation.split("/"))
      try
        logoutLink = "logout".stylize("hash")
        Auth.$unauth()  if newLocation and _.size(route_construct) is 5 and newLocation.indexOf(logoutLink) isnt -1
      catch e
        console.dir "Fresh session loaded."
      return

    $rootScope.$on "$routeChangeError", (e, next, prev, err) ->
      $location.path loginRedirectPath  if err is "AUTH_REQUIRED"
      return

    $http.defaults.headers.put["X-CSRFToken"] = $cookies.get("csrftoken")
    $http.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded"
    $http.defaults.headers.post["X-CSRFToken"] = $cookies.get("csrftoken")
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"
]).directive("clickMonad", [
  "$timeout"
  clickMonad
]).directive("cmsView", [
  "$http"
  "$templateCache"
  "$location"
  "$timeout"
  "$rootScope"
  cmsView
]).directive("breadcrumb", [
  "$location"
  breadcrumb
]).constant "SECURED_ROUTES",
  "/verifyOne": true
  "/verifyTwo": true
  "/verifyThree": true
  "/verifyFour": true

$(document).ready ->

