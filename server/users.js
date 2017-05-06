module.exports.init = function() {
  this.usersConnected = [];
}

module.exports.getUserById = function(id) {
  return this.usersConnected[id];
}

module.exports.addUser = function(user) {
  this.usersConnected[user.id] = user;
}

module.exports.log = function() {
  console.log(this.usersConnected);
}
