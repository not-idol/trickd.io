module.exports = class Room {
  constructor(id) {
    this.id = id;
    this.players = [];
    this.questionSequence = [];
    this.settings = {
      rounds: 5,
      timer: 30,
      numberOfQuestions: 10
    };
    this.state = ""
    this.round = 1;
    this.admin;
  }

  addPlayer(player) {
    this.players.push(player);
  }

  removePlayer(player) {
    this.players = this.players.filter(p => p.id != player.id);
  }

  getPlayers() {
    var a = [];
    for(let i = 0; i < this.players.length; i++) {
      var t = {...this.players[i]};
      t.id = null;
      a.push(t);
    }
    return a;
  }

  setNewAdmin() {
    this.admin = this.players[0];
    this.players[0].admin = true;
    //console.log(this.players);
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
