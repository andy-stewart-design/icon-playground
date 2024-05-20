// https://spicyyoghurt.com/tutorials/html5-javascript-game-development/collision-detection-physics
// https://www.jeffreythompson.org/collision-detection/point-circle.php
// https://www.schoolphysics.co.uk/age16-19/Mechanics/Kinematics/text/Relative_velocity/index.html
// https://www.mathsisfun.com/algebra/vectors-dot-product.html

import Canvas from "./canvas";
import Vector from "./vector";

class Agent {
  ctx: CanvasRenderingContext2D;
  position: Vector;
  velocity: Vector;
  mass: number;
  restitution: number;
  isColliding: boolean;
  radius: number;
  devMode: boolean;
  angle?: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    position: Vector,
    velocity: Vector,
    mass: number
  ) {
    this.ctx = ctx;
    this.position = position;
    this.velocity = velocity;
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
    this.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    this.ctx.fill();

    if (this.devMode) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.position.x, this.position.y);
      this.ctx.lineTo(
        this.position.x + this.velocity.x,
        this.position.y + this.velocity.y
      );
      this.ctx.stroke();
    }
  }

  update(secondsPassed: number) {
    const gravity = 9.81 * 40;

    this.velocity.y += gravity * secondsPassed;
    this.position.x += this.velocity.x * secondsPassed;
    this.position.y += this.velocity.y * secondsPassed;

    if (this.devMode) {
      const angleRadians = Math.atan2(this.velocity.y, this.velocity.x);
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
    this.canvas.el.addEventListener("click", (e) =>
      this.handleInteractionStart(e)
    );
    window.requestAnimationFrame((timeStamp) => this.animate(timeStamp));
  }

  createWorld() {
    this.agents = [];
    for (let i = 0; i < 15; i++) {
      const position = new Vector(
        50 + Math.random() * 300,
        0 + Math.random() * 200
      );
      const velocity = new Vector(
        0 + Math.random() * 50,
        0 + Math.random() * 50
      );
      const mass = 0.75;
      this.agents.push(new Agent(this.canvas.ctx, position, velocity, mass));
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

      if (thisAgent.position.x < thisAgent.radius) {
        thisAgent.velocity.x = thisAgent.velocity.x * 0.9 * -1;
        thisAgent.position.x = thisAgent.radius;
        thisAgent.isColliding = true;
      } else if (thisAgent.position.x > this.canvas.width - thisAgent.radius) {
        thisAgent.velocity.x = thisAgent.velocity.x * 0.9 * -1;
        thisAgent.position.x = this.canvas.width - thisAgent.radius;
        thisAgent.isColliding = true;
      }

      if (thisAgent.position.y < thisAgent.radius) {
        thisAgent.velocity.y = thisAgent.velocity.y * 0.9 * -1;
        thisAgent.position.y = thisAgent.radius;
        thisAgent.isColliding = true;
      } else if (thisAgent.position.y > this.canvas.height - thisAgent.radius) {
        thisAgent.velocity.y = thisAgent.velocity.y * 0.9 * -1;
        thisAgent.position.y = this.canvas.height - thisAgent.radius;
        thisAgent.isColliding = true;
      }

      for (let j = i + 1; j < this.agents.length; j++) {
        otherAgent = this.agents[j];

        if (this.checkIntersection(thisAgent, otherAgent)) {
          thisAgent.isColliding = true;
          otherAgent.isColliding = true;

          const collision = new Vector(
            otherAgent.position.x - thisAgent.position.x,
            otherAgent.position.y - thisAgent.position.y
          );

          const distance = this.getDistance(
            thisAgent.position,
            otherAgent.position
          );

          const collisionNorm = new Vector(
            collision.x / distance,
            collision.y / distance
          );

          const relativeVelocity = new Vector(
            thisAgent.velocity.x - otherAgent.velocity.x,
            thisAgent.velocity.y - otherAgent.velocity.y
          );

          let speed = Vector.dot(relativeVelocity, collisionNorm);

          if (speed < 0) break;

          speed *= Math.min(thisAgent.restitution, otherAgent.restitution);
          const impulse = (2 * speed) / (thisAgent.mass + otherAgent.mass);

          thisAgent.velocity.x -= impulse * otherAgent.mass * collisionNorm.x;
          thisAgent.velocity.y -= impulse * otherAgent.mass * collisionNorm.y;
          otherAgent.velocity.x += impulse * thisAgent.mass * collisionNorm.x;
          otherAgent.velocity.y += impulse * thisAgent.mass * collisionNorm.y;
        }
      }
    }
  }

  getDistance(vec1: Vector, vec2: Vector) {
    return Math.sqrt((vec2.x - vec1.x) ** 2 + (vec2.y - vec1.y) ** 2);
  }

  checkIntersection(agent: Agent, other: Agent) {
    const distance =
      (other.position.x - agent.position.x) ** 2 +
      (other.position.y - agent.position.y) ** 2;
    return distance <= (agent.radius + agent.radius) ** 2;
  }

  handleInteractionStart(e: MouseEvent) {
    const mouse = new Vector(e.clientX, e.clientY);
    this.agents.forEach((agent) => {
      const distance = this.getDistance(agent.position, mouse);
      if (distance < agent.radius) {
        agent.velocity.y = agent.velocity.y + -500;
      }
    });
  }
}
