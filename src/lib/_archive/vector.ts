import canvas from "./canvas";

export default class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get magnitude() {
    return Math.sqrt(this.magSq);
  }

  get magSq() {
    return this.x ** 2 + this.y ** 2;
  }

  add(vector: Vector) {
    this.x = this.x + vector.x;
    this.y = this.y + vector.y;
  }

  subtract(vector: Vector) {
    this.x = this.x - vector.x;
    this.y = this.y - vector.y;
  }

  multiply(scalar: number) {
    this.x = this.x * scalar;
    this.y = this.y * scalar;
  }

  divide(scalar: number) {
    this.x = this.x / scalar;
    this.y = this.y / scalar;
  }

  limit(max: number) {
    const mSq = this.magSq;
    if (mSq > max * max) {
      this.divide(Math.sqrt(mSq));
    }
    return this;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  normalize() {
    if (this.magnitude === 0) return;
    this.divide(this.magnitude);
  }

  normal() {
    return new Vector(this.y * -1, this.x);
  }

  dot(vector: Vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  draw(x: number, y: number, color = "black", factor = 1) {
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(x, y);
    canvas.ctx.lineTo(x + this.x * factor, y + this.y * factor);
    canvas.ctx.strokeStyle = color;
    canvas.ctx.stroke();
    canvas.ctx.closePath();
  }
}
