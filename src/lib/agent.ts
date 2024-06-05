import { random } from "../utils/math";
import Vector from "./vector";

interface ConstructorArgs {
  ctx: CanvasRenderingContext2D;
  radius: number;
  position: Vector;
  velocity: Vector;
  icon: HTMLImageElement;
  mouse: {
    position: Vector;
    velocity: Vector;
  };
}

class Agent {
  ctx: CanvasRenderingContext2D;
  icon: HTMLImageElement;
  radius: number;
  iconMultiplier: number;
  iconSize: number;
  radians: number;
  mass: number;
  position: Vector;
  positionOffset: Vector;
  mouse: {
    position: Vector;
    velocity: Vector;
  };
  velocity: Vector;
  rotationVel: number;
  isBeingDragged: boolean;
  restitution: number;
  gravity: number;
  elasticity: number;
  friction: number;

  constructor({
    ctx,
    position,
    radius,
    velocity,
    icon,
    mouse,
  }: ConstructorArgs) {
    this.ctx = ctx;
    this.icon = icon;
    this.radius = radius;
    this.iconMultiplier = 0.875;
    this.iconSize = this.radius * this.iconMultiplier;
    this.mass = 0.75;
    this.position = position;
    this.positionOffset = new Vector(0, 0);
    this.velocity = velocity;
    this.radians = random(-Math.PI, Math.PI);
    this.rotationVel = this.rotationVel = this.velocity.x / 1000000;
    this.isBeingDragged = false;
    this.restitution = 0.9;
    this.gravity = 9.81 * 80;
    this.elasticity = 0.5;
    this.friction = 0.02;
    this.mouse = mouse;
  }

  draw() {
    const iconOffset = (this.iconSize / 2) * -1;
    this.ctx.save();
    this.ctx.translate(this.position.x, this.position.y);
    this.ctx.rotate((this.radians += this.rotationVel));
    this.ctx.fillStyle = "white";
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.drawImage(
      this.icon,
      iconOffset,
      iconOffset,
      this.iconSize,
      this.iconSize
    );
    this.ctx.restore();
    this.rotationVel = this.velocity.x / 10000;
  }

  update(secondsPassed: number) {
    if (this.isBeingDragged) {
      const nextPos = Vector.subtract(this.mouse.position, this.positionOffset);
      this.position.set(nextPos.x, nextPos.y);
      this.velocity.set(this.mouse.velocity.x, this.mouse.velocity.y);
    } else {
      this.velocity.y += this.gravity * secondsPassed;
      this.position.x += this.velocity.x * secondsPassed;
      this.position.y += this.velocity.y * secondsPassed;
    }
  }

  setSize(size: number) {
    this.radius = size;
    this.updateIconSize();
  }

  updateIconSize() {
    this.iconSize = this.radius * this.iconMultiplier;
  }
}

export default Agent;
