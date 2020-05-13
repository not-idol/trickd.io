module.exports = class Room {
  constructor(id) {
    this._id = id;
    this._players = [];
    this._questionSequence = [];
    this._settings = {
      rounds: 5,
      timer: 30,
      NumberOfQuestions: 10
    };
  }

  addPlayer(player) {
    this.players.push(player);
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

  get questionSequence() {
    return this._questionSequence;
  }

  generateQuestionSequence() {
    var array = [];
    for (let i = 0; i < 100; i++) {
      array[i] = i;
    }
    array = this.shuffle(array);
    for(let i = 0; i < this.settings.NumberOfQuestions; i++) {
      this._questionSequence[i] = array[i];
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
