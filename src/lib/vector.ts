import canvas from "./canvas";

export default class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  add(vector: Vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  subtract(vector: Vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  multiply(scalar: number) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  divide(scalar: number) {
    return new Vector(this.x / scalar, this.y / scalar);
  }

  normalize() {
    if (this.magnitude() === 0) return new Vector(0, 0);
    else return this.divide(this.magnitude());
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
