const Room = require("./room");
const Player = require("./player");

module.exports = class RoomManager {
  constructor() {
    this._rooms = {};
  }

  createNewRoom() {
    var id = String(Math.random());
    var room = new Room(id);
    this._rooms[id] = room;
    return room;
  }

  findRoom(id) {
    return this._rooms[id];
  }

  doesRoomExist(id) {
    var x = this._rooms[id];
    if(x) {
      return true;
    } else {
      return false;
    }
  }

  addNewPlayerToRoom(player, id) {
    this._rooms[id].addPlayer(player);
  }
}
