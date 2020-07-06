"use strict"

###*
@ngdoc function
@name muck2App.controller:AccountCtrl
@description
# AccountCtrl
Provides rudimentary account management functions.
###
angular.module("utxoPmc").controller "AccountCtrl", ($scope, Auth, Ref, $firebaseObject, $timeout, person) ->
  
  #var profile = $firebaseObject(Ref.child('users/' + user.uid));
  #profile.$bindTo($scope, 'profile');
  
  #
  #     *$scope.changePassword = function(oldPass, newPass, confirm) {
  #     *  $scope.err = null;
  #     *  if( !oldPass || !newPass ) {
  #     *    error('Please enter all fields');
  #     *  }
  #     *  else if( newPass !== confirm ) {
  #     *    error('Passwords do not match');
  #     *  }
  #     *  else {
  #     *    Auth.$changePassword({email: profile.email, oldPassword: oldPass, newPassword: newPass})
  #     *      .then(function() {
  #     *        success('Password changed');
  #     *      }, error);
  #     *  }
  #     *};
  #     
  
  #
  #     *$scope.changeEmail = function(pass, newEmail) {
  #     *  $scope.err = null;
  #     *  Auth.$changeEmail({password: pass, newEmail: newEmail, oldEmail: profile.email})
  #     *    .then(function() {
  #     *      profile.email = newEmail;
  #     *      profile.$save();
  #     *      success('Email changed');
  #     *    })
  #     *    .catch(error);
  #     *};
  #     
  error = (err) ->
    alert err, "danger"
    return
  success = (msg) ->
    alert msg, "success"
    return
  alert = (msg, type) ->
    obj =
      text: msg + ""
      type: type

    $scope.messages.unshift obj
    $timeout (->
      $scope.messages.splice $scope.messages.indexOf(obj), 1
      return
    ), 10000
    return
  $scope.logout = ->
    Auth.$unauth()
    return

  $scope.messages = []
  return

