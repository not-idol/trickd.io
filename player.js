module.exports = class Player {

  constructor(id, name, style, admin) {
    this.id = id;
    this.name = name;
    this.style = style;
    this.points = 0;
    this.admin = admin;
  }

  get info() {
    return {
      name: this.name,
      style: this.style,
      points: this.points,
      admin: this.admin
    }
  }

}
