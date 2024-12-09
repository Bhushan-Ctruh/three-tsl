import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import { Experience } from "./components/Experience";
import { Node, Input, Output, schema } from "@nodl/core";
import { Circuit, CircuitStore } from "@nodl/react";
import { combineLatest, map } from "rxjs";
import { z } from "zod";
import { UV } from "./nodes/UVNode";
import { AttributeNode, ShaderNodeObject } from "three/webgpu";

/** Declare a zod schema for value validation */
const NumberSchema = schema(z.number());

class NumberInput extends Node {
  inputs = {
    value: new Input({ name: "Value", type: NumberSchema, defaultValue: 0 }),
  };
  outputs = {
    value: new Output({
      name: "Value",
      type: NumberSchema,
      observable: this.inputs.value,
    }),
  };
}

class NumberDisplay extends Node {
  inputs = {
    value: new Input({ name: "Value", type: NumberSchema, defaultValue: 0 }),
  };
  outputs = {
    value: new Output({
      name: "Value",
      type: NumberSchema,
      observable: this.inputs.value,
    }),
  };
}

class Addition extends Node {
  inputs = {
    a: new Input({ name: "A", type: NumberSchema, defaultValue: 0 }),
    b: new Input({ name: "B", type: NumberSchema, defaultValue: 0 }),
  };

  outputs = {
    output: new Output({
      name: "Output",

      type: NumberSchema,
      observable: combineLatest([this.inputs.a, this.inputs.b]).pipe(
        map((inputs) => inputs.reduce((sum, value) => sum + value), 0)
      ),
    }),
  };
}

/** Declare 3 addition nodes */
const additionNode1 = new NumberInput();
const additionNode2 = new NumberInput();
const additionNode3 = new Addition();
const numberDisplayNode = new NumberDisplay();
const uvNode = new UV();

/** Connect them together */
additionNode1.outputs.value.connect(additionNode3.inputs.a);
additionNode2.outputs.value.connect(additionNode3.inputs.b);

additionNode3.outputs.output.connect(numberDisplayNode.inputs.value);

const store = new CircuitStore();

const useNodeWindowResolver = () => {
  return useCallback((node: Node) => {
    if (node instanceof NumberInput) {
      return <NumberInputUI observable={node.inputs.value} />;
    } else if (node instanceof NumberDisplay) {
      return <NumberDisplayUI observable={node.inputs.value} />;
    } else if (node instanceof UV) {
      return <UVUI output={node.outputs.value} />;
    }
  }, []);
};

const NumberInputUI = ({ observable }: { observable: Input<number> }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const sub = observable.subscribe((value) => {
      setValue(value);
    });

    return () => {
      sub.unsubscribe();
    };
  }, [observable]);

  return (
    <>
      <div
        style={{
          color: "white",
        }}
      >
        <label>Value : {value}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => {
            observable.next(Number(e.target.value));
          }}
        />
      </div>
    </>
  );
};

const NumberDisplayUI = ({ observable }: { observable: Input<number> }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const sub = observable.subscribe((value) => {
      setValue(value);
    });

    return () => {
      sub.unsubscribe();
    };
  }, [observable]);

  return (
    <div
      style={{
        color: "white",
      }}
    >
      <h1>value: {value}</h1>
    </div>
  );
};

const UVUI = ({
  output,
}: {
  output: Output<() => ShaderNodeObject<AttributeNode>>;
}) => {
  useEffect(() => {
    const sub = output.subscribe((value) => {
      console.log(value, "UV");
    });
    return () => {
      sub.unsubscribe();
    };
  }, [output]);
  return null;
};

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const nodeWindowResolver = useNodeWindowResolver();

  useLayoutEffect(() => {
    if (!canvasRef.current) return;

    store.setNodes([
      [additionNode1, { x: -220, y: 100 }],
      [additionNode2, { x: -220, y: -100 }],
      [additionNode3, { x: 220, y: 0 }],
      [numberDisplayNode, { x: 500, y: 0 }],
      [uvNode, { x: 500, y: -200 }],
    ]);

    new Experience(canvasRef.current);

    return () => {
      store.dispose();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          width: "100vw",
          height: "100vh",
          display: "block",
          border: "2px solid yellowgreen",
        }}
      />
      <div
        style={{
          height: "50vh",
          width: "100vw",
          position: "relative",
          display: "block",
          border: "2px solid red",
        }}
      >
        <Circuit
          ref={(ref) => {
            if (!ref) return;
          }}
          nodeWindowResolver={nodeWindowResolver}
          store={store}
        />
      </div>
    </>
  );
}

export default App;
