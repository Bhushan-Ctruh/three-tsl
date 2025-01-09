import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import { Experience } from "./components/Experience";
import { Node } from "./nodl-core";
import { BaseColorNode, Cos, Mul, UV } from "./nodes/UVNode";
import { Circuit, CircuitStore } from "./nodl-react";
import { Pane } from "tweakpane";
import {
  Float,
  Vec2,
  Vec3,
  Vec4,
  ConstantNodes,
  Int,
  Uint,
} from "./nodes/ConstantNodes";
import { toCartesianPoint } from "./nodl-react/utils/coordinates/coordinates";
import { Subscription } from "rxjs";
import { Add, MathNodes } from "./nodes/MathNodes";
import { AttributeNodes } from "./nodes/AttributeNodes";
import {
  FloatUniform,
  TextureUniform,
  UniformNodes,
  Vec2Uniform,
  Vec3Uniform,
} from "./nodes/UniformNodes";
console.log(Add);

export let currentScale = 1;

// const a = new Vec3();

// const b = new Vec3();
// const c = new Vec3();
// const d = new Vec3();
// const e = new Vec4();
// const f = new Vec4();
// const g = new Vec2();
// const h = new Vec2();

// const i = new Float();

// const uvNode = new UV();

// const add = new Add();

// const split = new SplitVec3();

// setTimeout(() => {
// ab.addInputPort();
//   alert("Added");
// }, 1000);
// const td = new Add();
// const ctd = new Mul();
// const cosctd = new Cos();
// const palette = new Add();
// const finalColor = new Vec4();

const baseColor = new BaseColorNode();

// a.inputs.a.next(0.5);
// a.inputs.b.next(0.5);
// a.inputs.c.next(0.5);

// b.inputs.a.next(0.5);
// b.inputs.b.next(0.5);
// b.inputs.c.next(0.5);

// c.inputs.a.next(1);
// c.inputs.b.next(1);
// c.inputs.c.next(1);

// d.inputs.a.next(0.263);
// d.inputs.b.next(0.416);
// d.inputs.c.next(0.557);

// a.outputs.value.connect(ab.inputs.a);
// b.outputs.value.connect(ab.inputs.b);

// uvNode.outputs.value.connect(td.inputs.a);
// d.outputs.value.connect(td.inputs.b);

// c.outputs.value.connect(ctd.inputs.a);
// td.outputs.output.connect(ctd.inputs.b);

// ctd.outputs.output.connect(cosctd.inputs.a);

// ab.outputs.output.connect(palette.inputs.a);
// cosctd.outputs.output.connect(palette.inputs.b);

// palette.outputs.output.connect(finalColor.inputs.a);

// finalColor.outputs.value.connect(baseColor.inputs.a);

const store = new CircuitStore();

const useNodeWindowResolver = () => {
  return useCallback((node: Node) => {
    if (
      node instanceof Vec3 ||
      node instanceof Vec4 ||
      node instanceof Vec2 ||
      node instanceof Float ||
      node instanceof Int ||
      node instanceof Uint
    ) {
      return <VecUI node={node} />;
    } else if (node instanceof BaseColorNode) {
      return <BaseColorUI node={node} />;
    } else if (
      node instanceof Vec2Uniform ||
      node instanceof Vec3Uniform ||
      node instanceof FloatUniform
    ) {
      return <UniformUI node={node} />;
    } else if (node instanceof TextureUniform) {
      return <TextureUniformUI node={node} />;
    }
  }, []);
};

const VecUI = ({ node }: { node: Vec3 | Vec4 | Vec2 | Float | Int | Uint }) => {
  const pane = useRef<Pane>();

  useEffect(() => {
    if (!ref.current) return;

    const inputPortKeys = Object.keys(node.inputs);

    const initValues = inputPortKeys.reduce((acc, key) => {
      acc[key] = node.inputs[key].value();
      return acc;
    }, {});

    pane.current = new Pane({ container: ref.current, expanded: true });

    const subs: Subscription[] = [];

    Object.keys(initValues).forEach((key) => {
      const binding = pane.current
        ?.addBinding(initValues, key)
        .on("change", (e) => {
          if (node.inputs[key]?.connected) return;
          node.inputs[key]?.next(() => e.value);
        });
      const sub = node.inputs[key].subscribe(() => {
        if (!node.inputs[key]?.connected) {
          binding!.disabled = false;
          return;
        }
        binding!.disabled = true;
        initValues[key] = 0;
        binding?.refresh();
      });
      subs.push(sub);
    });

    return () => {
      pane.current?.dispose();
      subs.forEach((sub) => sub.unsubscribe());
    };
  }, []);

  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      style={{
        color: "var(--text-neutral-color)",
        backgroundColor: "var(--node-background)",
        borderBottom: "2px solid var(--border-color)",
        padding: "14px 12px 12px",
      }}
    />
  );
};

