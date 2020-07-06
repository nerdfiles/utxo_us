/* @global environment
 */
'use strict';

var BASE64_MARKER = ';base64,';

function convertDataURIToBinary(dataURI) {
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for(i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

/**
 * @ngdoc function
 * @name utxoPmc.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the utxoPmc
 */
angular.module('utxoPmc')

  .directive('customOnChange', function() {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var onChangeHandler = scope.$eval(attrs.customOnChange);
        element.bind('change', onChangeHandler);
      }
    };
  })

  .controller('DashboardCtrl', function ($scope, $http, person, people, $timeout, $window, crypto, $location, $rootScope, $controller) {
    /*
      @description
        Open, means order was placed - customer may or may not have paid (uploaded the receipt), or been automatically flagged (if amount is over $10k).
        Confirmed, means UTXO has confirmed that they've sent the bitcoin (the transaction is effectively closed, though notes can be added).
        Expired, means that the time allocated for the bitcoin price has expired and the customer hasn't uploaded the receipt (in effect just ordered and did nothing).
        FinCen, means that the customer was automatically flagged for 10k and above, OR was flagged for suspicious activity statements.
        Scan Error, means that there is a problem with the receipt and information received, or there is a suspicious of malicious intent.
        Paid, means that the customer has uploaded the scanned receipt, ready for action from UTXO.
     */

    var n = $scope.$new();

    var _n = $controller('MainCtrl', { $scope: n });
    console.dir(_n);

    $timeout(function () {
      $scope.$broadcast('cmsView:ready', $scope);
      $scope.cmsViewReady = $rootScope.cmsViewReady = true;
      $scope.$apply();
      console.log($scope);
    }, 0);

    $scope.currentTime = null;
    $scope.adminTime = function () {
      $scope.currentTime = moment().format('ddd, d MMM YYYY HH:00');
      var portSpec = $window.location.port != "" ? (':' + $window.location.port) : '';
      var hostname = $window.location.hostname + portSpec;
      $scope.logoutLink = $window.location.protocol + '//' + hostname + '/dashboard/logout';
    };

    $scope.refreshOrdersList = function () {
      $timeout(function () {
        $scope.loadMoreManagementRows();
        $scope.$apply();
      }, 300);
    };

    $scope.exitAdmin = function () {
      var portSpec = $window.location.port != "" ? (':' + $window.location.port) : '';
      var hostname = $window.location.hostname + portSpec;
      $scope.baseLink = $window.location.protocol + '//' + hostname + '/#/';
      $location.path($scope.baseLink);
    };

    $scope.adminCredentials = function () {
      var portSpec = $window.location.port != "" ? (':' + $window.location.port) : '';
      var hostname = $window.location.hostname + portSpec;
      var currentUserUrl = $window.location.protocol + '//' + hostname + '/api/users/current/';
      $http.get(currentUserUrl).success(function (responseData) {
        $scope.admin = {
          $meta: responseData
        };
        console.log($scope);
      }).error(function (errorData) {
        console.dir(errorData);
      });
    };

    $scope.uploadReport = function (event) {
      var reader = new FileReader();
      var files = event.target.files;
      if (files.length === 0) {
        return;
      }
      reader.onload = function () {
        var pdf_prefix = 'data:application/pdf;base64,';
        var data = reader.result;
        var base64 = data.replace(/^[^,]*,/, '');
        $timeout(function () {
          $scope.loadedPerson.fincen_state3 = pdf_prefix + base64;
          $scope.$apply();
        }, 0);
      }
      reader.readAsDataURL(files[0]);
    };

    $scope.openPdf = function () {
      $window.open($scope.loadedPerson.fincen_state3, '_blank', 'location=no,enableviewportscale=yes');
      return;
    };

    $scope.sendSms = function (type) {
      /**
       * @todo Change selfie of given item to remove image data stored on @prop selfie_link and @prop status == '0'.
       */
      var contact_person = $scope.loadedPerson;
      var handle = contact_person.$handle;
      var portSpec = $window.location.port != "" ? (':' + $window.location.port) : '';
      var hostname = $window.location.hostname + portSpec;
      var message_construct = {
        'update-price'  : 'We have updated the price point on your order ' + $window.location.protocol + '//' + hostname + '/en/#/order/updated-price/' + contact_person.$id + ' per the latest Bitfinex (https://bfxdata.com) exchange rates.',
        'force-exp'     : 'We have forced an expiration of the following place order ' + $window.location.protocol + '//' + hostname + '/en/#/order/forced-expiration/' + contact_person.$id,
        'retake-selfie' : 'We found a problem with your selfie for order ' + $window.location.protocol + '//' + hostname + '/en/#/order/retake-selfie/' + contact_person.$id + ' Please re-take it!',
        'completed'     : 'We have completed your order ' + $window.location.protocol + '//' + hostname + '/en/#/order/completed-order/' + contact_person.$id,
        'extend-order'  : 'We have extended the time on your order to ' + contact_person.updated__time
      };
      person.sendSms(handle, message_construct[type]);
      return;
    };

    $scope.check_selfie = function (loadedPerson) {
      console.log(loadedPerson);
      $('#selfie-modal').openModal({
        dismissible  : true,
        opacity      : .5,
        in_duration  : 300,
        out_duration : 200,
        ready: function() {
        },
        complete: function() {
        }
      });
      return;
    };

    $scope.close_check_selfie = function () {
      $('#selfie-modal').closeModal();
    };

    $scope.filterBy = function (selected) {
      $scope.filterBySelected = selected;
    };

    $scope.filterTypes = [
      { filterTypeName: 'Open'       , filterTypeAlias: 'open' }       ,
      { filterTypeName: 'Confirmed'  , filterTypeAlias: 'confirmed' }  ,
      { filterTypeName: 'Expired'    , filterTypeAlias: 'expired' }    ,
      { filterTypeName: 'FinCEN'     , filterTypeAlias: 'fincen' }     ,
      { filterTypeName: 'Scan-Error' , filterTypeAlias: 'scan-error' } ,
      { filterTypeName: 'Paid'       , filterTypeAlias: 'paid' }
    ];

    $scope.$watch('loadedPerson.updated__time', function (newVal, oldVal) {
      if (newVal) {
        $scope.sendSms('extend-order');
      }
    });

    function API() {
      this.version = '0.0.1';
    }
    var _this = this;

    var btce_version = 3;

    API.prototype.ticker = function(pair){
      // @see https://btc-e.com/api/3/docs#ticker
      var obj;
      var def = $q.defer();
      var portSpec = $window.location.port != "" ? (':' + $window.location.port) : '';
      var hostname = $window.location.hostname + portSpec;
      $.ajax({
              async : false,
              type : 'GET',
              //url : 'https://btc-e.com/api/'+btce_version+'/ticker/'+pair,
              url : $window.location.protocol + '//'+hostname+'/ticker',
              dataType : 'json',
              success : function(data) {
                def.resolve(data.data.btc_usd);
              }
          });

        return def.promise;
    };

    $scope.submitManagementRow = function (loadedPerson) {

      var _id = loadedPerson.$person_id;
      var last_order = crypto.hash(moment(loadedPerson.timestamp).toString());
      var _personOrder = loadedPerson;
      var cachedPersonOrder = angular.copy(_personOrder);

      if (cachedPersonOrder.confirmed == 'true') {
        cachedPersonOrder.status = '1'; // '1' === closed, '0' === open
        var btc_address_prefix = 'https://blockchain.info/address/';
        cachedPersonOrder.completed__link = btc_address_prefix + cachedPersonOrder.btc_address
      }

      if (cachedPersonOrder.force_exp === 'true') {
        cachedPersonOrder.expired = 'true';
      }

      if (cachedPersonOrder.extend__time !== '') {
        cachedPersonOrder.expired = 'false';
        var extend_time_construct = cachedPersonOrder.extend__time.split(':');
        var mins = parseInt(extend_time_construct[0]);
        var secs = (extend_time_construct[1]) ? parseInt(extend_time_construct[1]) : '0';
        var ext_time = (cachedPersonOrder.updated__time != '') ? moment(cachedPersonOrder.updated__time) : moment(new Date());
        var _ext_time = ext_time.add(mins, 'minutes').add(secs, 'seconds');
        var label_ext_time = _ext_time.toString();
        cachedPersonOrder.updated__time = label_ext_time;
        loadedPerson.updated__time = label_ext_time;
        cachedPersonOrder.extend__time = '';
      }

      if (cachedPersonOrder.extend__price === 'true') {
        cachedPersonOrder.extend__price = 'false';
      }

      delete cachedPersonOrder['$id'];
      delete cachedPersonOrder['$$hashKey'];
      delete cachedPersonOrder['state'];
      delete cachedPersonOrder.$handle;
      delete cachedPersonOrder.$person_id;
      delete cachedPersonOrder.$person;
      delete cachedPersonOrder.$verification;
      delete cachedPersonOrder.conversion_statement;
      //delete cachedPersonOrder.sms_request__update_price;

      if (cachedPersonOrder.extend__price) {

        var api = new API();
        api.ticker().then(function (data) {
          var btc_usd = data;
          var last = btc_usd.last;
          var factor = (person.isAfterdark == true) ? 0.06 : 0.15;
          var _dd = parseFloat(last) / (1 + 0.06);
          var priceExtension = (parseFloat(_dd) * factor);
          var updatedDataBtcPriceValue = parseFloat(_dd) + priceExtension;
          cachedPersonOrder.generated_price = updatedDataBtcPriceValue;

          var strategy = {
            handle   : _id,
            property : 'orders' + '/' + last_order,
            payload  : cachedPersonOrder
          };

          person.order(strategy).then(function (orderData) {
            console.log(orderData);
            //Materialize.toast('Order has been updated!', 4000);
          }, function (errorData) {
            console.log(errorData);
          });

        });

      } else {

        var strategy = {
          handle   : _id,
          property : 'orders' + '/' + last_order,
          payload  : cachedPersonOrder
        };

        person.order(strategy).then(function (orderData) {
          console.log(orderData);
          //Materialize.toast('Order has been updated!', 4000);
        }, function (errorData) {
          console.log(errorData);
        });

      }

    };

    $scope.loadManagementRow = function (managementRow) {

      $timeout(function () {
        managementRow.human_readable_timestamp = moment(managementRow.timestamp).toString();
        $scope.loadedPerson = managementRow;
        $scope.$apply();
      }, 0);

    };

    $scope.loadMoreManagementRows = function () {
      /**
       * Load More Management Rows
       */
      person.all().then(function (data) {
        var managementRows = [];
        _.forEach(people.list.data, function (personData, personDataKeyname) {
          if (personData.orders) {
            _.forEach(personData.orders, function (order, keyname) {
              order.$id = keyname;
              order.$handle = personData.phone_number;
              order.$person_id = personDataKeyname;
              order.$person = personData.overview;
              order.$verification = personData.verification;
              order.conversion_statement = numeral(order.usd).format('0,00') + '-' + order.btc;
              order.state = [];
              if (eval(order.fincen_state1)) {
                order.state.push({ alias: 'fincen1' });
              }
              if (eval(order.fincen_state2)) {
                order.state.push({ alias: 'fincen2' });
              }
              if (eval(order.selfie_state1)) {
                order.state.push({ alias: 'selfie1' });
              }
              if (eval(order.selfie_state2)) {
                order.state.push({ alias: 'selfie2' });
              }
              if (eval(order.selfie_state3)) {
                order.state.push({ alias: 'selfie3' });
              }
              if (eval(order.paid) === true) {
                order.state.push({ alias: 'paid' });
              }
              managementRows.push(order);
            });
          }
        });
        managementRows.sort(function (a, b) {
          var _b = new Date(b.timestamp);
          var _a = new Date(a.timestamp);
          return _b.getTime() - _a.getTime();
        });
        $scope.managementRows = managementRows;
      });

    };

  });
