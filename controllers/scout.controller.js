var express = require('express');
var router = express.Router();
var scoutService = require('services/scout.service');
var QRCode = require('qrcode');
 
// routes
router.get('/list', list);
router.get('/:_id/detail', detail);
router.post('/insert', insert);
router.put('/:_id/transaction/insert', addTransaction);
router.delete('/:_id/transaction/:trId/delete', deleteTransaction);
router.put('/:_id/update', update);
router.delete('/:_id/delete', _delete);
router.get('/:uid/qrcode', qrcode);
router.get('/qrcode', qrcodes);

module.exports = router;

// Functions
function list(req, res) {
  scoutService.list()
  .then(function(scouts) {
    res.send(scouts);
  })
  .catch(function(err) {
    res.status(400).send(err);
  });
}

function detail(req, res) {
  scoutService.detail(req.params._id)
  .then(function(scout) {
    res.send(scout);
  })
  .catch(function(err) {
    res.status(400).send(err);
  });
}

function insert(req, res) {
  scoutService.insert(req.body)
  .then(function(scout) {
    res.json(scout);
  })
  .catch(function(err){
    res.status(400).send(err);
  });
}

function update(req, res) {
  scoutService.update(req.params._id, req.body)
  .then(function(scout) {
    res.send(scout);
  })
  .catch(function(err) {
    res.status(400).send(err);
  });
}

function _delete(req, res) {
  scoutService._delete(req.params._id)
  .then(function(result){
    res.send("success");
  })
  .catch(function(err){
    res.status(400).send(err);
  });
}

function qrcode(req, res) {
  QRCode.toDataURL('http://herens.nathan-ko.be/check/' + req.params.uid)
    .then(url => {
      res.send({url: url});
    })
    .catch(err => {
      res.status(400).send(err);
    });
}

function qrcodes(req, res) {
  scoutService.list()
  .then(function(scouts){
    var promises = scouts.map(function(s){
      return QRCode.toDataURL('http://herens.nathan-ko.be/check/' + s.uid)
        .then(function(url){
          var herensId = s.firstName === undefined || s.lastName === undefined ? s.uid : s.uid + '/' + s.firstName.charAt(0) + s.lastName.charAt(0) + '-' + s.troop + 'B'
          return {qrcode: url, herensId: herensId};
        });
    });
    Promise.all(promises).then(function(results){
      res.send(results);
    })
    .catch(function(err){
      console.log(err);
      res.status(400).send(err);
    })
  })
  .catch(function(err){
    console.log(err);
    res.status(400).send(err);
  })
}

function addTransaction(req, res) {
  scoutService.addTransaction(req.params._id, req.body)
  .then(function(result){
    res.send(result);
  })
  .catch(function(err){
    res.status(400).send(err);
  });
}

function deleteTransaction(req, res) {
  console.log(req.params);
  scoutService.deleteTransaction(req.params._id, req.params.trId)
  .then(function(result){
    res.send(result);
  })
  .catch(function(err){
    res.status(400).send(err);
  });
}

function generateQRCode(scoutId, herensId) {
  QRCode.toDataURL('http://localhost:4200/profile/' + scoutId + '/detail')
  .then(function(url){
    return {qrcode: url, id: herensId};
  });
}

function check(req, res) {
  scoutService.detailByUid({uid: req.params.uid})
  .then(function(result){
    if(result.transactions.filter(tr => tr.time > 10000).length == 0)
      console.log('coucou');

    res.send(result);
  })
  .catch(function(err){
    res.status(400).send(err);
  });
}