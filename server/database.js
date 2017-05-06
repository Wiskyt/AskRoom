var User = require('./user.js');

var connected = false;

module.exports.connect = function() {
  if (!connected) {
    var pgp = require('pg-promise')();
    var config = {
      user: 'postgres',
      database: 'postgres',
      password: 'oneTAPlegend61',
      host: 'localhost',
      port: 7070
    };

    this.db = pgp(config);

    this.cache = {};
    this.orderedCache = {};

    connected = true;
    setTimeout(this.createCache.bind(this), 10);
  }
};

module.exports.isConnected = function() {
  return connected;
}

module.exports.getPlayerList = function(params, onComplete) {

  // TODO: PREVENT SQL INJECTION

  var rolesString = '(' + params.roles.toString() + ')';
  var langString = '(' + params.languages.toString() + ')';

  // TODO: PREVENT SQL INJECTION

  params.rankMin = params.rank.rankMin;
  params.rankMax = params.rank.rankMax;
  params.ageMin = params.age.ageMin;
  params.ageMax = params.age.ageMax;

  console.log("Got search params", params);
  this.db.any("SELECT u.id, u.avatar, u.username, ug.rank, ur.roleid, u.age, ul.languageid " +
              "FROM users_games ug " +
              "JOIN users u " +
              "ON ug.userid = u.id " +
              "JOIN users_roles ur " +
              "ON ug.userid = ur.userid " +
              "JOIN users_languages ul " +
              "ON ug.userid = ul.userid " +
              "WHERE (ug.gameid = $/game/) AND (ug.platformid = $/platform/) AND (ug.regionid = $/region/) " +
                "AND (ug.rank BETWEEN $/rankMin/ AND $/rankMax/) AND (ur.roleid IN " + rolesString + ") " +
                "AND (u.age BETWEEN $/ageMin/ AND $/ageMax/ " + ") " +
                "AND (ul.languageid IN " + langString + ") " +
              "ORDER BY u.id;",
      params)
    .then(data => {
      data = this.clearDuplicates(data, "id");
      onComplete({game: params.game, list: data});
    }).catch(error=> {
      console.log("Error during player search query", error);
    });
}

module.exports.clearDuplicates = function(data, indexName) {
  var indexList = [], list = [];
  for (let i = 0; i < data.length; i++) {
    var indexOf = indexList.indexOf(data[i][indexName]);

    if (indexOf == -1) {
      data[i].roles = [data[i].roleid];
      data[i].languages = [data[i].languageid]; // Create arrays from single value
      delete data[i].roleid;
      delete data[i].languageid;

      indexList.push(data[i][indexName]); // Push his index to remember if we know him easily
      list.push(data[i]); // Push into final list
    } else {
      dudeIndex = list.findIndex( obj => obj.id == data[i][indexName]); // Here we add new languages / roles to the same dude
      if (list[dudeIndex].roles.indexOf(data[i].roleid) == -1) {
        list[dudeIndex].roles.push(data[i].roleid);
      }
      if (list[dudeIndex].languages.indexOf(data[i].languageid) == -1) {
        list[dudeIndex].languages.push(data[i].languageid);
      }
    }
  }

  var nList = [];
  for (var i = 0; i < 100; i++) {
    nList.push({
      id: i,
      avatar: '@koala',
      username: "Wiskyt"+i,
      rank: 10,
      age: i+1,
      roles: [1, 2],
      languages: [1, 2] });
  }
  return nList;
}

module.exports.getGameData = function(game) {
  return this.orderedCache[game];
};

module.exports.getSearchFieldHandshakeData = function(callback) {
  var hsData = {games: this.cache.gamesNoBio, platforms: this.cache.platforms, regions: this.cache.regions, languages: this.cache.languages};
  callback(hsData);
}

module.exports.findUserByName = function(obj, callback) {
  this.db.one("SELECT * from users WHERE username = $/username/", obj)
    .then(user => {
      callback(null, new User(user));
    }).catch(error=> {
      if (error.code == 0) {
        return callback("Unknown username", null);
      }
      console.log("Error during findUserByName search query", error);
      callback(error, null);
    });
}

module.exports.createCache = function() {
  var newCache = {};
  process.stdout.write("Creating server cache... ");

  // -----------------------------------------------------------
  //        TAKE STATIC DATA IN BUFFER FOR EFFICIENCY          !
  //      2 CACHES : 1 RAW, 1 ORDERED FOR PRACTICABILITY       !
  // -----------------------------------------------------------

  this.db.task(t=> {
    return t.batch([
      t.any("select ID, name, bio, abreviation from games"),
      t.any("select ID, gameID, platformID from games_platforms"),
      t.any("select ID, gameID, name, image, position from games_ranks"),
      t.any("select ID, gameID, name, image from games_roles"),
      t.any("select ID, gameID, regionID from games_regions"),
      t.any("select ID, name, abreviation from regions"),
      t.any("select ID, name, abreviation from platforms"),
      t.any("select ID, name, abreviation from languages"),
      t.any("select ID, name, abreviation from games"),
    ]);
  })
    .then(data => {
      newCache.games = data[0];
      newCache.gamesPlatforms = data[1];
      newCache.gamesRanks = data[2];
      newCache.gamesRoles = data[3];
      newCache.gamesRegions = data[4];
      newCache.regions = data[5];
      newCache.platforms = data[6];
      newCache.languages = data[7];
      newCache.gamesNoBio = data[8];
      this.cache = newCache;
      this.createOrderedCache();
      console.log("Done.");
    }).catch(error=> {
      console.log("Error during cache creation queries", error);
    });
}

module.exports.createOrderedCache = function() {
  process.stdout.write("Ordering it... ");
  for (let i = 0; i < this.cache.games.length; i++) {
    var game = this.cache.games[i];
    this.orderedCache[game.id] = {};
    this.orderedCache[game.id].platforms = [];
    this.orderedCache[game.id].regions = [];
    this.orderedCache[game.id].ranks = [];
    this.orderedCache[game.id].roles = [];

    for (let i = 0; i < this.cache.gamesPlatforms.length; i++) {
      if (this.cache.gamesPlatforms[i].gameid == game.id) {
        this.orderedCache[game.id].platforms.push(this.cache.gamesPlatforms[i].platformid);
      }
    }
    for (let i = 0; i < this.cache.gamesRegions.length; i++) {
      if (this.cache.gamesRegions[i].gameid == game.id) {
        this.orderedCache[game.id].regions.push(this.cache.gamesRegions[i].regionid);
      }
    }
    for (let i = 0; i < this.cache.gamesRoles.length; i++) {
      if (this.cache.gamesRoles[i].gameid == game.id) {
        this.orderedCache[game.id].roles.push({id: this.cache.gamesRoles[i].id, name: this.cache.gamesRoles[i].name, image: this.cache.gamesRoles[i].image});
      }
    }
    for (let i = 0; i < this.cache.gamesRanks.length; i++) {
      if (this.cache.gamesRanks[i].gameid == game.id) {
        this.orderedCache[game.id].ranks.push({name: this.cache.gamesRanks[i].name, image: this.cache.gamesRanks[i].image, position: this.cache.gamesRanks[i].position});
      }
    }
  }
}

function onDbError(e) {
  console.log("Error during DB query", e);
  return null;
}
