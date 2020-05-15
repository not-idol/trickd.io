module.exports = class Room {
  constructor(id) {
    this._id = id;
    this._players = [];
    this._questionSequence = [];
    this._settings = {
      rounds: 5,
      timer: 30,
      numberOfQuestions: 10
    };
    this.state = ""
    this.round = 1;
    this._admin;
  }

  addPlayer(player) {
    this.players.push(player);
    if(player.admin) {
      this.admin = player;
    }
  }

  removePlayer(player) {
    this._players = this._players.filter(p => p.id != player.id);
  }

  get id() {
    return this._id;
  }

  get settings() {
    return this._settings;
  }
  set settings(s) {
    this._settings = s;
  }

  get players() {
    return this._players;
  }

  get infoPlayers() {
    var a = []
    for (let i = 0; i < this.players.length; i++) {
      a.push(this.players[i].info);
    }
    return a;
  }

  get questionSequence() {
    return this._questionSequence;
  }

  get admin() {
    return this._admin;
  }

  set admin(p) {
    this._admin = p;
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
      this._questionSequence[i] = catalog[selected[i]];
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
