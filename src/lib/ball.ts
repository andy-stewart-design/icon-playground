import Vector from "./vector";
import canvas from "./canvas";

export default class Ball {
  position: Vector;
  acc: Vector;
  vel: Vector;
  radius: number;
  color: string;
  friction: number;
  controls: boolean;

  constructor({
    position = new Vector(0, 0),
    radius = 50,
    color = "red",
    friction = 0.05,
    controls = true,
  }) {
    this.position = position;
    this.acc = new Vector(0, 0);
    this.vel = new Vector(0, 0);

    this.radius = radius;
    this.color = color;
    this.friction = friction;
    this.controls = controls;

    if (this.controls) this.handleMove();
  }

  draw() {
    canvas.ctx.beginPath();
    canvas.ctx.arc(
      this.position.x,
      canvas.toCanvasY(this.position.y),
      this.radius,
      0,
      2 * Math.PI
    );
    canvas.ctx.strokeStyle = this.color;
    canvas.ctx.stroke();
    canvas.ctx.closePath();

    if (this.controls) this.drawVectors();
  }

  drawVectors() {
    this.vel
      .normalize()
      .multiply(this.radius * 2)
      .draw(this.position.x, this.position.y, "blue");
    this.acc
      .normalize()
      .multiply(this.radius)
      .draw(this.position.x, this.position.y, "green");
  }

  update() {
    this.vel = this.vel.add(this.acc).multiply(1 - this.friction);
    this.position = this.position.add(this.vel);
  }

  handleMove() {
    const events: Array<keyof WindowEventMap> = ["keydown", "keyup"];
    const magnitude = 0.4;
    const nextDirection = new Vector(0, 0);

    events.forEach((event) => {
      canvas.el.addEventListener(event, (e) => {
        if (isKeyboardEvent(e) && isArrowKey(e.key)) {
          if (e.key === "ArrowUp") {
            nextDirection.y = e.type === "keydown" ? 1 : 0;
          } else if (e.key === "ArrowDown") {
            nextDirection.y = e.type === "keydown" ? -1 : 0;
          } else if (e.key === "ArrowRight") {
            nextDirection.x = e.type === "keydown" ? 1 : 0;
          } else if (e.key === "ArrowLeft") {
            nextDirection.x = e.type === "keydown" ? -1 : 0;
          }

          this.acc = nextDirection.multiply(magnitude);
        }
      });
    });
  }
}

function isArrowKey(key: string) {
  const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  return keys.includes(key);
}

const isKeyboardEvent = (event: Event): event is KeyboardEvent => {
  return event.type === "keydown" || event.type === "keyup";
};
