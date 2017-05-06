var express = require('express');
var router = express.Router();
var DB = require('../database');

// --------------------------------------------------------
//                     SIMPLE GETDATA
// --------------------------------------------------------

router.get('/:type/', function(req, res) {
  var type = req.params.type;
  console.log("Request for data, type : " + type);

  if (type == "searchFieldDataInit") {
    var game; // Get User's prefered game
    var preferedFilters = {/* Get User's usual filter options */};

    DB.getSearchFieldHandshakeData(function (data) {
      var answer = {selected: 1, info: data, '1': DB.getGameData('1')};
      res.json(answer);
    });
  }
});

// --------------------------------------------------------
//                 GETDATA WITH DATA SPEC
// --------------------------------------------------------

router.get('/:type/:which', function(req, res) {
  var type = req.params.type;
  var which = req.params.which;
  console.log("Request for spe data, type: " + type + ", which: " + which);

  if (type == "gameData") {
    var gd = DB.getGameData(which);
    if (gd !== undefined) {
      res.json(gd);
    } else {
      console.log("\tUnknown game", which);
    }
  }
});

module.exports = router;
