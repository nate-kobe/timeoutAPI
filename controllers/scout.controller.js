var express = require('express');
var csv = require('csv-express');
var router = express.Router();
var scoutService = require('services/scout.service');
var QRCode = require('qrcode');
var Transaction = 
 
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
router.get('/export', exportCSV);
router.get('/uid:uid/checkin', check);

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
  scoutService.detailByUid(req.params.uid)
  .then(function(result){
    // if(true) {
      var newTranscation = {
        reason: 'Checkin',
        time: 82000,
        isPositive: true
      };
      console.log(newTranscation);
      scoutService.addTransaction(result._id, newTranscation).then(function(result) {
        res.send(result);
      }).catch(function(err){res.status(400).send(err)});
    // } else {
    //   res.send('not found');
    // }
  })
  .catch(function(err){
    res.status(400).send(err);
  });
}

var mapToCSV = function(scout) {
    return {
        'NO_PERS_BDNJS': "",
        'SEXE': scout.gender,
        'NOM': scout.lastName,
        'PRENOM': scout.firstName,
        'DAT_NAISSANCE': scout.birthday.getUTCDate() + "." + (scout.birthday.getUTCMonth() + 1) + "." + scout.birthday.getUTCFullYear(),
        'RUE': scout.address.street,
        'NPA': scout.address.zip,
        'LIEU': scout.address.city,
        'PAYS': scout.address.country,
        'NATIONALITE': scout.nationality,
        '1ERE_LANGUE': scout.mothertongue,
        'CLASSE/GROUPE': scout.troop + "B/Flambeaux Nyon"
    };
}
function exportCSV(req, res) {
  console.log('request CSV expor export');
  scoutService.list().then({}, function(err, scouts) {
      if(err) res.status(400).send(err)
      var filename   = "flbx-nyon-camGgrp2018.csv";
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader("Content-Disposition", 'attachment; filename='+filename);
      res.csv(scouts.map(s => mapToCSV(s)), true);
  });
}
/* Export scout listing to CSV */
/*router.get('/csv', function(req, res, next) {
    console.log('request CSV expor export');
    Scout.find().lean().exec({}, function(err, scouts) {
        if(err) return next(err);
        var filename   = "flbx-nyon-grp2018-inscriptions.csv";
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader("Content-Disposition", 'attachment; filename='+filename);
        res.csv(scouts.map(s => mapToCSV(s)), true);
    });
});*/