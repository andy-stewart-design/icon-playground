import canvas from "./canvas";

export default class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
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

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  normalize() {
    if (this.magnitude !== 0) return;
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
    canvas.ctx.moveTo(x, canvas.toCanvasY(y));
    canvas.ctx.lineTo(
      x + this.x * factor,
      canvas.toCanvasY(y + this.y * factor)
    );
    canvas.ctx.strokeStyle = color;
    canvas.ctx.stroke();
    canvas.ctx.closePath();
  }
}
