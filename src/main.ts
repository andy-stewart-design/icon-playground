import Scene from "./lib/scene";
import Canvas from "./lib/canvas";
import { ICONS } from "./lib/svg";
import debounce from "just-debounce-it";
import "./style.css";

const app = document.querySelector("#app");
if (!app) throw new Error("App not found");
const { width, height } = app.getBoundingClientRect();
const canvas = new Canvas(width, height);
app.appendChild(canvas.el);
const scene = new Scene(canvas, ICONS);

const resizeObserver = new ResizeObserver(
  debounce((entries: any) => {
    for (let entry of entries) {
      const { width, height } = entry.contentRect;
      console.log({ width, height });

      canvas.init(width, height);
      if (scene.agents.length === 0) {
        scene.init();
      } else {
        scene.play();
      }
    }
  }, 250)
);

resizeObserver.observe(app);

scene.init();
