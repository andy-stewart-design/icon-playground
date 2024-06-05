// import { RefObject, useEffect, useRef, useState } from 'react'
import Canvas from "./canvas";
import Agent from "./agent";
import Vector from "./vector";
import { getIcons } from "./svg";
// import { debounce } from '@/utils/debounce'

export default class Scene {
  rafId: number;
  canvas: Canvas;
  context: CanvasRenderingContext2D;
  oldTimeStamp: number;
  time: number;
  agents: Agent[];
  mouse: {
    position: Vector;
    velocity: Vector;
  };
  iconsRaw: string[];
  icons: HTMLImageElement[];
  pressStartController: AbortController;
  pressMoveController: AbortController;
  pressEndController: AbortController;
  mouseOutController: AbortController;

  constructor(canvas: Canvas, icons: string[]) {
    this.rafId = 0;
    this.canvas = canvas;
    this.context = canvas.ctx;
    this.oldTimeStamp = 0;
    this.time = Date.now();
    this.agents = [];
    this.iconsRaw = icons;
    this.icons = getIcons(this.iconsRaw);
    this.mouse = {
      position: new Vector(0, 0),
      velocity: new Vector(0, 0),
    };
    this.pressStartController = new AbortController();
    this.pressMoveController = new AbortController();
    this.pressEndController = new AbortController();
    this.mouseOutController = new AbortController();
  }

  init() {
    this.createWorld();
    this.canvas.el.addEventListener(
      "mousedown",
      () => this.handlePressStart(),
      { signal: this.pressStartController.signal }
    );
    this.canvas.el.addEventListener(
      "mousemove",
      (e) => this.handlePressMove(e),
      {
        signal: this.pressMoveController.signal,
      }
    );
    this.canvas.el.addEventListener("mouseup", () => this.handlePressEnd(), {
      signal: this.pressEndController.signal,
    });
    this.canvas.el.addEventListener("mouseout", () => this.handlePressEnd(), {
      signal: this.mouseOutController.signal,
    });
  }

