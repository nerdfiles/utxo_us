'use strict';

/**
 * @ngdoc function
 * @name utxoPmc.controller:ContactCtrl
 * @description
 * # ContactCtrl
 * Controller of the utxoPmc. Depends on UserInfo to create an transient user
 * handle based on IP Address.
 */
angular.module('utxoPmc')
  .controller('ContactCtrl', function ($scope, $timeout, notification, crypto) {

    /**
     * @ngdoc
     * @name utxoPmc.ContactCtrl#addMessage
     * @methodOf utxoPmc.ContactCtrl
     *
     * @description
     * Method to post to Slack #help chat.
     * @example
     * ng-init="addMessage(newMessage);"
     * @param   {string} A string representing the users message.
     * @returns {undefined}
     */
    $scope.addMessage = function (message_construct) {

      $scope.showConfirmation = true;
      UserInfo.getInfo(function (data) {

        var
        id = crypto.hash(data.ip_address);

        notification.postMessage(id.slice(0, 9) + ': ' + message_construct);
        return;
      }, function (err) {

        notification.revealError(err).then(function (materializedError) {
          console.log(materializedError);
        });

        return;
      });

      $timeout(function () {

        $scope.showConfirmation = false;
      }, 3000);

      return;
    };

  });
