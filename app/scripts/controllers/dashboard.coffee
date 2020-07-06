# @global environment
# 
convertDataURIToBinary = (dataURI) ->
  base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length
  base64 = dataURI.substring(base64Index)
  raw = window.atob(base64)
  rawLength = raw.length
  array = new Uint8Array(new ArrayBuffer(rawLength))
  i = 0
  while i < rawLength
    array[i] = raw.charCodeAt(i)
    i++
  array
"use strict"
BASE64_MARKER = ";base64,"

###*
@ngdoc function
@name utxoPmc.controller:DashboardCtrl
@description
# DashboardCtrl
Controller of the utxoPmc
###
angular.module("utxoPmc").directive("customOnChange", ->
  restrict: "A"
  link: (scope, element, attrs) ->
    onChangeHandler = scope.$eval(attrs.customOnChange)
    element.bind "change", onChangeHandler
    return
).controller "DashboardCtrl", ($scope, $http, person, people, $timeout, $window, crypto, $location, $rootScope) ->
  
  #
  #      @description
  #        Open, means order was placed - customer may or may not have paid (uploaded the receipt), or been automatically flagged (if amount is over $10k).
  #        Confirmed, means UTXO has confirmed that they've sent the bitcoin (the transaction is effectively closed, though notes can be added).
  #        Expired, means that the time allocated for the bitcoin price has expired and the customer hasn't uploaded the receipt (in effect just ordered and did nothing).
  #        FinCen, means that the customer was automatically flagged for 10k and above, OR was flagged for suspicious activity statements.
  #        Scan Error, means that there is a problem with the receipt and information received, or there is a suspicious of malicious intent.
  #        Paid, means that the customer has uploaded the scanned receipt, ready for action from UTXO.
  #     
  $timeout (->
    $scope.$broadcast "cmsView:ready", $scope
    $scope.cmsViewReady = $rootScope.cmsViewReady = true
    $scope.$apply()
    console.log $scope
    return
  ), 0
  $scope.currentTime = null
  $scope.adminTime = ->
    $scope.currentTime = moment().format("ddd, d MMM YYYY HH:00")
    portSpec = (if $window.location.port isnt "" then (":" + $window.location.port) else "")
    hostname = $window.location.hostname + portSpec
    $scope.logoutLink = $window.location.protocol + "//" + hostname + "/dashboard/logout"
    return

  $scope.refreshOrdersList = ->
    $timeout (->
      $scope.loadMoreManagementRows()
      $scope.$apply()
      return
    ), 300
    return

  $scope.exitAdmin = ->
    portSpec = (if $window.location.port isnt "" then (":" + $window.location.port) else "")
    hostname = $window.location.hostname + portSpec
    $scope.baseLink = $window.location.protocol + "//" + hostname + "/#/"
    $location.path $scope.baseLink
    return

  $scope.adminCredentials = ->
    portSpec = (if $window.location.port isnt "" then (":" + $window.location.port) else "")
    hostname = $window.location.hostname + portSpec
    currentUserUrl = $window.location.protocol + "//" + hostname + "/api/users/current/"
    $http.get(currentUserUrl).success((responseData) ->
      $scope.admin = $meta: responseData
      console.log $scope
      return
    ).error (errorData) ->
      console.dir errorData
      return

    return

  $scope.uploadReport = (event) ->
    reader = new FileReader()
    files = event.target.files
    return  if files.length is 0
    reader.onload = ->
      pdf_prefix = "data:application/pdf;base64,"
      data = reader.result
      base64 = data.replace(/^[^,]*,/, "")
      $timeout (->
        $scope.loadedPerson.fincen_state3 = pdf_prefix + base64
        $scope.$apply()
        return
      ), 0
      return

    reader.readAsDataURL files[0]
    return

  $scope.openPdf = ->
    $window.open $scope.loadedPerson.fincen_state3, "_blank", "location=no,enableviewportscale=yes"
    return

  $scope.sendSms = (type) ->
    
    ###*
    @todo Change selfie of given item to remove image data stored on @prop selfie_link and @prop status == '0'.
    ###
    contact_person = $scope.loadedPerson
    handle = contact_person.$handle
    message_construct =
      "update-price": "We have updated the price point on your order #" + contact_person.$id + " per the latest Bitfinex (https://bfxdata.com) exchange rates."
      "force-exp": "We have forced an expiration of the following place order #" + contact_person.$id
      "retake-selfie": "We found a problem with your selfie for order #" + contact_person.$id + " Please re-take it!"
      completed: "We have completed your order #" + contact_person.$id

    person.sendSms handle, message_construct[type]
    return

  $scope.check_selfie = (loadedPerson) ->
    console.log loadedPerson
    $("#selfie-modal").openModal
      dismissible: true
      opacity: .5
      in_duration: 300
      out_duration: 200
      ready: ->

      complete: ->

    return

  $scope.close_check_selfie = ->
    $("#selfie-modal").closeModal()
    return

  $scope.filterBy = (selected) ->
    $scope.filterBySelected = selected
    return

  $scope.filterTypes = [
    {
      filterTypeName: "Open"
      filterTypeAlias: "open"
    }
    {
      filterTypeName: "Confirmed"
      filterTypeAlias: "confirmed"
    }
    {
      filterTypeName: "Expired"
      filterTypeAlias: "expired"
    }
    {
      filterTypeName: "FinCEN"
      filterTypeAlias: "fincen"
    }
    {
      filterTypeName: "Scan-Error"
      filterTypeAlias: "scan-error"
    }
    {
      filterTypeName: "Paid"
      filterTypeAlias: "paid"
    }
  ]
  $scope.submitManagementRow = (loadedPerson) ->
    _id = loadedPerson.$person_id
    last_order = crypto.hash(moment(loadedPerson.timestamp).toString())
    _personOrder = loadedPerson
    cachedPersonOrder = angular.copy(_personOrder)
    cachedPersonOrder.status = "1"  if cachedPersonOrder.confirmed is "true" # '1' === closed, '0' === open
    cachedPersonOrder.expired = "true"  if cachedPersonOrder.force_exp is "true"
    if cachedPersonOrder.extend__time isnt ""
      cachedPersonOrder.expired = "false"
      extend_time_construct = cachedPersonOrder.extend__time.split(":")
      mins = parseInt(extend_time_construct[0])
      secs = (if (extend_time_construct[1]) then parseInt(extend_time_construct[1]) else "0")
      ext_time = (if (cachedPersonOrder.updated__time isnt "") then moment(cachedPersonOrder.updated__time) else moment(new Date(cachedPersonOrder.timestamp)))
      _ext_time = ext_time.add(mins, "minutes").add(secs, "seconds")
      label_ext_time = _ext_time.toString()
      cachedPersonOrder.updated__time = label_ext_time
      loadedPerson.updated__time = label_ext_time
      cachedPersonOrder.extend__time = ""
    cachedPersonOrder.extend__price = "false"  if cachedPersonOrder.extend__price is "true"
    delete cachedPersonOrder["$id"]

    delete cachedPersonOrder["$$hashKey"]

    delete cachedPersonOrder["state"]

    delete cachedPersonOrder.$handle

    delete cachedPersonOrder.$person_id

    delete cachedPersonOrder.$person

    delete cachedPersonOrder.$verification

    delete cachedPersonOrder.conversion_statement

    strategy =
      handle: _id
      property: "orders" + "/" + last_order
      payload: cachedPersonOrder

    person.order(strategy).then ((orderData) ->
      console.log orderData
      return
    ), (errorData) ->
      console.log errorData
      return

    return

  $scope.loadManagementRow = (managementRow) ->
    $timeout (->
      managementRow.human_readable_timestamp = moment(managementRow.timestamp).toString()
      $scope.loadedPerson = managementRow
      $scope.$apply()
      return
    ), 0
    return

  $scope.loadMoreManagementRows = ->
    
    ###*
    Load More Management Rows
    ###
    person.all().then (data) ->
      managementRows = []
      _.forEach people.list.data, (personData, personDataKeyname) ->
        if personData.orders
          _.forEach personData.orders, (order, keyname) ->
            order.$id = keyname
            order.$handle = personData.phone_number
            order.$person_id = personDataKeyname
            order.$person = personData.overview
            order.$verification = personData.verification
            order.conversion_statement = numeral(order.usd).format("0,00") + "-" + order.btc
            order.state = []
            order.state.push alias: "fincen1"  if eval(order.fincen_state1)
            order.state.push alias: "fincen2"  if eval(order.fincen_state2)
            order.state.push alias: "selfie1"  if eval(order.selfie_state1)
            order.state.push alias: "selfie2"  if eval(order.selfie_state2)
            order.state.push alias: "selfie3"  if eval(order.selfie_state3)
            order.state.push alias: "paid"  if eval(order.paid) is true
            managementRows.push order
            return

        return

      managementRows.sort (a, b) ->
        _b = new Date(b.timestamp)
        _a = new Date(a.timestamp)
        _b.getTime() - _a.getTime()

      $scope.managementRows = managementRows
      return

    return

  return

