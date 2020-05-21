'use strict';
module.exports = class Player {

  constructor(name, style, admin) {
    this.username = name;
    this.style = style;
    this.points = 0;
    this.admin = admin;
  }

}
