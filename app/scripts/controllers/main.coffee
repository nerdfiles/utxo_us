'use strict'

###*
# @ngdoc function
# @name utxoPmc.controller:MainCtrl
# @description
# # MainCtrl
# Controller of the utxoPmc
###

angular.module('utxoPmc').factory('$api', ($http) ->
  __interface__ = {}
  __interface__.segmentio = {}

  __interface__.segmentio.apiKey = ->
    portSpec = if $window.location.port != '' then ':' + $window.location.port else ''
    hostname = $window.location.hostname + portSpec
    url = $window.location.protocol + '//' + hostname + '/api/segmentio/apikey'
    $http(url).success (responseData) ->
      __interface__.__api__ = {}
      __interface__.__api__['/api/segmentio/apikey'] = responseData.data.mainEntity
      return

  __interface__
).controller 'MainCtrl', ($scope, authentication, $location, $window, person, Ref, segmentio, $api, $http, crypto, localStorageService, notification) ->

  ###
  #$api.segmentio.apiKey().then(function (key) {
  #  segmentio.load(key.data.content);
  #});
  ###

  portSpec = if $window.location.port != '' then ':' + $window.location.port else ''
  hostname = $window.location.hostname + portSpec
  loaded = false
  $scope.smsAuthentication = {}
  $scope.smsAuthentication.phone_number = null
  $scope.validate_phone_number_form = {}
  $scope.validate_phone_number_form.validated = false

  $scope.addMessage = (message_construct) ->
    $scope.showConfirmation = true
    UserInfo.getInfo ((data) ->
      id = crypto.hash(data.ip_address)
      notification.postMessage id.slice(0, 9) + ': ' + message_construct
      return
    ), (err) ->
    $timeout (->
      $scope.showConfirmation = false
      return
    ), 3000
    return

  $scope.$watch 'smsAuthentication.phone_number', (newVal) ->
    if newVal == undefined or newVal == null
      return
    if newVal == ''
      loaded = false
    return
  $scope.$watch 'smsAuthentication.sec_number', (newVal, oldVal) ->

    ###*
    # SMS Authentication Number Security
    ###

    if viewConfigurator.DEBUG == true
      $location.path 'verifyOne'
    if newVal and newVal == $scope.validate_phone_number_form.secCheck
      Ref.authAnonymously (error, authData) ->
        if error
        else
          secured_phone = $scope.smsAuthentication.phone_number
          _secured_phone = '' + crypto.encrypt(secured_phone, authData.token)
          localStorageService.set 'hook', _secured_phone
          # Refresh session.
          person.session.user = authData
          if person.current and person.current.overview and person.current.overview.terms == 'true'
            if person.current.verification
              $location.path 'e24a4f9e18cf2fbba29b82d9b6b899aff70e10ea'
            else
              $location.path 'verifyOne'
          else
            $location.path 'terms'
        return
    return

  $scope.validate_phone_number = ->

    ###*
    # Validate Phone Number to initialize Blockscore
    ###

    if $scope.validate_phone_number_form.$invalid == true
      # We've received a response from the backend to authenticate the given person (People).
      return
    if loaded == false
      loaded = true
    else
      return
    formObject = $scope.smsAuthentication
    formObject.phone_number = $scope.smsAuthentication.phone_number
    authentication.validate_phone_number(formObject).then ((validatedForm) ->

      ###*
      # Successful Validation Condition
      ###

      $scope.validate_phone_number_form.validated = true
      $scope.validate_phone_number_form.s = validatedForm
      $scope.validate_phone_number_form.sec = validatedForm.data.split(': ')
      $scope.validate_phone_number_form.secCheck = _.last($scope.validate_phone_number_form.sec)
      phone_number = formObject.phone_number
      try
        # Assuming validation success, pull up the relevant person by phone if available in Firebase.
        person.get(
          mode: 'byId'
          handle: phone_number).then ((personData) ->
          `var personData`
          personData = if personData != null then personData else {}
          $scope.validate_phone_number_form.$person = personData
          if personData
            person.current = personData
          return
        ), (errorData) ->
          $scope.validate_phone_number_form.$person = person.current = errorData
          return
      catch e
        console.log e
      return
    ), (errorData) ->

      ###*
      # Error Validation Condition
      ###

      $scope.validate_phone_number_form.validated = false
      $scope.validate_phone_number_form.error = true
      $scope.validate_phone_number_form.$person = errorData
      return
    return

  $scope.$watchCollection 'validate_phone_number_form.$person', (newVal, oldVal) ->

    ###*
    # User Not Found, but User has provided a phone number.
    #
    # $person on `$scope.validate_phone_number_form` will no longer be `undefined` but an empty object.
    ###

    formConstruct = {}
    formConstruct.phone_number = $scope.smsAuthentication.phone_number
    _payload = formConstruct
    # User does not exist, create user with basic properties.
    if _payload and _payload.phone_number and !person.current.phone_number
      person.push(payload: _payload).then ((personData) ->
        UserInfo.getInfo ((data) ->
          person.canonical = crypto.hash(data.ip_address)
        return
      ), (errorData) ->
      person.current = errorData
    return
  return

