module.exports = class Player {

  constructor(id, name, style, admin) {
    this.id = id;
    this.username = name;
    this.style = style;
    this.points = 0;
    this.admin = admin;
  }

}
