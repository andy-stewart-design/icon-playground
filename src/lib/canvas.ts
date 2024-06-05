import Vector from "./vector";

class Canvas {
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(width = 640, height = 480) {
    this.el = document.createElement("canvas");
    const context = this.el.getContext("2d");
    if (!context) throw new Error("Could not create context");
    this.ctx = context;
    this.init(width, height);
  }

  init(width: number, height: number) {
    const scale = window.devicePixelRatio;
    const cW = width;
    const cH = height;

    this.el.style.display = "block";
    this.el.style.width = cW + "px";
    this.el.style.height = cH + "px";
    this.el.width = cW * scale;
    this.el.height = cH * scale;
    this.ctx.scale(scale, scale);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
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

  get position() {
    const x = this.el.getBoundingClientRect().left;
    const y = this.el.getBoundingClientRect().top;
    return new Vector(x, y);
  }
}

export default Canvas;
