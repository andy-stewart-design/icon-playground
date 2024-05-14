import Vector from "./vector";
import canvas from "./canvas";

export default class Icon {
  pos: Vector;
  vel: Vector;
  acc: Vector;
  mass: number;
  rad: number;
  col: string;

  constructor({
    pos = new Vector(0, 0),
    vel = new Vector(0, 0),
    acc = new Vector(0, 0),
    mass = 1,
    col = "blue",
  }) {
    this.pos = pos;
    this.vel = vel;
    this.acc = acc;
    this.mass = mass;
    this.rad = Math.sqrt(this.mass) * 25;
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
    canvas.ctx.fillStyle = this.col;
    canvas.ctx.fill();
    canvas.ctx.closePath();
  }

  applyForce(force: Vector) {
    const nextForce = force.copy();
    nextForce.divide(this.mass);
    this.acc.add(nextForce);
  }

  friction() {
    if (canvas.height - (this.pos.y + this.rad) < 1) {
      const friction = this.vel.copy();
      const mu = 0.1;
      const normal = this.mass / 5;
      friction.normalize();
      friction.multiply(mu * normal * -1);
      this.applyForce(friction);
    }
  }

  edges() {
    if (this.pos.y >= canvas.height - this.rad) {
      this.pos.y = canvas.height - this.rad;
      this.vel.y = (this.vel.y / 1.75) * -1;
    }
    if (this.pos.y <= 0 - this.rad) {
      this.pos.y = 0 - this.rad;
      this.vel.y = (this.vel.y / 1.75) * -1;
    }
    if (this.pos.x >= canvas.width - this.rad) {
      this.pos.x = canvas.width - this.rad;
      this.vel.x = this.vel.x * -1;
    }
    if (this.pos.x <= 0 + this.rad) {
      this.pos.x = this.rad;
      this.vel.x = this.vel.x * -1;
    }
  }

  isOverlapping(other: Icon) {
    const currentPos = this.pos.copy();
    currentPos.subtract(other.pos);
    const distanceBetweenCenterPoints = currentPos.magnitude;
    const comibinedRadii = this.rad + other.rad;
    return comibinedRadii >= distanceBetweenCenterPoints;
  }
}
