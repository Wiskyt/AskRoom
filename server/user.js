var method = User.prototype;

function User(data) {
  this.username = data.username;
  this.password = data.password;
  this.email = data.email;
  this.id = data.id;
  this.bio = data.bio;
  this.age = data.age;
  this.avatar = data.avatar;
  this.availability = data.availability;
}

method.validPassword = function(psw) {
  if (psw == this.password) {
    return true;
  } return false;
}
module.exports = User;
