/***

  @fileOverview

     _
    | |
    | |__  _____  ___ _____
    |  _ \(____ |/___) ___ |
    | |_) ) ___ |___ | ____|
    |____/\_____(___/|_____)

  @description

  Environment config base.

***/

var environment;

(function () {
  environment = (function() {

    var configInterface;
    configInterface = {};
    configInterface.document = window.document;
    configInterface.location = window.location;
    configInterface.isFanSubdomain = configInterface.location.pathname.indexOf("fan") !== -1;
    configInterface.isSubtype = configInterface.isFanSubdomain ? "customer" : "merchant";
    configInterface.baseTemplateUrl = '/static/';
    configInterface.localDevelopment = false;
    configInterface.rest = {};
    configInterface.protocol = window.location.protocol || 'http:';
    configInterface.hostname = window.location.hostname || 'local.utxo.ux';
    configInterface.port = window.location.port !== "" ? (':' + window.location.port) : '';
    var apiBaseSep = '/';
    configInterface.rest.apiBase = configInterface.protocol + '//' + configInterface.hostname + configInterface.port;

    configInterface.rest.order = {};
    configInterface.rest.order.create = configInterface.rest.apiBase + '/order';
    configInterface.rest.order.read = configInterface.rest.apiBase + '/order';
    configInterface.rest.order.update = configInterface.rest.apiBase + '/order';
    configInterface.rest.orders = {};
    configInterface.rest.orders.order = {};
    configInterface.rest.orders.order.base = configInterface.rest.apiBase + '/orders';
    configInterface.rest.orders.latest = configInterface.rest.apiBase + '/orders/latest';
    configInterface.rest.orders.order.__update__ = function (id, name) {
      return configInterface.rest.orders.order.base + '/' + id + '/' + name + '/';
    };

    configInterface.rest.person = {};
    configInterface.rest.person.create = configInterface.rest.apiBase + '/verify/person';
    configInterface.rest.person.read = configInterface.rest.apiBase + '/verify/person';
    configInterface.rest.person.update = configInterface.rest.apiBase + '/verify/person';
    configInterface.rest.person.remove = configInterface.rest.apiBase + '/verify/person';
    configInterface.rest.person.list = configInterface.rest.apiBase + '/verify/people';

    configInterface.rest.questionSet = {};
    configInterface.rest.questionSet.create = configInterface.rest.apiBase + '/question-set';
    configInterface.rest.questionSet.read = configInterface.rest.apiBase + '/question-set';
    configInterface.rest.questionSet.update = configInterface.rest.apiBase + '/question-set';
    configInterface.rest.questionSet.remove = configInterface.rest.apiBase + '/question-set';
    configInterface.rest.questionSet.validate = configInterface.rest.apiBase + '/question-set/validate';
    configInterface.rest.questionSet.list = configInterface.rest.apiBase + '/question-sets';

    configInterface.rest.people = {};
    configInterface.rest.people.index = configInterface.rest.apiBase + '/people';
    configInterface.rest.people.person = {};
    configInterface.rest.people.person.base = configInterface.rest.apiBase + '/people';

    configInterface.rest.people.person.__base__ = function () {
      return configInterface.rest.people.person.base + '/';
    };

    configInterface.rest.people.person.__get__ = function (id) {
      return configInterface.rest.people.person.base + '/' + id + '/' + '?t=' + (Math.floor(Math.random()*10000000000000000));
    };

    configInterface.rest.people.person.__update__ = function (id, name) {
      return configInterface.rest.people.person.base + '/' + id + '/' + name + '/';
    };

    configInterface.rest.authenticationSms = {};
    configInterface.rest.authenticationSms.create = configInterface.rest.apiBase + '/authentication/request';

    configInterface.rest.help = configInterface.rest.apiBase + '/help';
    configInterface.rest.placeorder = configInterface.rest.apiBase + '/place-order';

    configInterface.rest.sendSms = {};
    configInterface.rest.sendSms.create = configInterface.rest.apiBase + '/a/request';

    configInterface.rest.maps = {};
    core_type = 'credit-unions/nearest';
    configInterface.rest.maps.index = configInterface.rest.apiBase + '/maps/' + core_type;

    if (configInterface.debug == null) {
      configInterface.debug = {
        frontEnd: false,
        api: false,
        blockscore: false
      };
    }

    if (configInterface.api == null) {
      configInterface.api = {
        baseUrl: "utxo.firebaseio.com",
        version: "v1",
        preparedString: ''
      };
    }

    if (configInterface.loggly == null) {
      configInterface.loggly = {
        logglyApiKey: ''
      };
    }

    if (configInterface.google == null) {
      configInterface.google = {
        maps: {
          streetView: 'https://maps.googleapis.com/maps/api/streetview',
          geocode: 'https://maps.googleapis.com/maps/api/geocode/json',
          key: 'AIzaSyB_42epe3vXXrap9NXf25GmYfzuT6Sxz8U'
        }
      };
    }

    if (configInterface.twilio == null) {
      configInterface.twilio = {
        accountSid: 'AC2df5751112ce10b674d852abe0fd3b11',
        authToken: 'a1d6b1737f8f533da81855c690ce2dc0'
      };
    }

    if (configInterface.blockscore == null) {
      configInterface.blockscore = {
        testKey: "sk_test_e415139895f6cd4edd6c248f2a72ad12",
        productionKey: ""
      };
    }

    return configInterface;

  })();
})();
