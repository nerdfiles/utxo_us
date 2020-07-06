'use strict';

/**
 * @ngdoc function
 * @name utxoPmc.controller:TakeselfieconfirmCtrl
 * @description
 * # TakeselfieconfirmCtrl
 * Controller of the utxoPmc
 */
angular.module('utxoPmc')
  .controller('TakeselfieconfirmCtrl', function ($scope, $location, $window, person, $timeout, crypto, authentication) {
    $scope.person = {};
    $scope.loadedImg = false;

    function el (id) {
      return document.querySelector('#' + id);
    }

    function readImage() {
      if ( this.files && this.files[0] ) {
        var FR= new FileReader();
        $scope.loadedImg = true;
        FR.onload = function(e) {
          el("img").src = e.target.result;
          $timeout(function () {
            $scope.person.order.selfie_link = e.target.result;
            $scope.$apply();
          }, 0)
        };
        FR.readAsDataURL( this.files[0] );
      }
    }

    angular.element(document).ready(function () {
      try {
        var img$ = $("#img");
        console.dir(img$);
        img$.on("click", function () {
          $("#cameraInput").trigger('click');
        }, false);

        el("cameraInput").addEventListener("change", readImage, false);

      } catch (e) {
        console.log(e);
      }
    });

    $scope._id = null;
    authentication.loadSession().then(function () {
      $scope.person = person.current;

      if (person && person.current && person.current.$id) {
        $scope._id = person.current.$id;
      }


      if (person && person.current && person.current.data && person.current.data.data) {
        $scope._id = person.current.data.data.name;
      }

    });

    $scope.remove = function () {

      angular.element(document).ready(function () {
        var $ngPiv = $('.selfie-snapshot img');
        $scope.person.order.selfie_link = '';
        $ngPiv.prop('src', '');
        //$ngPiv.remove();
      });
    };

    $scope.$watch('person.order.selfie_link', function (newVal, oldVal) {

      if (newVal) {

        $timeout(function () {
          $scope.person.order.selfie_link = newVal;
          $scope.$apply();
        }, 0);

        angular.element(document).ready(function () {
          var $ngCamera = angular.element(document.querySelector('#ng-camera-action'));
          $ngCamera.text('re-take');
        });
      }
    });

    $scope.viewerHeight = $window.innerHeight / 1.15;
    $scope.is_iOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false)
    $scope.viewerWidth = $window.innerWidth;

    $scope.updatePerson = function (_person) {

      var l = moment(person.current.order.timestamp).toString();
      _person.order.paid = 'true';

      var strategy = {
        handle   : $scope._id,
        property : 'orders' + '/' + crypto.hash(l),
        payload  : _person.order
      };

      person.order(strategy).then(function (orderData) {
        console.log(orderData);
        console.log($scope.person);
        $location.path('/completeOrder');
      }, function (errorData) {
        $location.path('/error');
      });

    };

  });
