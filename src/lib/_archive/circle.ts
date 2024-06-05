export class Circle {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  r: number;
  isActive: boolean;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    isActive: boolean = false
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.r = r;
    this.isActive = isActive;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    this.ctx.fillStyle = "red";
    this.ctx.fill();
    this.ctx.closePath();
  }
}
