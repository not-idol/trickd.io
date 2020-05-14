const Room = require("./room");
const Player = require("./player");

module.exports = class RoomManager {
  constructor() {
    this._rooms = {};
  }

  createNewRoom(p) {
    var id = "bunnybutt";
    var room = new Room(id);
    room.admin = p;
    this._rooms[id] = room;
    return room;
  }

  findRoom(id) {
    return this._rooms[id];
  }

}
