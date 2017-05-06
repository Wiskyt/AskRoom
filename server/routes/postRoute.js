var express = require('express');
var router = express.Router();
var DB = require('../database');

// --------------------------------------------------------
//                 SIMPLE POST RECEPTION
// --------------------------------------------------------

router.post('/:type/', function(req, res) {
  var type = req.params.type;
  console.log("Received data, type : " + type);

  if (type == "search") {
    DB.getPlayerList(req.body, (data) => res.json(data));
  }
});

module.exports = router;
