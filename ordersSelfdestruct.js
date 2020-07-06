/**
 * @fileOverview
 *
 * orderSelfdestruct
 */
var cron = require('cron')
var Firebase = require('firebase');
var _ = require('lodash');
var moment = require('moment');

var dataRef = new Firebase('https://utxo.firebaseio.com/');
var CronJob = cron.CronJob;
var startOnInit = true;
var timezone = 'America/Chicago';

var job = new CronJob({
    cronTime: '*/1 * * * *',
    onTick: function () {
      peopleRef = dataRef.child('people');
      peopleRef.on('value', function (peopleRefSnapshot) {
        people = peopleRefSnapshot.val();


        _.forEach(people, function (person, personId) {
          var orderRef;
          _.forEach(person.orders, function (order, orderId) {
            console.dir('Check order if exists in null user land ' + personId);
            if (personId === 'null' || personId === 'undefined') {
              nullard = dataRef.child('people').child(personId);
              nullard.remove();
            }

          });
        });

        _.forEach(people, function (person, personId) {
          var orderRef;
          _.forEach(person.orders, function (order, orderId) {
            console.log('Check order #' + orderId + ' of user ' + personId + '.');
            var targetTimestamp = moment();
            var updatedTimestamp = moment(new Date(order.updated__time)).add(45, 'minutes');
            var checkTimestamp = moment(new Date(order.timestamp)).add(45, 'minutes');

            if (updatedTimestamp && targetTimestamp.isAfter(updatedTimestamp)) {
              orderRefExpired = dataRef.child('people').
                child(personId).child('orders').
                child(orderId).child('expired');
              orderRefStatus = dataRef.child('people').
                child(personId).child('orders').
                child(orderId).child('status');
              orderRefPaid = order.paid;
              orderRefExpired.set('true');
              orderRefStatus.set('1');
              console.log('Extended Timestamp has expired.')
              return;
            }

            if (targetTimestamp.isAfter(checkTimestamp)) {
              orderRefExpired = dataRef.child('people').child(personId).child('orders').child(orderId).child('expired');
              orderRefStatus = dataRef.child('people').child(personId).child('orders').child(orderId).child('status');
              orderRefPaid = order.paid;
              orderRefExpired.set('true');
              orderRefStatus.set('1');
              console.log('Timestamp has expired.');
            }
          });
        });
      });
    },
    start: startOnInit,
    timeZone: timezone
  });


job.start();
