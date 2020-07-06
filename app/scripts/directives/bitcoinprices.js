'use strict';

/**
 * @ngdoc directive
 * @name utxoPmc.directive:bitcoinPrices
 * @description
 * # bitcoinPrice
 */
angular.module('utxoPmc')
  .directive('bitcoinPrices', function ($http, $timeout, $q, $interval, $rootScope, $window, $location) {
    return {
      restrict    : 'A',
      templateUrl : '/static/bitcoin-prices.html',
      link        : function postLink($scope, element, attrs) {

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

        API.prototype.trades = function(pair){
          // @see https://btc-e.com/api/3/docs#trades
          var obj;
          $.ajax({
                 async : false,
                 type : 'GET',
                 url : 'https://btc-e.com/api/'+btce_version+'/'+pair+'/trades',
                 dataType : 'json',
                 success : function(data){
                   obj = data;
                 }
              });
          return obj;
        };

        API.prototype.depth = function(pair){
          // @see https://btc-e.com/api/3/docs#depth
          var obj;
          $.ajax({
                 async : false,
                 type : 'GET',
                 url : 'https://btc-e.com/api/'+btce_version+'/'+pair+'/depth',
                 dataType : 'json',
                 success : function(data){
                   obj = data;
                 }
              });
          return obj;
        }

        API.prototype.info = function(){
          // @see https://btc-e.com/api/3/docs#info
          var obj;
          $.ajax({
                 async : false,
                 type : 'GET',
                 url : 'https://btc-e.com/api/'+btce_version+'/info',
                 dataType : 'json',
                 success : function(data){
                   obj = data;
                 }
              });
          return obj;
        };

        API.prototype.historical = function(currency){
          // @see http://www.coindesk.com/api/
          var obj;
          var _currency = currency || 'USD';
          var params = '?currency=' + _currency;
          var baseHistoricalEndpoint = 'https://api.coindesk.com/v1/bpi/historical/close.json';
          //var baseHistoricalEndpoint = 'https://api.bitfinex.com/v1/pubticker/btc';
          var portSpec = $window.location.port !== "" ? (':' + $window.location.port) : '';
          var hostname = $window.location.hostname + portSpec;
          var url = $window.location.protocol + '//' + hostname + '/ticker/historical';
          var baseHistoricalEndpoint = url;
          var def = $q.defer();
          $.ajax({
            async : false,
            type : 'GET',
            url : baseHistoricalEndpoint + params,
            dataType : 'json',
            success : function(data){
              //def.resolve(data.data.btc_usd);
              obj = data;
            }
          });
          //return def.promise;
          return obj;
        };

        var widthCalc = function () {
          var def = $q.defer();
          $timeout(function () {
            var width = $('[bitcoin-prices]').width() / 2;
            def.resolve(width);
          }, 750);
          return def.promise;
        };


        var loader = function () {

          // Bitcoin Historical Prices Ticker Line Graph
          var seriesData = [];
          var eur_seriesData = [];
          var cny_seriesData = [];
          var min = Number.MAX_VALUE;
          var max = Number.MIN_VALUE;
          var api = new API();
          var historical;

          api.ticker().then(function (data) {
            $scope.btc_usd = data;
            $scope.arrow_up = $scope.btc_usd.last > $scope.btc_usd.avg;
          });

          try {
            historical = $scope.historical = api.historical();
          } catch (e) {
            console.dir(e);
            return;
          }

          if (!historical || !historical.bpi) {
            return;
          }

          _.forEach(historical.bpi, function (priceConstruct, datetimeKey) {
            var d = new Date(datetimeKey);
            seriesData.push({
              x: Math.round( +d / 1000 ),
              y: Math.round( priceConstruct / .1 )
            });
          });

          seriesData = seriesData.sort(function (a, b) {
            return a.x - b.x;
          });

          for (i = 0; i < seriesData.length; i++) {
            min = Math.min(min, seriesData[i].y);
            max = Math.max(max, seriesData[i].y);
          }

          var logScale = d3.scale.log().domain([
            min/1.15,
            max
          ]);

          $rootScope.$watch('loadedCmsViewReady', function (newVal, oldVal) {
            if (newVal) {
              widthCalc().then(function (_width) {

                var graph = new Rickshaw.Graph({
                  element  : $("#chart")[0],
                  width    : _width,
                  height   : 65,
                  renderer : 'line',
                  series: [
                    {
                      color: "#fff",
                      data: seriesData,
                      name: "<i class='fa fa-btc'></i>",
                      scale: logScale
                    }
                  ]
                });

                graph.render();

                var axes = new Rickshaw.Graph.Axis.Time({
                  graph: graph
                });

                axes.render();
              });
            }
          });
        };

        $timeout(function () {
          loader();
        }, 0);

        var _now = moment().hour(18);
        var __now = moment().hour(8);
        var now = moment();
        var countDownTime;
        $scope.timemode = {
          '1.06': undefined,
          '1.15': undefined
        };


        $scope.isAfterdark = now.isAfter(_now) || now.isBefore(__now);

        if (!$scope.isAfterdark) {
          countDownTime = _now.format('MM/DD/YYYY HH:MM:SS');
        } else {
          countDownTime = __now.format('MM/DD/YYYY HH:MM:SS');
        }
        $scope.btcloaded = false;
        $(document).bind('marketdataavailable', function () {

          if ($scope.isAfterdark) {
            $scope.timemode['1.06'] = false;
          } else {
            $scope.timemode['1.15'] = false;
          }
          $scope.$apply();
        });
        $timeout(function () {
          $scope.btcPriceReady = true;
          $scope.dataBtcPriceLoaded = true;
          $scope.$apply();
          $scope.btcloaded = true;
        }, 0);

        var updatePrice = function () {

          // Bitcoin Prices
          $(document).ready(function() {
            var h = $location.hostname;
            var portSpec = $window.location.port != "" ? (':' + $window.location.port) : '';
            var hostname = $window.location.hostname + portSpec;

            var btcp = bitcoinprices.init({
                url: $window.location.protocol + '//' + hostname+"/ticker/avg",
                priceAttribute: "data-btc-price",
                marketRateVariable: "last",
                currencies: [
                  "USD"
                ],
                symbols: {
                    "USD": "<i class='fa fa-usd'></i>"
                },
                defaultCurrency: "USD",
                ux : {
                    clickPrices : true,
                    menu : true
                },
                jQuery: jQuery
            });

            $('.sub-price--countdown')
              .countdown(countDownTime, {
                elapse: true
              })
              .on('update.countdown', function(event) {
                //console.log(btcp);

                //console.log(event);

                var $this = $(this);
                var dataBtcPrice$ = $('[data-btc-price]');
                var dataBtcPriceValue = ($scope.isAfterdark === true) ? $(dataBtcPrice$[0]).text() : $(dataBtcPrice$[1]).text();
                var _dataBtcPriceValue = dataBtcPriceValue;

                $scope.dataBtcPriceValue = parseFloat(dataBtcPriceValue);
                $timeout(function () {
                  var _factor = ($scope.isAfterdark == true) ? 0.06 : 0.15;
                  var _dd = parseFloat(_dataBtcPriceValue) / (1 + 0.06);
                  if ($scope.isAfterdark) {
                    $scope.timemode[$(dataBtcPrice$[0]).text()] = true;
                  } else {
                    $scope.timemode[$(dataBtcPrice$[1]).text()] = true;
                  }
                  var priceExtension = (parseFloat(_dd) * _factor);
                  var updatedDataBtcPriceValue = parseFloat(_dd) + priceExtension;
                  $scope.$apply(function () {
                    $scope.subPrice = parseFloat(updatedDataBtcPriceValue).toFixed(2);
                  });
                }, 0);

                if (_.isNaN(event.offset.hours)) {
                  $timeout(function () {
                    $scope.unavailableCountdown = true;
                    $scope.unavailableCountdownIsAfterdark = $scope.unavailableCountdown;
                    $scope.timerAvailable = false;
                  }, 0)
                } else {
                  $scope.timerAvailable = true;
                }

                $this.html(event.strftime('%H:%M:%S'));

              });
          });



        };

        updatePrice();
        var i = $interval(function () {
          updatePrice();
        }, 300000); // Updates every 5 minutes.

        $scope.$on('$locationChangeStart', function () {
          $interval.cancel(i);
        });

      }
    };
  });
