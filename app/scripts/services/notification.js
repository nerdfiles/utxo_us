'use strict';

/**
 * @ngdoc factory
 * @name utxoPmc.notification
 * @description
 * # notification
 * Factory in the utxoPmc to handle notifications throughout the application.
 */
angular.module('utxoPmc')
  .factory('notification', function ($http, $q) {

    var
    __interface__ = {},
    current_error_content = null;

    __interface__.currentStatus = null;
    __interface__.logglyQueue = [];
    __interface__.cancelTransfer = false;


   /**
     * @ngdoc
     * @name utxoPmc.notification#revealError
     * @methodOf utxoPmc.notification
     *
     * @description
     * Reveals errors through a toast of Materialize.
     * @example
     * notification.revealError(message_construct);
     * @param {string} A message to reveal to the user.
     * @returns {httpPromise} resolve with fetched data, or fails with error
     * description.
     */
    __interface__.revealError = function (message_construct) {

      var
      def = $q.defer();

      $timeout(function () {
        def.resolve(Materialize.toast(message_construct, 4000));
      }, 0);
      if (!message_construct)  def.reject(false);
      return def.promise;
    };


   /**
     * @ngdoc
     * @name utxoPmc.notification#postOrder
     * @methodOf utxoPmc.notification
     *
     * @description
     * Reveals errors through a toast of Materialize.
     * @example
     * notification.postOrder(message_construct);
     * @param {string} A message to reveal to the user.
     * @returns {httpPromise} resolve with fetched data, or fails with error
     * description.
     */
    __interface__.postOrder = function (message_construct) {

      var
      _formObject = {
        message_construct: message_construct
      },
      payload = $.param(_formObject),
      _url = environment.rest.placeorder;

      return $http.post(_url,
        payload).success(function (response) {
          console.log(response);
        })
        .error(function (errorResponse) {
          console.log(errorResponse);
        });
    };


   /**
     * @ngdoc
     * @name utxoPmc.notification#postMessage
     * @methodOf utxoPmc.notification
     *
     * @description
     * Post a message to Slack.
     * @example
     * notification.postMessage(message_construct);
     * @param {string} A message to reveal to the user.
     * @returns {httpPromise} resolve with fetched data, or fails with error
     * description.
     */
    __interface__.postMessage = function (message_construct) {

      var
      _formObject = {
        message_construct: message_construct
      },
      payload = $.param(_formObject),
      _url = environment.rest.help;

      return $http.post(_url,
        payload).success(function (response) {
          console.log(response);
        })
        .error(function (errorResponse) {
          console.log(errorResponse);
        });
    };


   /**
     * @ngdoc
     * @name utxoPmc.notification#displayError
     * @methodOf utxoPmc.notification
     *
     * @description
     * Displays a generic error.
     * @example
     * notification.displayError(message_construct);
     * @param {string} A message to reveal to the user.
     * @returns {httpPromise} resolve with fetched data, or fails with error
     * description.
     */
    __interface__.displayError = function (errorData) {

      return;
    };


   /**
     * @ngdoc
     * @name utxoPmc.notification#displayNote
     * @methodOf utxoPmc.notification
     *
     * @description
     * Display a default notification to the user.
     * @example
     * notification.displayNote(message_construct);
     * @param {string} A message to reveal to the user.
     * @returns {httpPromise} resolve with fetched data, or fails with error
     * description.
     */
    __interface__.displayNote = function (noteData) {

      return;
    };


    return __interface__;
  });
