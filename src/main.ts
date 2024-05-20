import { Scene } from "./lib/new/yog";
import Canvas from "./lib/new/canvas";

const canvas = new Canvas();
const app = document.querySelector("#app");
if (!app) throw new Error("App not found");
app.appendChild(canvas.el);

const scene = new Scene(canvas);
scene.init();

// import Mover from "./lib/new/mover";
// import canvas from "./lib/canvas";

// let gameObjects: Array<Mover> = [];
// let secondsPassed = 0;
// let oldTimeStamp = secondsPassed;

// function createWorld() {
//   gameObjects = [
//     new Mover(canvas.ctx, 150, 0, 50, 50),
//     // new Mover(canvas.ctx, 250, 50, 0, 50),
//     // new Mover(canvas.ctx, 250, 150, 50, 50),
//     new Mover(canvas.ctx, 250, 300, 0, -50),
//     // new Mover(canvas.ctx, 350, 75, -50, 50),
//     // new Mover(canvas.ctx, 300, 300, 50, -50),
//   ];
// }

// function detectCollisions(mover: Mover) {
//   for (const other of gameObjects) {
//     if (mover === other) continue;

//     if (checkIntersection(mover, other)) {
//       mover.isColliding = true;
//       break;
//     } else {
//       mover.isColliding = false;
//     }
//   }
// }

// function checkIntersection(mover: Mover, other: Mover) {
//   // Calculate the distance between the two circles
//   let squareDistance =
//     (mover.x - other.x) * (mover.x - other.x) +
//     (mover.y - other.y) * (mover.y - other.y);

//   // When the distance is smaller or equal to the sum
//   // of the two radius, the circles touch or overlap
//   return (
//     squareDistance <= (mover.width + other.width) * (mover.width + other.width)
//   );
// }

// function gameLoop(timeStamp: number) {
//   secondsPassed = (timeStamp - oldTimeStamp) / 1000;
//   oldTimeStamp = timeStamp;
//   canvas.clear();

//   gameObjects.forEach((mover) => {
//     mover.update(secondsPassed);
//     detectCollisions(mover);

//     mover.draw();
//   });

//   window.requestAnimationFrame(gameLoop);
// }

// createWorld();
// gameLoop(0);
