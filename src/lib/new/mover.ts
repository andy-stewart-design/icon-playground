class GameObject {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isColliding: boolean;

  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    vx: number,
    vy: number
  ) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.isColliding = false;
  }
}

class Mover extends GameObject {
  width: number;
  height: number;

  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    vx: number,
    vy: number
  ) {
    super(context, x, y, vx, vy);
    this.width = 30;
    this.height = 30;
  }

  draw(): void {
    this.context.fillStyle = this.isColliding ? "#ff8080" : "#0099b0";
    // this.context.fillRect(this.x, this.y, this.width, this.height);
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
    this.context.fill();
    this.context.closePath();
  }

  update(secondsPassed: number): void {
    this.x += this.vx * secondsPassed;
    this.y += this.vy * secondsPassed;
  }
}

export default Mover;
