/* global JASMINE, JASMINE_ADAPTER, REQUIRE, REQUIRE_ADAPTER */

module.exports = function(config) {
  'use strict';

  config.set({

    // Options:
    // LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel       : config.LOG_DEBUG,
    singleRun      : false,
    colors         : true,
    autoWatch      : true,
    port           : 8080,
    reporters      : ['progress'],
    captureTimeout : 60000,
    basePath       : '../',

    frameworks: [
      "browserify",
      "jasmine"
    ],

    files: [
      '/usr/local/lib/node_modules/testacular/adapter/jasmine.js',
      '/usr/local/lib/node_modules/testacular/adapter/lib/jasmine.js',
      '/Users/nerdfiles/Projects/utxo_us/node_modules/karma-requirejs/lib/index.js',
      '/Users/nerdfiles/Projects/utxo_us/node_modules/karma-requirejs/lib/adapter.js',
      // bower:js
      'app/static/bower_components/moment/moment.js',
      '//cdnjs.cloudflare.com/ajax/libs/chance/0.5.6/chance.min.js',
      '//cdnjs.cloudflare.com/ajax/libs/numeral.js/1.5.3/numeral.min.js',
      '//cdnjs.cloudflare.com/ajax/libs/userinfo/1.1.0/userinfo.min.js',
      '//cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js',
      'app/static/bower_components/jquery/dist/jquery.js',
      'app/static/bower_components/d3/d3.js',
      'app/static/bower_components/rickshaw/rickshaw.js',
      'app/static/bower_components/jquery.countdown/dist/jquery.countdown.js',
      'app/static/bower_components/jquery-ui/jquery-ui.js',
      '../static/bower_components/bitcoin-prices/bitcoinprices.js',
      /*
       *'app/static/bower_components/keyboard/dist/js/jquery.keyboard.min.js',
       *'app/static/bower_components/keyboard/dist/layouts/keyboard-layouts-combined.min.js',
       *'app/static/bower_components/keyboard/dist/layouts/keyboard-layouts-greywyvern.min.js',
       *'app/static/bower_components/keyboard/dist/layouts/keyboard-layouts-microsoft.min.js',
       */
      //'app/static/bower_components/materialize/bin/materialize.js',
      'app/static/bower_components/webcamjs/webcam.min.js',
      "app/static/bower_components/sha1/index.js",
      "//cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/sha256-min.js",
      "//crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/hmac-sha256.js",
      "//crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/aes.js",
      'app/static/bower_components/angular/angular.js',
      'app/static/bower_components/firebase/firebase.js',
      'app/static/bower_components/angularfire/dist/angularfire.js',
      'app/static/bower_components/angular-animate/angular-animate.js',
      'app/static/bower_components/angular-aria/angular-aria.js',
      'app/static/bower_components/angular-cookies/angular-cookies.js',
      'app/static/bower_components/angular-messages/angular-messages.js',
      'app/static/bower_components/angular-resource/angular-resource.js',
      'app/static/bower_components/angular-route/angular-route.js',
      'app/static/bower_components/angular-sanitize/angular-sanitize.js',
      'app/static/bower_components/angular-touch/angular-touch.js',
      'app/static/bower_components/ng-table/dist/ng-table.min.js',
      //'app/static/bower_components/loadcss/loadCSS.js',
      'app/static/bower_components/ngmap/build/scripts/ng-map.js',
      'app/static/bower_components/ngstorage/ngStorage.js',
      'app/static/bower_components/ngGeolocation/ngGeolocation.js',
      "app/static/bower_components/ng.geotranslation/dist/ng-geotranslation.js",
      "../static/bower_components/addressit/dist/addressit.min.js",

      'app/static/bower_components/mockfirebase/browser/mockfirebase.js',
      'app/static/bower_components/angular-mocks/angular-mocks.js',
      //'app/static/bower_components/angular-mocks/ngMock.js',

      'https://maps.googleapis.com/maps/api/js?libraries=places,visualization',
      "app/static/bower_components/angular-geocoder/main.js",
      "app/static/bower_components/ng-camera/dist/ng-camera.js",
      "app/static/bower_components/angular-local-storage/dist/angular-local-storage.min.js",
      "app/static/bower_components/qrcode-generator/js/qrcode.js",
      "app/static/bower_components/qrcode-generator/js/qrcode_UTF8.js",
      "app/static/bower_components/angular-qrcode/angular-qrcode.js",
      "app/static/bower_components/angular-segmentio/angular-segmentio.js",

      // endbower
      "app/scripts/**/*.js",
      "test/spec/**/*.js"
    ],

    exclude: [
    ],

    // Options:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      "PhantomJS"
    ],

    plugins: [
      "karma-browserify",
      "karma-jasmine",
      "karma-phantomjs-launcher",
      'karma-browserify'
    ],

    browserify: {

    },

    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },

    // urlRoot: '_karma_'
  });
};
