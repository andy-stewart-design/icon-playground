export function setup() {
  const canvas = document.querySelector("#canvas");
  const isCanvas = canvas instanceof HTMLCanvasElement;
  if (!canvas || !isCanvas) throw new Error("Canvas not found");

  const ctx = canvas.getContext("2d")!;
  const scale = window.devicePixelRatio;
  const cX = canvas.width;
  const cY = canvas.height;
  canvas.style.width = cX + "px";
  canvas.style.height = cY + "px";
  canvas.width = cX * scale;
  canvas.height = cY * scale;
  ctx.scale(scale, scale);

  return { canvas, ctx };
}

class Canvas {
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor() {
    this.el = document.createElement("canvas");
    const context = this.el.getContext("2d");
    if (!context) throw new Error("Could not create context");
    this.ctx = context;

    const scale = window.devicePixelRatio;
    const cW = this.el.width > 640 ? this.el.width : 640;
    const cH = this.el.height > 480 ? this.el.height : 480;

    this.el.style.width = cW + "px";
    this.el.style.height = cH + "px";
    this.el.width = cW * scale;
    this.el.height = cH * scale;
    this.el.tabIndex = 0;
    this.ctx.scale(scale, scale);
  }

  toCanvasY(y: number) {
    return this.height - y;
  }

  clear() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  get center() {
    return {
      x: this.el.clientWidth / 2,
      y: this.el.clientHeight / 2,
    };
  }

  get width() {
    return this.el.clientWidth;
  }

  get height() {
    return this.el.clientHeight;
  }

  get posX() {
    return this.el.getBoundingClientRect().left;
  }

  get posY() {
    return this.el.getBoundingClientRect().top;
  }
}

const canvas = new Canvas();
const app = document.querySelector("#app");
if (!app) throw new Error("App not found");
app.appendChild(canvas.el);

export default canvas;
