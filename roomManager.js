const Room = require("./room");

module.exports = class RoomManager {
  constructor() {
    this._rooms = {};
  }

  createNewRoom() {
    var id = "bunnybutt";
    var room = new Room(id);
    this._rooms[id] = room;
    return room;
  }

  findRoom(id) {
    return this._rooms[id];
  }

}
