"use strict"

###*
@ngdoc function
@name utxoPmc.controller:LoginCtrl
@description
# LoginCtrl
Manages authentication to any active providers.
###
angular.module("utxoPmc").controller "LoginCtrl", ($scope, Auth, $location, $q, Ref, $timeout) ->
  
  # authenticate so we have permission to write to Firebase
  firstPartOfEmail = (email) ->
    ucfirst email.substr(0, email.indexOf("@")) or ""
  ucfirst = (str) ->
    
    # inspired by: http://kevin.vanzonneveld.net
    str += ""
    f = str.charAt(0).toUpperCase()
    f + str.substr(1)
  redirect = ->
    $location.path "/account"
    return
  showError = (err) ->
    $scope.err = err
    return
  $scope.oauthLogin = (provider) ->
    $scope.err = null
    Auth.$authWithOAuthPopup(provider,
      rememberMe: true
    ).then redirect, showError
    return

  $scope.anonymousLogin = ->
    $scope.err = null
    Auth.$authAnonymously(rememberMe: true).then redirect, showError
    return

  $scope.passwordLogin = (email, pass) ->
    $scope.err = null
    Auth.$authWithPassword(
      email: email
      password: pass
    ,
      rememberMe: true
    ).then redirect, showError
    return

  $scope.createAccount = (email, pass, confirm) ->
    createProfile = (user) ->
      ref = Ref.child("users", user.uid)
      def = $q.defer()
      ref.set
        email: email
        name: firstPartOfEmail(email)
      , (err) ->
        $timeout ->
          if err
            def.reject err
          else
            def.resolve ref
          return

        return

      def.promise
    $scope.err = null
    unless pass
      $scope.err = "Please enter a password"
    else if pass isnt confirm
      $scope.err = "Passwords do not match"
    else
      Auth.$createUser(
        email: email
        password: pass
      ).then(->
        Auth.$authWithPassword
          email: email
          password: pass
        ,
          rememberMe: true

      ).then(createProfile).then redirect, showError
    return

  return