  createWorld() {
    this.agents = [];
    if (this.icons.length < this.iconsRaw.length) {
      this.icons = getIcons(this.iconsRaw);
    }
    for (let i = 0; i < 5; i++) {
      const ctx = this.canvas.ctx;
      const mouse = this.mouse;
      const icon = this.pickIcon();
      const position = new Vector(
        100 + Math.random() * (this.canvas.width - 200),
        Math.random() * 200
      );
      const radius = Math.max(80, this.canvas.width / 14);
      const velocityMultiplier = this.canvas.width / 2;
      const vX = Math.random() * velocityMultiplier - velocityMultiplier / 2;
      const velocity = new Vector(vX, 0);
      this.agents.push(
        new Agent({ ctx, position, radius, velocity, icon, mouse })
      );
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

    this.rafId = requestAnimationFrame((timeStamp) => this.animate(timeStamp));
  }

  play() {
    this.agents.forEach((agent) => {
      agent.position = new Vector(
        100 + Math.random() * (this.canvas.width - 200),
        100 + Math.random() * 100
      );
      agent.setSize(Math.max(80, this.canvas.width / 14));
    });
    this.rafId = requestAnimationFrame((timeStamp) => this.animate(timeStamp));
  }

  pause() {
    cancelAnimationFrame(this.rafId);
  }

  shake() {
    this.agents.forEach((agent) => {
      const vX = Math.random() * 1000 - 500;
      const vY = this.canvas.height / 2 + Math.random() * this.canvas.height;
      agent.velocity.set(vX, vY * -1);
    });
  }

  pickIcon() {
    const index = Math.floor(Math.random() * this.icons.length);
    const icon = this.icons[index];
    this.icons.splice(index, 1);
    return icon;
  }

  addAgent(fromTap = true) {
    const ctx = this.canvas.ctx;
    const mouse = this.mouse;
    const posX = fromTap ? mouse.position.x : Math.random() * this.canvas.width;
    const posY = fromTap ? mouse.position.y : 200;
    const position = new Vector(posX, posY);
    const radius = Math.max(80, this.canvas.width / 14);
    const vMultiplier = this.canvas.width / 2;
    const vX = Math.random() * vMultiplier - vMultiplier / 2;
    const velocity = new Vector(vX, 0);
    const icon = this.pickIcon();
    this.agents.push(
      new Agent({ ctx, velocity, radius, position, icon, mouse })
    );
  }

  get numIcons() {
    return this.icons.length;
  }

  detectCollisions() {
    const sortedAgents = this.agents.toSorted(
      (a, b) => Math.floor(a.position.x) - Math.floor(b.position.x)
    );

    for (let i = 0; i < sortedAgents.length; i++) {
      const thisAgent = sortedAgents[i];

      if (thisAgent.position.x < thisAgent.radius) {
        thisAgent.velocity.x = thisAgent.velocity.x * 0.9 * -1;
        thisAgent.position.x = thisAgent.radius;
      } else if (thisAgent.position.x > this.canvas.width - thisAgent.radius) {
        thisAgent.velocity.x = thisAgent.velocity.x * 0.9 * -1;
        thisAgent.position.x = this.canvas.width - thisAgent.radius;
      }

      if (thisAgent.position.y < thisAgent.radius) {
        thisAgent.velocity.y = thisAgent.velocity.y * 0.9 * -1;
        thisAgent.position.y = thisAgent.radius;
      } else if (thisAgent.position.y > this.canvas.height - thisAgent.radius) {
        thisAgent.velocity.y = thisAgent.velocity.y * 0.9 * -1;
        thisAgent.position.y = this.canvas.height - thisAgent.radius;
        if (thisAgent.velocity.x < 0) {
          thisAgent.velocity.x = Math.min(thisAgent.velocity.x + 0.5, 0);
        } else {
          thisAgent.velocity.x = Math.max(thisAgent.velocity.x - 0.5, 0);
        }
      }

      for (let j = i + 1; j < sortedAgents.length; j++) {
        const otherAgent = sortedAgents[j];

        const otherLeftPoint = otherAgent.position.x - otherAgent.radius;
        const thisRightPoint = thisAgent.position.x + thisAgent.radius;
        if (otherLeftPoint > thisRightPoint) break;

        const distanceVector = Vector.subtract(
          otherAgent.position,
          thisAgent.position
        );
        const radiiSquared = (thisAgent.radius + otherAgent.radius) ** 2;
        const isOverlapping = distanceVector.magSq <= radiiSquared;

        if (isOverlapping) {
          const collision = Vector.subtract(
            otherAgent.position,
            thisAgent.position
          );

          const distance = distanceVector.magnitude;

          const collisionNorm = Vector.divide(collision, distance);

          const relativeVelocity = Vector.subtract(
            thisAgent.velocity,
            otherAgent.velocity
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

  handlePressStart() {
    const mouse = this.mouse;
    const agent = this.agents
      .filter((agent) => {
        const distance = Vector.subtract(
          agent.position,
          mouse.position
        ).magnitude;
        return distance < agent.radius;
      })
      .at(0);

    if (agent) {
      agent.isBeingDragged = true;
      agent.positionOffset = Vector.subtract(mouse.position, agent.position);
    } else if (this.icons.length > 0) {
      this.addAgent();
    }
  }

  handlePressMove(e: MouseEvent) {
    const previousTime = this.time;
    const previousMouse = this.mouse;
    const currentTime = Date.now();
    const currentMousePosition = new Vector(
      e.clientX - this.canvas.position.x,
      e.clientY - this.canvas.position.y
    );

    const timeDiff = (currentTime - previousTime) / 1000;
    const distance = Vector.subtract(
      currentMousePosition,
      previousMouse.position
    );
    const velocity = Vector.divide(distance, timeDiff);

    this.mouse.position.set(currentMousePosition.x, currentMousePosition.y);
    this.mouse.velocity.set(velocity.x, velocity.y);
    this.time = currentTime;
  }

  handlePressEnd() {
    this.agents.forEach((agent) => {
      agent.isBeingDragged = false;
    });
  }

  unmount() {
    this.pressStartController.abort();
    this.pressMoveController.abort();
    this.pressEndController.abort();
    this.mouseOutController.abort();
  }
}

// export function useScene<T extends Element>(
//   icons: string[]
// ): [Scene | null, RefObject<T>] {
//   const [scene, setScene] = useState<Scene | null>(null)
//   const containerRef = useRef<T>(null)
//   const iconsRef = useRef(icons)

//   useEffect(() => {
//     const container = containerRef.current
//     if (!container) return

//     const { width, height } = container.getBoundingClientRect()
//     const canvas = new Canvas(width, height)
//     container.appendChild(canvas.el)
//     const scene = new Scene(canvas, iconsRef.current)
//     setScene(scene)

//     const resizeObserver = new ResizeObserver(
//       debounce(entries => {
//         for (let entry of entries) {
//           const { width, height } = entry.contentRect
//           canvas.init(width, height)
//           if (scene.agents.length === 0) {
//             scene.init()
//           } else {
//             scene.play()
//           }
//         }
//       }, 250)
//     )

//     resizeObserver.observe(container)

//     return () => {
//       container.innerHTML = ''
//       resizeObserver.disconnect()
//       scene.unmount()
//     }
//   }, [])

//   return [scene, containerRef]
// }
