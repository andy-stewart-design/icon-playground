// https://spicyyoghurt.com/tutorials/html5-javascript-game-development/collision-detection-physics
// https://www.jeffreythompson.org/collision-detection/point-circle.php
// https://www.schoolphysics.co.uk/age16-19/Mechanics/Kinematics/text/Relative_velocity/index.html
// https://www.mathsisfun.com/algebra/vectors-dot-product.html

import Canvas from "./canvas";

class Agent {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  restitution: number;
  isColliding: boolean;
  radius: number;
  devMode: boolean;
  angle?: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    vx: number,
    vy: number,
    mass: number
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.mass = mass;
    this.restitution = 0.9;
    this.isColliding = false;
    this.radius = mass > 0.5 ? 25 : 10;
    this.devMode = false;
  }

  draw() {
    this.ctx.fillStyle =
      this.isColliding && this.devMode ? "#ff8080" : "#0099b0";
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.fill();

    if (this.devMode) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.x, this.y);
      this.ctx.lineTo(this.x + this.vx, this.y + this.vy);
      this.ctx.stroke();
    }
  }

  update(secondsPassed: number) {
    const gravity = 9.81 * 20;

    this.vy += gravity * secondsPassed;
    this.x += this.vx * secondsPassed;
    this.y += this.vy * secondsPassed;

    if (this.devMode) {
      const angleRadians = Math.atan2(this.vy, this.vx);
      const degrees = (180 * angleRadians) / Math.PI;
      this.angle = degrees;
    }
  }
}

export class Scene {
  canvas: Canvas;
  context: CanvasRenderingContext2D;
  oldTimeStamp: number;
  agents: Agent[];

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.context = canvas.ctx;
    this.oldTimeStamp = 0;
    this.agents = [];
  }

  init() {
    this.createWorld();
    this.canvas.el.addEventListener("click", this.handleInteractionStart);
    window.requestAnimationFrame((timeStamp) => this.animate(timeStamp));
  }

  createWorld() {
    this.agents = [];
    for (let i = 0; i < 15; i++) {
      const x = 50 + Math.random() * 300;
      const y = 0 + Math.random() * 200;
      const vx = 0 + Math.random() * 50;
      const vy = 0 + Math.random() * 50;
      const mass = 0.75;
      this.agents.push(new Agent(this.canvas.ctx, x, y, vx, vy, mass));
    }
  }

  animate(timeStamp: number) {
    let secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
    this.oldTimeStamp = timeStamp;
    secondsPassed = Math.min(secondsPassed, 0.1);

    this.canvas.clear();
    this.detectCollisions();
    this.agents.forEach((agent) => {
      agent.update(secondsPassed);
      agent.draw();
    });

    window.requestAnimationFrame((timeStamp) => this.animate(timeStamp));
  }

  detectCollisions() {
    let thisAgent: Agent;
    let otherAgent: Agent;

    for (let i = 0; i < this.agents.length; i++) {
      thisAgent = this.agents[i];
      thisAgent.isColliding = false;

      if (thisAgent.x < thisAgent.radius) {
        thisAgent.vx = thisAgent.vx * 0.9 * -1;
        thisAgent.x = thisAgent.radius;
        thisAgent.isColliding = true;
      } else if (thisAgent.x > this.canvas.width - thisAgent.radius) {
        thisAgent.vx = thisAgent.vx * 0.9 * -1;
        thisAgent.x = this.canvas.width - thisAgent.radius;
        thisAgent.isColliding = true;
      }

      if (thisAgent.y < thisAgent.radius) {
        thisAgent.vy = thisAgent.vy * 0.9 * -1;
        thisAgent.y = thisAgent.radius;
        thisAgent.isColliding = true;
      } else if (thisAgent.y > this.canvas.height - thisAgent.radius) {
        thisAgent.vy = thisAgent.vy * 0.9 * -1;
        thisAgent.y = this.canvas.height - thisAgent.radius;
        thisAgent.isColliding = true;
      }

      for (let j = i + 1; j < this.agents.length; j++) {
        otherAgent = this.agents[j];

        if (this.checkIntersection(thisAgent, otherAgent)) {
          thisAgent.isColliding = true;
          otherAgent.isColliding = true;

          const vecCollision = {
            x: otherAgent.x - thisAgent.x,
            y: otherAgent.y - thisAgent.y,
          };

          const distance = this.getDistance(thisAgent, otherAgent);

          const vecCollisionNorm = {
            x: vecCollision.x / distance,
            y: vecCollision.y / distance,
          };

          const vRelativeVelocity = {
            x: thisAgent.vx - otherAgent.vx,
            y: thisAgent.vy - otherAgent.vy,
          };

          let speed =
            vRelativeVelocity.x * vecCollisionNorm.x +
            vRelativeVelocity.y * vecCollisionNorm.y;

          if (speed < 0) break;

          speed *= Math.min(thisAgent.restitution, otherAgent.restitution);
          const impulse = (2 * speed) / (thisAgent.mass + otherAgent.mass);

          thisAgent.vx -= impulse * otherAgent.mass * vecCollisionNorm.x;
          thisAgent.vy -= impulse * otherAgent.mass * vecCollisionNorm.y;
          otherAgent.vx += impulse * thisAgent.mass * vecCollisionNorm.x;
          otherAgent.vy += impulse * thisAgent.mass * vecCollisionNorm.y;
        }
      }
    }
  }

  getAngle(agent: Agent, other: Agent) {
    const angleRadians = Math.atan2(other.y - agent.y, other.x - agent.x);
    const angleDeg = (angleRadians * 180) / Math.PI;
    return angleDeg;
  }

  getDistance(agent: Agent, other: Agent) {
    return Math.sqrt((other.x - agent.x) ** 2 + (other.y - agent.y) ** 2);
  }

  checkIntersection(agent: Agent, other: Agent) {
    const distance = (other.x - agent.x) ** 2 + (other.y - agent.y) ** 2;
    return distance <= (agent.radius + agent.radius) ** 2;
  }

  handleInteractionStart(e: MouseEvent) {
    console.log(e);
  }
}
