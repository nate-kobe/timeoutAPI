var config = require('config.json');
var Q = require('q');
var transaction = require('../models/transaction.model')
 
var service = {};
 
service.listByScout = listByScout;
// service.create = create;
// service.delete = _delete;
 
module.exports = service;

function listByScout(scoutId) {
  var deferred = Q.defer();
  var query = {scoutId: scoutId};

  transaction.find(query, function(err, transactions) {
    if(err) deferred.reject(err.name + ': ' + err.message);
    deferred.resolve(transactions);
  });

  return deferred.promise;
}

function insert(params) {
  var deferred = Q.defer();

  transaction.create(params, function(err, post)  {
    if (err) deferred.reject(err.name + ': ' + err.message);
    deferred.resolve(post);
  });

  return deferred.promise;
}

function _delete(_id) {
  var deferred = Q.defer();
 
  transaction.deleteOne(_id, function(err, t) {
    if(err) deferred.reject(err.name + ': ' + err.message);
    deferred.resolve();
  });
  
  return deferred.promise;
}