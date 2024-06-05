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
    this.ctx.clearRect(0, 0, this.el.width, this.el.height);
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
    return {
      x: this.el.getBoundingClientRect().left,
      y: this.el.getBoundingClientRect().top,
    };
  }
}

export default Canvas;
