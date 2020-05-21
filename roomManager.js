'use strict';
const Lobby = require("./lobby");
const Player = require("./player");

module.exports = class LobbyManager {
  constructor() {
    this.lobbies = {};
  }

  createNewLobby() {
    var url = getLink();
    while((url in this.lobbies)) {
      url = getLink();
    }
    this.lobbies[url] = new Lobby(url);
    return this.lobbies[url];
  }

  addPlayerToLobby(lobby, socket) {
    var url = lobby.url;
    this.lobbies[url].addPlayer(socket);
    return this.lobbies[url];
  }

  removePlayerFromLobby(lobby, socket) {
    this.lobbies[lobby.url].removePlayer(socket);
    return this.lobbies[lobby.url];
  }

  setNewAdmin(lobby) {
    this.lobbies[lobby.url].setNewAdmin();
  }

  deleteLobby(lobby) {
    delete this.lobbies[lobby.url];
  }

  getLobby(url) {
    return this.lobbies[url];
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
