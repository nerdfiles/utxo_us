'use strict';

/**
 * @ngdoc service
 * @name utxoPmc.authentication
 * @description
 * # authentication
 * Service in the utxoPmc.
 */
angular.module('utxoPmc')
  .factory('authentication', function ($timeout, $q, $http, $window, person, crypto, localStorageService, $location) {
    /**
     * Authentication Service Interface.
     */
    var __interface__ = {};

    __interface__.loadSession = function (id) {
      /*
       *
       *
       */

      var def = $q.defer();
      var sec_phone = localStorageService.get('hook');
      var _id = id;

      try {

        var _sec_phone = crypto.decrypt(sec_phone, person.session.user.token);

      } catch (e) {
        /*
         *if (document.referrer.indexOf('placeOrder') !== -1) {
         *  $location.path('/businessCardView');
         *  return;
         *}
         */
        $location.path('/');
      }

      var exploded_sec_phone = _sec_phone.toString(CryptoJS.enc.Utf8);

      if (person.session.user && exploded_sec_phone) {

        var _formObject = {
          'phone_number': null
        };

        _formObject.phone_number = exploded_sec_phone;

        person
            .get({
              mode: 'byId',
              handle: _formObject.phone_number
            })
              .then(function (_personData) {
                var active_order = (person.current && person.current.order) ? person.current.order : null;
                var p = _personData || null;
                var personData = active_order != null ? person.current : _personData;

                if ((personData && person.current && person.current.order == null) || person.current.order.paid == 'true') {
                  person.current = personData;

                  var _foundOrder = _.find(personData.orders, {
                    id: _id
                  });

                  var _orders = _.toArray(personData.orders);

                  _orders.sort(function (a, b) {
                    return b.timestamp - a.timestamp;
                  });

                  if (_foundOrder) {
                    person.current.order = _foundOrder;
                  } else {
                    person.current.order = _.last(_orders);
                  }

                  if (active_order) {
                    person.current.order = active_order;
                  }

                  def.resolve(person.current);

                } else {

                  def.resolve(person.current);

                }
              });

      } else {
        def.reject(false);
      }

      return def.promise;
    };

    var uiCleanupStyles = {};

    var portSpec = $window.location.port != "" ? (':' + $window.location.port) : '';
    var hostname = $window.location.hostname + portSpec;

    uiCleanupStyles.property_clean = function (type, obj) {
      /**
       * Property Clean
       * @inner
       */
      switch (type) {
        case "sanitize":
          _.forEach(obj, function (_property) {
            var p = _property.replace(/-/g, '');
            return p;
          });
      }
      return obj;
    };

    __interface__.scrapeUrl = $window.location.protocol + '//' + hostname + '/scraper/';

    __interface__.validate_identity = function (formObject) {
      /**
       * Create Person
       *
       * @extends http://schema.org/Person
       * @extends http://docs.blockscore.com/v4.0/python/#people
       * @extends https://www.dandb.com/advanced-search/#people (CommonREST)
       * @extends http://schema.org/Organziation
       * @extends http://docs.blockscore.com/v4.0/python/#companies
       * @extends https://www.dandb.com/advanced-search/#companies (CommonREST)
       */
      var baseUrl = environment.rest.person.create;
      var def = $q.defer();
      var uri_base = '/';
      formObject['has_pos'] = null;
      formObject['duns'] = null;
      formObject['isic_v4'] = null;
      formObject['naics'] = null;
      formObject['tax_id'] = null;
      formObject['vat_id'] = null;
      formObject['email'] = null;
      formObject['affiliation'] = null;
      formObject['telephone'] = null;
      formObject['uri'] = null;
      formObject['sales_opportunity'] = null;
      formObject['latest_fin_sales'] = null;
      formObject['industry'] = null;
      formObject['primary_industry'] = null;
      formObject['num_of_employees'] = 1;
      formObject['seeks'] = null;
      formObject['net_worth'] = null;
      formObject['owns'] = null;
      formObject['makes_offer'] = null;
      formObject['member_off'] = null;
      formObject['knows'] = null;
      formObject['global_location_number'] = null;
      formObject['fax_number'] = null;
      formObject['under_name'] = null;
      formObject['reviewed_by'] = null;
      formObject['broker'] = null;
      formObject['alumni_of'] = null;
      //formObject['canonical'] = null;
      var payload = $.param(formObject);

      $http
        .post(
          baseUrl,
          payload
        )
        .success(function (responseData) {
          def.resolve(responseData);
        })
        .error(function (errorData) {
          def.reject(errorData);
        });

      return def.promise;
    };

    __interface__.score_question_set = function (formObject) {
      /**
       * Score Validation Question Set
       */
      var baseUrl = environment.rest.questionSet.validate
      var def = $q.defer();
      var payload = $.param(formObject);

      $http
        .post(
          baseUrl + '/' + formObject.id,
          payload
        )
        .success(function (responseData) {
          def.resolve(responseData);
        })
        .error(function (errorData) {
          def.reject(errorData);
        });

      return def.promise;
    };

    __interface__.create_validate_questions = function (formObject) {
      /**
       * Create Validation Questions Set
       */
      var baseUrl = environment.rest.questionSet.create
      var def = $q.defer();
      var payload = $.param({ person_id: formObject.person_id });

      $http
        .post(
          baseUrl,
          payload
        )
        .success(function (responseData) {
          def.resolve(responseData);
        })
        .error(function (errorData) {
          def.reject(errorData);
        });

      return def.promise;
    };

    __interface__.validate_phone_number = function (formObject) {
      /**
       * Validate Phone Number
       */
      var baseUrl = environment.rest.authenticationSms.create;
      var def = $q.defer();

      var _formObject = uiCleanupStyles.property_clean('sanitize', formObject);

      var payload = $.param(_formObject);

      $http
        .post(
          baseUrl,
          payload
        )
        .success(function (responseData) {
          def.resolve(responseData);
        })
        .error(function (errorData) {
          def.reject(errorData);
        });

      return def.promise;
    };

    /**
     * Export Authentication Service Interface.
     */
    return __interface__;

  });
