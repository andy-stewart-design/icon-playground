const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
let mousePos: { x: number; y: number } | null = null;

class CannonBall {
  radius: number;
  mass: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  gravity: number;
  elasticity: number;
  friction: number;

  constructor(x: number, y: number) {
    this.radius = 30;
    this.mass = this.radius;
    this.x = x;
    this.y = y;
    this.dx = randomIntFromInterval(-3, 3);
    this.dy = 3;
    this.gravity = 0.05;
    this.elasticity = 0.5;
    this.friction = 0.02;
  }

  move() {
    if (this.y + this.radius < canvas.height) {
      this.dy += this.gravity;
    }
    if (this.y + this.radius >= canvas.height - 1) {
      this.dx = this.dx - this.dx * this.friction;
    }
    if (Math.abs(this.dx) < 0.01) this.dx = 0;
    if (Math.abs(this.dy) < 0.05) this.dy = 0;
    this.x += this.dx;
    this.y += this.dy;
    const lastBall = cannonBalls[cannonBalls.length - 1];
    if (this.x === lastBall.x && this.y === lastBall.y)
      console.log({ dx: this.dx, dy: this.dy });
  }

  draw() {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

let cannonBalls: CannonBall[] = [];

function ballHitWall(ball: CannonBall) {
  if (ball.x + ball.radius > canvas.width) {
    ball.dy = ball.dy * ball.elasticity;
    ball.x = canvas.width - ball.radius;
    ball.dx *= -1;
  } else if (ball.x - ball.radius < 0) {
    ball.dy = ball.dy * ball.elasticity;
    ball.x = 0 + ball.radius;
    ball.dx *= -1;
  } else if (ball.y + ball.radius > canvas.width) {
    ball.dy = ball.dy * ball.elasticity;
    ball.y = canvas.width - ball.radius;
    ball.dy *= -1;
  } else if (ball.y - ball.radius < 0) {
    ball.dy = ball.dy * ball.elasticity;
    ball.y = 0 + ball.radius;
    ball.dy *= -1;
  }
}

function ballHitBall(ball1: CannonBall, ball2: CannonBall) {
  let collision = false;
  let dx = ball1.x - ball2.x;
  let dy = ball1.y - ball2.y;
  //Modified pythagorous, because sqrt is slow
  let distance = dx * dx + dy * dy;
  if (
    distance <=
    (ball1.radius + ball2.radius) * (ball1.radius + ball2.radius)
  ) {
    collision = true;
  }
  return collision;
}

function collideBalls(ball1: CannonBall, ball2: CannonBall) {
  let dx = ball2.x - ball1.x;
  let dy = ball2.y - ball1.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  let vCollisionNorm = { x: dx / distance, y: dy / distance };
  let vRelativeVelocity = { x: ball1.dx - ball2.dx, y: ball1.dy - ball2.dy };
  let speed =
    vRelativeVelocity.x * vCollisionNorm.x +
    vRelativeVelocity.y * vCollisionNorm.y;
  if (speed < 0) return;
  let impulse = (2 * speed) / (ball1.mass + ball2.mass);
  ball2.dx += impulse * ball1.mass * vCollisionNorm.x;
  ball2.dy += impulse * ball1.mass * vCollisionNorm.y;
  ball2.dy = ball2.dy * ball2.elasticity * 2;
}

function collide(index: number) {
  let ball = cannonBalls[index];
  for (let j = index + 1; j < cannonBalls.length; j++) {
    let testBall = cannonBalls[j];
    if (ballHitBall(ball, testBall)) {
      collideBalls(ball, testBall);
    }
  }
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cannonBalls.forEach((ball, index) => {
    ball.move();
    ballHitWall(ball);
    collide(index);
    ball.draw();
  });
}

canvas.addEventListener("mousemove", (e) => {
  mousePos = {
    x: e.clientX - canvas.offsetLeft,
    y: e.clientY - canvas.offsetTop,
  };
});

canvas.addEventListener("click", () => {
  if (!mousePos) return;
  cannonBalls.push(new CannonBall(mousePos.x, mousePos.y));
});

animate();