const UniformUI = ({
  node,
}: {
  node: Vec2Uniform | Vec3Uniform | FloatUniform;
}) => {
  const pane = useRef<Pane>();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const initialInputs =
      node instanceof Vec2Uniform
        ? {
            x: 0,
            y: 0,
          }
        : node instanceof Vec3Uniform
        ? {
            x: 0,
            y: 0,
            z: 0,
          }
        : { x: 0 };

    pane.current = new Pane({ container: ref.current, expanded: true });

    Object.keys(initialInputs).forEach((key) => {
      const binding = pane.current
        ?.addBinding(initialInputs, key)
        .on("change", (e) => {
          if (node instanceof FloatUniform) {
            node._value.value = e.value || 0;
          } else {
            node._value[key] = e.value || 0;
          }
        });
    });

    return () => {
      pane.current?.dispose();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        color: "var(--text-neutral-color)",
        backgroundColor: "var(--node-background)",
        borderBottom: "2px solid var(--border-color)",
        padding: "14px 12px 12px",
      }}
    />
  );
};

const TextureUniformUI = ({ node }: { node: TextureUniform }) => {
  const [texture, setTexture] = useState<string>("/uv_grid.jpg");

  useEffect(() => {
    const sub = node.value.subscribe((value) => {
      setTexture(value);
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      // ref={ref}
      style={{
        color: "var(--text-neutral-color)",
        backgroundColor: "var(--node-background)",
        borderBottom: "2px solid var(--border-color)",
        padding: "14px 12px 12px",
        // display: "flex",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "10px 16px",
          backgroundColor: "var(--node-background)",
          borderRadius: "12px",
          cursor: "pointer",
        }}
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        Upload Image
      </div>
      <img
        style={{
          display: "flex",
          width: "100%",
        }}
        src={texture}
      ></img>
      <input
        ref={inputRef}
        type="file"
        style={{
          display: "none",
        }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const blobUrl = URL.createObjectURL(file);
          node.setTexture(blobUrl as string);
        }}
      />
    </div>
  );
};

const BaseColorUI = ({ node }: { node: BaseColorNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const experienceRef = useRef<Experience | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const boundBox = canvasRef.current.getBoundingClientRect();

    experienceRef.current = new Experience(canvasRef.current, {
      width: boundBox.width,
      height: boundBox.height,
    });
  }, []);

  useEffect(() => {
    const sub3 = node.outputs.value.subscribe((value) => {
      console.log(value, "BASE COLOR");

      experienceRef.current?.defaultBox(value);
    });

    return () => {
      sub3.unsubscribe();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "300px",
        backgroundColor: "var(--node-background)",
      }}
    />
  );
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};
function App() {
  const nodeWindowResolver = useNodeWindowResolver();

  useLayoutEffect(() => {
    store.setNodes([
      // [a, { x: 0, y: 450 }],
      // [split, { x: 300, y: 450 }],
      // [b, { x: 0, y: 150 }],
      // [c, { x: 0, y: -150 }],
      // [d, { x: 0, y: -450 }],
      // [e, { x: 0, y: -750 }],
      // [f, { x: 300, y: -750 }],
      // [add, { x: 300, y: 300 }],
      // [g, { x: 500, y: -650 }],
      // [h, { x: 500, y: -300 }],
      // [i, { x: 800, y: -350 }],
      // // [uvNode, { x: 0, y: -750 }],
      // // [ab, { x: 300, y: 300 }],
      // // [td, { x: 300, y: -650 }],
      // // [ctd, { x: 600, y: -300 }],
      // // [cosctd, { x: 900, y: -300 }],
      // // [palette, { x: 1200, y: 300 }],
      // // [finalColor, { x: 1500, y: 600 }],
      // [new Float(), { x: 115, y: 149 }],
      [baseColor, { x: 500, y: 0 }],
    ]);

    return () => {
      store.dispose();
    };
  }, []);

  useEffect(() => {
    const nodeCanvas = document.getElementsByClassName("canvas")[0];

    if (!nodeCanvas) return;
    const nodeCanvasEle = nodeCanvas as HTMLDivElement;

    let currentTranslate = { x: 0, y: 0 };
    let panning = false;

    nodeCanvasEle.style.transformOrigin = "center";
    nodeCanvasEle.style.transform = `scale(${currentScale}) translate(${currentTranslate.x}px, ${currentTranslate.y}px)`;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const direction = Math.sign(e.deltaY);
      const zoom = 0.01;
      currentScale -= zoom * direction;
      currentScale = clamp(currentScale, 0.1, 5);
      nodeCanvasEle.style.transformOrigin = "center";
      nodeCanvasEle.style.transform = `scale(${currentScale}) translate(${currentTranslate.x}px, ${currentTranslate.y}px)`;
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 2) {
        e.preventDefault();
        e.stopPropagation();
        panning = true;
        nodeCanvasEle.style.cursor = "grabbing";
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 2) {
        e.preventDefault();
        e.stopPropagation();
        panning = false;
        nodeCanvasEle.style.cursor = "default";
      }
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.button === 2) {
        panning = false;
        nodeCanvasEle.style.cursor = "default";
      }
    };

    const onBlur = () => {
      panning = false;
      nodeCanvasEle.style.cursor = "default";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (panning) {
        e.preventDefault();
        e.stopPropagation();
        const deltaX = e.movementX;
        const deltaY = e.movementY;
        currentTranslate.x += deltaX;
        currentTranslate.y += deltaY;
        nodeCanvasEle.style.transform = `scale(${currentScale}) translate(${currentTranslate.x}px, ${currentTranslate.y}px)`;
      }
    };

    nodeCanvasEle.addEventListener("wheel", onWheel);
    nodeCanvasEle.addEventListener("contextmenu", onContextMenu);
    nodeCanvasEle.addEventListener("mousedown", onMouseDown);

    nodeCanvasEle.addEventListener("mouseup", onMouseUp);
    nodeCanvasEle.addEventListener("mouseleave", onMouseLeave);

    nodeCanvasEle.addEventListener("blur", onBlur);

    nodeCanvasEle.addEventListener("mousemove", onMouseMove);

    return () => {
      nodeCanvasEle.removeEventListener("wheel", onWheel);
      nodeCanvasEle.removeEventListener("contextmenu", onContextMenu);
      nodeCanvasEle.removeEventListener("mousedown", onMouseDown);
      nodeCanvasEle.removeEventListener("mouseup", onMouseUp);
      nodeCanvasEle.removeEventListener("mouseleave", onMouseLeave);
      nodeCanvasEle.removeEventListener("blur", onBlur);
      nodeCanvasEle.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const circuitContainer = useRef<HTMLDivElement>(null);

  const [containerBound, setContainerBound] = useState<DOMRect>();

  useEffect(() => {
    if (!circuitContainer.current) return;
    const container = circuitContainer.current;
    const rect = container.getBoundingClientRect();
    setContainerBound(rect);
  }, []);

  return (
    <>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          position: "relative",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <div
          style={{
            height: "100vh",
            width: "200px",
            position: "absolute",
            zIndex: 1000,
            left: 0,
            top: 0,
            background: "white",
            border: "1px solid red",
          }}
        >
          {/* drag and droppable Nodes */}
          <h1>Constants</h1>
          {Object.keys(ConstantNodes).map((nodeName) => {
            return (
              <div
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    "text/plain",
                    `${nodeName}-ConstantNodes`
                  );
                }}
              >
                <div>{nodeName}</div>
              </div>
            );
          })}
          <h1>Math</h1>
          {Object.keys(MathNodes).map((nodeName) => {
            return (
              <div
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", `${nodeName}-MathNodes`);
                }}
              >
                <div>{nodeName}</div>
              </div>
            );
          })}
          <h1>Attributes</h1>
          {Object.keys(AttributeNodes).map((nodeName) => {
            return (
              <div
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    "text/plain",
                    `${nodeName}-AttributeNodes`
                  );
                }}
              >
                <div>{nodeName}</div>
              </div>
            );
          })}
          {Object.keys(UniformNodes).map((nodeName) => {
            return (
              <div
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    "text/plain",
                    `${nodeName}-UniformNodes`
                  );
                }}
              >
                <div>{nodeName}</div>
              </div>
            );
          })}
        </div>

        <div
          ref={circuitContainer}
          style={{
            height: "100vh",
            width: "100vw",
            position: "relative",
            display: "block",
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (!containerBound) return;

            const pools = {
              ConstantNodes,
              MathNodes,
              AttributeNodes,
              UniformNodes,
            };

            const [name, poolName] = e.dataTransfer
              .getData("text/plain")
              .split("-");
            // const container = circuitContainer.current;
            const boundingRect = containerBound;

            const x = e.clientX - boundingRect.left;
            const y = e.clientY - boundingRect.top;
            const pool = pools[poolName];
            if (!pool) return;
            const node = pool[name];
            if (!node) return;
            const nodeInstance = new node();
            console.log(currentScale);

            store.setNodes([
              [
                nodeInstance,
                toCartesianPoint(boundingRect.width, boundingRect.height, x, y),
              ],
            ]);
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        >
          <Circuit
            className={"circuit"}
            store={store}
            nodeWindowResolver={nodeWindowResolver}
          />
        </div>
      </div>
    </>
  );
}

export default App;
