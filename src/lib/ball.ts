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

  moving = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
  acceleration = new Vector(0, 0);

  constructor({
    position = new Vector(0, 0),
    radius = 50,
    color = "red",
    friction = 0.03,
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
    this.vel.draw(this.position.x, this.position.y, "blue", this.radius / 2);
    this.acc.draw(this.position.x, this.position.y, "green", this.radius * 3);
  }

  move() {
    this.acc = this.acceleration;
    this.vel = this.vel.add(this.acc).multiply(1 - this.friction);
    this.position = this.position.add(this.vel);
  }

  handleMove() {
    const events: Array<keyof WindowEventMap> = ["keydown", "keyup"];
    const magnitude = 0.4;
    const direction = new Vector(0, 0);

    events.forEach((event) => {
      canvas.el.addEventListener(event, (e) => {
        if (isKeyboardEvent(e) && isArrowKey(e.key)) {
          if (e.key === "ArrowUp") this.moving.up = e.type === "keydown";
          if (e.key === "ArrowDown") this.moving.down = event === "keydown";
          if (e.key === "ArrowLeft") this.moving.left = event === "keydown";
          if (e.key === "ArrowRight") this.moving.right = event === "keydown";

          if (e.type === "keydown") {
            if (this.moving.up) direction.y = 1;
            if (this.moving.down) direction.y = -1;
            if (this.moving.right) direction.x = 1;
            if (this.moving.left) direction.x = -1;
          } else direction.x = direction.y = 0;

          this.acceleration = direction.unit().multiply(magnitude);
          console.log(e.type, this.acceleration);
        }
      });
    });
  }
}

function isArrowKey(key: string) {
  return ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key);
}

const isKeyboardEvent = (event: Event): event is KeyboardEvent => {
  return event.type === "keydown" || event.type === "keyup";
};
