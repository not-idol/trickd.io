'use strict';
module.exports = class Lobby{
  constructor(url) {
    this.url = url;
    this.sockets = [];
    this.questionSequence = [];
    this.settings = {
      rounds: 5,
      timer: 30,
      numberOfQuestions: 10
    };
    this.state = ""
    this.round = 1;
  }

  addPlayer(socket) {
    this.sockets.push(socket);
  }

  removePlayer(socket) {
    this.sockets = this.sockets.filter(s => s.id != socket.id);
  }

  setNewAdmin() {
    this.sockets[0].player.admin = true;
  }

  getPlayers() {
    var p = [];
    var q = [];
    for(let i = 0; i < this.sockets.length; i++) {
      var s = this.sockets[i];
      q.push(s);
      p.push(s.player)
    }
    return {players: p, sockets: q};
  }

  generateQuestionSequence() {
    var fs = require('fs')
    var catalog = JSON.parse(fs.readFileSync('./catalog.json', 'utf8'));
    var selected = [];
    for (let i = 0; i < catalog.length; i++) {
      selected[i] = i;
    }
    selected = this.shuffle(selected);
    var l = Math.min(this.settings.numberOfQuestions, catalog.length)
    for(let i = 0; i < l; i++) {
      this.questionSequence[i] = catalog[selected[i]];
    }
  }

  shuffle(array) {
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
}
