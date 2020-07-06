// Generated by CoffeeScript 1.7.1
(function() {
  'use strict';

  /**
    * @ngdoc directive
    * @name utxoPmc.directive:feedback
    * @description
    * # feedback
   */
  angular.module('utxoPmc').directive('feedback', function(notification, crypto, $timeout, $location) {
    return {
      restrict: 'EA',
      templateUrl: '/static/feedback.html',
      link: function($scope, element, attrs) {

        element.on('click.focusing', function () {
          element.addClass('focused');
        });

        element.find('.close').on('click.unfocusing', function () {
          element.removeClass('focused');
        });

        element.find('#person__latest_feedback').on('blur', function () {
          element.removeClass('focused');
        });

        /**
         * @ngdoc
         * @name utxoPmc.feedback#addFeedback
         * @methodOf utxoPmc.feedback
         *
         * @description
         * A persistent directive for posting feedback.
         * @example
         * ng-submit="addFeedback(newFeedback);"
         * @param   {string} A string representing the users feedback.
         * @returns {undefined}
         */
        $scope.addFeedback = function (feedback_construct) {
          $scope.new_feedback = $scope.newFeedbackId + ':' + feedback_construct

          if (!$scope.n)
            return;

          $scope.showConfirmation = true;

          UserInfo.getInfo(function (data) {

            var
            id = crypto.hash(data.ip_address);

            notification.postMessage(id.slice(0, 9) + '/' + $location.$$path + ': ' + $scope.n);
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

      }
    };
  });

}).call(this);
