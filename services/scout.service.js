// var config = require('config.json');
var Q = require('q');
// var mongo = require('mongoskin');
// var db = mongo.db(config.connectionString, { native_parser: true });
var mongoose = require('mongoose');
var Scout = require('../models/scout.model.js');
 
var service = {};
 
service.list = list;
service.detail = detail;
service.insert = insert;
service.update = update;
service.addTransaction = addTransaction;
service.deleteTransaction = deleteTransaction;
service.detailByUid = detailByUid;
 
module.exports = service;
 
function list() {
  var deferred = Q.defer();

  Scout.find({}, function(err, scouts) {
    if(err) deferred.reject(err.name + ': ' + err.message);
    deferred.resolve(scouts);
  });

  return deferred.promise;
}
 
function detail(_id) {
  var deferred = Q.defer();
  Scout.findById(_id, function (err, scout) {
    if (err) deferred.reject(err.name + ': ' + err.message);

    if (scout) {
        deferred.resolve(scout);
    } else {
        deferred.resolve();
    }
  });
 
  return deferred.promise;
}

function detailByUid(uid) {
  var deferred = Q.defer();
  console.log('service call');
  Scout.findOne({uid: uid}, function (err, scout) {
    if (err) deferred.reject(err.name + ': ' + err.message);

    if (scout) {
        console.log('scout gound');
        console.log(scout);
        /*const newTransaction = {
          reason: 'Checkin'
        };
        console.log(newTransaction);*/
        deferred.resolve(scout);
        /*addTransaction(newTransaction).then(function(result) {
          console.log('transaction added');
          deferred.resolve('ok');
        }).catch(function(err){res.status(400).send(err)});*/
    } else {
        deferred.resolve();
    }
  });
 
  return deferred.promise;
}
 
function insert(scoutParam) {
    var deferred = Q.defer();

    Scout.create(scoutParam, function(err, post)  {
      if (err) deferred.reject(err.name + ': ' + err.message);
      deferred.resolve();
    });
 
    return deferred.promise;
}
 
function update(_id, scoutParam) {
  var deferred = Q.defer();
 
  Scout.findOneAndUpdate({_id: _id}, scoutParam, function(err, scout) {
    if(err) deferred.reject(err.name + ': ' + err.message);
    deferred.resolve(scout);
  });

  return deferred.promise;
}

function _delete(_id) {
  var deferred = Q.defer();
 
  Scout.deleteOne(_id, function(err, scout) {
    if(err) deferred.reject(err.name + ': ' + err.message);
    deferred.resolve();
  });
  
  return deferred.promise;
}

function addTransaction(_id, trParams) {
  var deferred = Q.defer();

  Scout.findById(_id, function (err, scout) {
    if (err) deferred.reject(err.name + ': ' + err.message);
    if (scout) {
      scout.transactions.push(trParams);
      scout.save(function(err){
        if(err) deferred.reject(err.name + ': ' + err.message);
        else deferred.resolve(scout);
      });
    }
  });

  return deferred.promise;
}

function deleteTransaction(scoutId, trId) {
  var deferred = Q.defer();

  Scout.findById(scoutId, function(err, scout){
    console.log('scoutId ' + scoutId)
    console.log('trId ' + trId)
    if (err) deferred.reject(err.name + ': ' + err.message);
    if (scout) {
      scout.transactions.pull(trId);
      scout.save(function(err){
        console.log('save');
        if(err) deferred.reject(err.name + ': ' + err.message);
        else deferred.resolve(scout);
      });
    }
  });

  return deferred.promise;
}