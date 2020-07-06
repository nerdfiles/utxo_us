"use strict"

###*
@ngdoc directive
@name utxoPmc.directive:bitcoinPrices
@description
# bitcoinPrice
###
angular.module("utxoPmc").directive "bitcoinPrices", ($http, $timeout, $q, $interval, $rootScope, $window) ->
  restrict: "A"
  templateUrl: "/static/bitcoin-prices.html"
  link: postLink = ($scope, element, attrs) ->
    API = ->
      @version = "0.0.1"
      return
    _this = this
    btce_version = 3
    API::ticker = (pair) ->
      
      # @see https://btc-e.com/api/3/docs#ticker
      obj = undefined
      def = $q.defer()
      portSpec = (if $window.location.port isnt "" then (":" + $window.location.port) else "")
      hostname = $window.location.hostname + portSpec
      $.ajax
        async: false
        type: "GET"
        
        #url : 'https://btc-e.com/api/'+btce_version+'/ticker/'+pair,
        url: $window.location.protocol + "//" + hostname + "/ticker"
        dataType: "json"
        success: (data) ->
          def.resolve data.data.btc_usd
          return

      def.promise

    API::trades = (pair) ->
      
      # @see https://btc-e.com/api/3/docs#trades
      obj = undefined
      $.ajax
        async: false
        type: "GET"
        url: "https://btc-e.com/api/" + btce_version + "/" + pair + "/trades"
        dataType: "json"
        success: (data) ->
          obj = data
          return

      obj

    API::depth = (pair) ->
      
      # @see https://btc-e.com/api/3/docs#depth
      obj = undefined
      $.ajax
        async: false
        type: "GET"
        url: "https://btc-e.com/api/" + btce_version + "/" + pair + "/depth"
        dataType: "json"
        success: (data) ->
          obj = data
          return

      obj

    API::info = ->
      
      # @see https://btc-e.com/api/3/docs#info
      obj = undefined
      $.ajax
        async: false
        type: "GET"
        url: "https://btc-e.com/api/" + btce_version + "/info"
        dataType: "json"
        success: (data) ->
          obj = data
          return

      obj

    API::historical = (currency) ->
      
      # @see http://www.coindesk.com/api/
      obj = undefined
      _currency = currency or "USD"
      params = "?currency=" + _currency
      $.ajax
        async: false
        type: "GET"
        url: "https://api.coindesk.com/v1/bpi/historical/close.json" + params
        dataType: "json"
        success: (data) ->
          obj = data
          return

      obj

    widthCalc = ->
      def = $q.defer()
      $timeout (->
        width = $("[bitcoin-prices]").width() / 2
        def.resolve width
        return
      ), 750
      def.promise

    loader = ->
      
      # Bitcoin Historical Prices Ticker Line Graph
      seriesData = []
      eur_seriesData = []
      cny_seriesData = []
      api = new API()
      api.ticker().then (data) ->
        $scope.btc_usd = data
        $scope.arrow_up = $scope.btc_usd.last > $scope.btc_usd.avg
        return

      historical = api.historical()
      return  unless historical.bpi
      _.forEach historical.bpi, (priceConstruct, datetimeKey) ->
        
        #console.log(priceConstruct);
        d = new Date(datetimeKey)
        seriesData.push
          x: Math.round(+d / 1000)
          y: Math.round(priceConstruct / .1)

        return

      min = Number.MAX_VALUE
      max = Number.MIN_VALUE
      i = 0
      while i < seriesData.length
        min = Math.min(min, seriesData[i].y)
        max = Math.max(max, seriesData[i].y)
        i++
      logScale = d3.scale.log().domain([
        min / 1.15
        max
      ])
      $rootScope.$watch "loadedCmsViewReady", (newVal, oldVal) ->
        if newVal
          widthCalc().then (_width) ->
            graph = new Rickshaw.Graph(
              element: $("#chart")[0]
              width: _width
              height: 65
              renderer: "line"
              series: [
                color: "#fff"
                data: seriesData
                name: "<i class='fa fa-btc'></i>"
                scale: logScale
              ]
            )
            graph.render()
            axes = new Rickshaw.Graph.Axis.Time(graph: graph)
            axes.render()
            return

        return

      return

    $timeout (->
      loader()
      return
    ), 300
    _now = moment().hour(18)
    __now = moment().hour(8)
    now = moment()
    countDownTime = undefined
    $scope.isAfterdark = now.isAfter(_now) or now.isBefore(__now)
    unless $scope.isAfterdark
      countDownTime = _now.format("MM/DD/YYYY HH:MM:SS")
    else
      countDownTime = __now.format("MM/DD/YYYY HH:MM:SS")
    updatePrice = ->
      
      # Bitcoin Prices
      $(document).ready ->
        bitcoinprices.init
          url: "https://api.bitcoinaverage.com/ticker/all"
          priceAttribute: "data-btc-price"
          marketRateVariable: "last"
          currencies: ["USD"]
          symbols:
            USD: "<i class='fa fa-usd'></i>"

          defaultCurrency: "USD"
          ux:
            clickPrices: true
            menu: true

          jQuery: jQuery

        $timeout (->
          $scope.btcPriceReady = true
          $scope.$apply()
          return
        ), 0
        $(".sub-price--countdown").countdown(countDownTime,
          elapse: true
        ).on "update.countdown", (event) ->
          
          #console.log(event);
          $this = $(this)
          dataBtcPrice$ = $("[data-btc-price]")
          dataBtcPriceValue = dataBtcPrice$.text()
          _dataBtcPriceValue = dataBtcPriceValue.split(" ")
          $scope.dataBtcPriceValue = parseFloat(dataBtcPriceValue)
          $scope.dataBtcPriceLoaded = true
          $timeout (->
            factor = (if ($scope.isAfterdark is true) then 0.06 else 0.15)
            _dd = parseFloat(_dataBtcPriceValue[0]) / (1 + 0.06)
            priceExtension = (parseFloat(_dd) * factor)
            updatedDataBtcPriceValue = parseFloat(_dd) + priceExtension
            $scope.$apply ->
              $scope.subPrice = parseFloat(updatedDataBtcPriceValue).toFixed(2)
              return

            return
          ), 0
          if _.isNaN(event.offset.hours)
            $timeout (->
              $scope.unavailableCountdown = true
              $scope.unavailableCountdownIsAfterdark = $scope.unavailableCountdown
              $scope.timerAvailable = false
              return
            ), 0
          else
            $scope.timerAvailable = true
          $this.html event.strftime("%H:%M:%S")
          return

        return

      return

    updatePrice()
    i = $interval(->
      updatePrice()
      return
    , 300000) # Updates every 5 minutes.
    $scope.$on "$locationChangeStart", ->
      $interval.cancel i
      return

    return

