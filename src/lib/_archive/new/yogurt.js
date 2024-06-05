class GameObject {
  constructor(context, x, y, vx, vy, mass, restitution) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.mass = mass;
    this.restitution = restitution;

    this.isColliding = false;
  }
}

class Circle extends GameObject {
  constructor(context, x, y, vx, vy, mass, showAngle, bounceOfEdges) {
    super(context, x, y, vx, vy, mass, 0.9);

    this.radius = mass > 0.5 ? 25 : 10; //25;
    this.showAngle = showAngle;
    this.bounceOfEdges = bounceOfEdges;
  }

  draw() {
    this.context.fillStyle = this.isColliding ? "#ff8080" : "#0099b0";

    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.context.fill();

    if (this.showAngle) {
      this.context.beginPath();
      this.context.moveTo(this.x, this.y);
      this.context.lineTo(this.x + this.vx, this.y + this.vy);
      this.context.stroke();
    }
  }

  update(secondsPassed) {
    let g = 9.81 * 20;

    this.vy += g * secondsPassed;
    this.x += this.vx * secondsPassed;
    this.y += this.vy * secondsPassed;

    if (this.showAngle) {
      let angleRadians = Math.atan2(this.vy, this.vx); //in radians
      let degrees = (180 * angleRadians) / Math.PI; // to degrees
      this.angle = degrees; //(360+Math.round(degrees))%360;
    }
  }
}

class GameWorld {
  constructor(
    showCollision,
    showCircles,
    bounce,
    gravityAndMass,
    showAngle,
    bounceOfEdges
  ) {
    this.canvas = null;
    this.context = null;
    this.oldTimeStamp = 0;
    this.gameObjects = [];
    this.resetCounter = 0;
    this.showCollision = showCollision;
    this.showCircles = showCircles;
    this.bounce = bounce;
    this.gravityAndMass = gravityAndMass;
    this.showAngle = showAngle;
    this.bounceOfEdges = bounceOfEdges;
  }

  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.createWorld();
    window.requestAnimationFrame((timeStamp) => this.gameLoop(timeStamp));
  }

  createWorld() {
    this.gameObjects = [];

    for (var i = 0; i < 15; i++) {
      this.gameObjects.push(
        new Circle(
          this.context,
          50 + Math.random() * 300,
          0 + Math.random() * 200,
          0 + Math.random() * 50,
          0 + Math.random() * 50,
          0.75,
          this.showAngle,
          this.bounceOfEdges
        )
      );
    }
  }

  gameLoop(timeStamp) {
    let secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
    this.oldTimeStamp = timeStamp;

    secondsPassed = Math.min(secondsPassed, 0.1);

    this.resetCounter += secondsPassed;

    if (this.resetCounter > 30) {
      this.resetCounter = 0;
      this.createWorld();
    }

    for (let i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].update(secondsPassed);
    }

    if (this.showCollision) {
      this.detectCollisions();
    }

    this.clearCanvas();

    for (let i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].draw();
    }

    window.requestAnimationFrame((timeStamp) => this.gameLoop(timeStamp));
  }

  detectCollisions() {
    var obj1;
    var obj2;

    for (var i = 0; i < this.gameObjects.length; i++) {
      obj1 = this.gameObjects[i];
      obj1.isColliding = false;

      const canvasWidth = 750;
      const canvasHeight = 400;
      if (obj1.x < obj1.radius) {
        obj1.vx = Math.abs(obj1.vx) * 0.9;
        obj1.x = obj1.radius;
        obj1.isColliding = true;
      } else if (obj1.x > canvasWidth - obj1.radius) {
        obj1.vx = -Math.abs(obj1.vx) * 0.9;
        obj1.x = canvasWidth - obj1.radius;
        obj1.isColliding = true;
      }
      if (obj1.y < obj1.radius) {
        obj1.vy = Math.abs(obj1.vy) * 0.9;
        obj1.y = obj1.radius;
        obj1.isColliding = true;
      } else if (obj1.y > canvasHeight - obj1.radius) {
        obj1.vy = -Math.abs(obj1.vy) * 0.9;
        obj1.y = canvasHeight - obj1.radius;
        obj1.isColliding = true;
      }
    }

    for (var i = 0; i < this.gameObjects.length; i++) {
      obj1 = this.gameObjects[i];
      for (var j = i + 1; j < this.gameObjects.length; j++) {
        obj2 = this.gameObjects[j];

        if (
          this.circleIntersect(
            obj1.x,
            obj1.y,
            obj1.radius,
            obj2.x,
            obj2.y,
            obj2.radius
          )
        ) {
          obj1.isColliding = true;
          obj2.isColliding = true;

          var vecCollision = { x: obj2.x - obj1.x, y: obj2.y - obj1.y };
          var distance = this.getDistance(obj1.x, obj1.y, obj2.x, obj2.y);

          var vecCollisionNorm = {
            x: vecCollision.x / distance,
            y: vecCollision.y / distance,
          };
          var vRelativeVelocity = {
            x: obj1.vx - obj2.vx,
            y: obj1.vy - obj2.vy,
          };
          var speed =
            vRelativeVelocity.x * vecCollisionNorm.x +
            vRelativeVelocity.y * vecCollisionNorm.y;

          if (speed < 0) {
            break;
          }
          if (this.gravityAndMass) {
            if (this.bounceOfEdges) {
              speed *= Math.min(obj1.restitution, obj2.restitution);
            }

            var impulse = (2 * speed) / (obj1.mass + obj2.mass);

            obj1.vx -= impulse * obj2.mass * vecCollisionNorm.x;
            obj1.vy -= impulse * obj2.mass * vecCollisionNorm.y;
            obj2.vx += impulse * obj1.mass * vecCollisionNorm.x;
            obj2.vy += impulse * obj1.mass * vecCollisionNorm.y;
          }
        }
      }
    }
  }

  getAngle(x1, x2, y1, y2) {
    var angleRadians = Math.atan2(y2 - y1, x2 - x1);
    var angleDeg = (angleRadians * 180) / Math.PI;
    return angleDeg;
  }

  getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }

  circleIntersect(x1, y1, r1, x2, y2, r2) {
    var distance = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    return distance <= (r1 + r2) * (r1 + r2);
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export function init(
  canvasId,
  showCollision,
  showCircles,
  bounce,
  gravityAndMass,
  showAngle,
  bounceOfEdges
) {
  var gameWorld = new GameWorld(
    showCollision,
    showCircles,
    bounce,
    gravityAndMass,
    showAngle,
    bounceOfEdges
  );
  gameWorld.init(canvasId);
}
