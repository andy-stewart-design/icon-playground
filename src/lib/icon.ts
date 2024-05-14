import Vector from "./vector";
import canvas from "./canvas";

export default class Icon {
  pos: Vector;
  vel: Vector;
  acc: Vector;
  rad: number;
  col: string;

  constructor({
    pos = new Vector(0, 0),
    vel = new Vector(0, 0),
    acc = new Vector(0, 0),
    rad = 25,
    col = "blue",
  }) {
    this.pos = pos;
    this.vel = vel;
    this.acc = acc;
    this.rad = rad;
    this.col = col;
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show() {
    canvas.ctx.beginPath();
    canvas.ctx.arc(this.pos.x, this.pos.y, this.rad, 0, 2 * Math.PI);
    canvas.ctx.strokeStyle = this.col;
    canvas.ctx.lineWidth = 2;
    canvas.ctx.stroke();
    canvas.ctx.closePath();
  }

  edges() {
    if (this.pos.y >= canvas.height - this.rad) {
      this.pos.y = canvas.height - this.rad;
      this.vel.y = (this.vel.y / 1.75) * -1;
    }
    if (this.pos.y <= 0 + this.rad) {
      this.pos.y = canvas.height - this.rad;
      this.vel.y = (this.vel.y / 1.75) * -1;
    }
    if (this.pos.x >= canvas.width - this.rad) {
      this.pos.x = this.rad;
      this.vel.x = this.vel.x * -1;
    }
    if (this.pos.x <= 0 + this.rad) {
      this.pos.x = this.rad;
      this.vel.x = this.vel.x * -1;
    }
  }

  applyForce(force: Vector) {
    this.acc.add(force);
  }
}
