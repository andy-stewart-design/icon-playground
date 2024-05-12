import canvas from "./lib/canvas";
import Vector from "./lib/vector";
// import { Circle } from "./lib/circle";
import "./style.css";
import Ball from "./lib/ball";

// const { canvas, ctx } = setup();
// canvas.el.addEventListener("keydown", handleKeydown);
// canvas.el.addEventListener("keyup", handleKeyUp);

// const circles: Array<Circle> = [];
// let LEFT = false;
// let UP = false;
// let RIGHT = false;
// let DOWN = false;

// for (let i = 0; i < 2; i++) {
//   const pos = 100 + i * 100;
//   const r = Math.random() * 20;
//   circles.push(new Circle(canvas.ctx, pos, pos, r, Math.random() > 0.5));
// }

init();

// Functions

function init() {
  const ball = new Ball({
    position: new Vector(canvas.center.x, canvas.center.y),
  });
  const ball2 = new Ball({
    position: new Vector(100, 100),
    controls: false,
  });

  function draw() {
    canvas.clear();
    ball.update();
    ball.draw();
    ball2.update();
    ball2.draw();
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
  // canvas.ctx.clearRect(0, 0, 640, 480);
  // circles.forEach((c) => {
  //   if (c.isActive) move(c);
  //   c.draw();
  // });
  // requestAnimationFrame(init);
}

// function handleKeydown(e: KeyboardEvent) {
//   console.log(e);

//   // if (e.key === "ArrowUp") UP = true;
//   // if (e.key === "ArrowDown") DOWN = true;
//   // if (e.key === "ArrowLeft") LEFT = true;
//   // if (e.key === "ArrowRight") RIGHT = true;
// }

// function handleKeyUp(e: KeyboardEvent) {
//   console.log(e);

//   // if (e.key === "ArrowUp") UP = false;
//   // if (e.key === "ArrowDown") DOWN = false;
//   // if (e.key === "ArrowLeft") LEFT = false;
//   // if (e.key === "ArrowRight") RIGHT = false;
// }

// function move(b: Circle) {
//   if (UP) b.y -= 1;
//   if (DOWN) b.y += 1;
//   if (LEFT) b.x -= 1;
//   if (RIGHT) b.x += 1;
// }
