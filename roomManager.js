const Room = require("./room");
const Player = require("./player");

module.exports = class RoomManager {
  constructor() {
    this.rooms = {};
  }

  createNewGame(creator) {
    var id = getLink();
    while((id in this.rooms)) {
      id = getLink();
    }
    this.rooms[id] = new Room(id);
    this.rooms[id].admin = creator;
    this.addPlayerToRoom(id, creator);
    return this.rooms[id];
  }

  addPlayerToRoom(id, player) {
    player.roomId = id;
    this.rooms[id].addPlayer(player);
    return this.rooms[id];
  }

  removePlayerFromRoom(id, player) {
    //console.log(player);
    if(this.rooms[id]) {
      var admin = this.rooms[id].admin;
      this.rooms[id].removePlayer(player);
      if(this.rooms[id].players.length > 0) {
        if(player.admin) {
          admin = this.rooms[id].setNewAdmin();
        }
      }
      return {players: this.rooms[id].getPlayers(), admin: admin};
    } else {
      return null;
    }
  }

  deleteRoom(id) {
    delete this.rooms[id];
  }

  getRoom(id) {
    return this.rooms[id];
  }
}

const urlCodes = [
  'Bunny',
  'Butt',
  'Milk',
  'Chocholate',
  'Trousers',
  'Cream',
  'Juicy',
  'Night',
  'Garden'
];

function getLink() {
  var a = shuffle(urlCodes);
  var s = "";
  for(let i = 0; i < 3; i++) {
    s += a[i];
  }
  return s;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
