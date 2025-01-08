import { Input, Output, schema, Node } from "../nodl-core";
import { z } from "zod";

import { uv, add, vec2, vec3, vec4, cos, Fn } from "three/tsl";
import { combineLatest, map, of } from "rxjs";

const UVSchema = schema(z.any());

export class UV extends Node {
  name = "UV";
  inputs = {};
  outputs = {
    value: new Output({
      name: "Value",
      type: UVSchema,
      observable: of(uv),
    }),
  };
}

const Vec2Schema = schema(z.any());
export class Vec2 extends Node {
  name = "Vec2";
  inputs = {
    a: new Input({ name: "A", type: schema(z.number()), defaultValue: 10 }),
    b: new Input({ name: "B", type: schema(z.number()), defaultValue: 11 }),
  };
  outputs = {
    value: new Output({
      name: "Value",
      type: Vec2Schema,
      observable: combineLatest([this.inputs.a, this.inputs.b]).pipe(
        map((inputs) => () => vec2(inputs[0], inputs[1]))
      ),
    }),
  };

  // addInputPort = () => {
  //   const inputIndex = Object.keys(this.inputs).length;
  //   this.inputs[`input${inputIndex}`] = new Input({
  //     name: `Input${inputIndex}`,
  //     type: schema(z.number()),
  //     defaultValue: 0,
  //   });
  //   this.onUpdate();
  // };

  // onUpdate = () => {
  //   console.log("onUpdate");
  // };

  // addOnUpdate = (fn: () => void) => {
  //   this.onUpdate = fn;
  // };
}

const Vec3Schema = schema(z.any());
export class Vec3 extends Node {
  name = "Vec3";
  inputs = {
    a: new Input({ name: "A", type: schema(z.number()), defaultValue: 0 }),
    b: new Input({ name: "B", type: schema(z.number()), defaultValue: 0 }),
    c: new Input({ name: "C", type: schema(z.number()), defaultValue: 0 }),
  };
  outputs = {
    value: new Output({
      name: "Value",
      type: Vec3Schema,
      observable: combineLatest([
        this.inputs.a,
        this.inputs.b,
        this.inputs.c,
      ]).pipe(map((inputs) => () => vec3(inputs[0], inputs[1], inputs[2]))),
    }),
  };
  // addInputPort = () => {
  //   const inputIndex = Object.keys(this.inputs).length;
  //   this.inputs[`input${inputIndex}`] = new Input({
  //     name: `Input${inputIndex}`,
  //     type: schema(z.number()),
  //     defaultValue: 0,
  //   });
  //   this.onUpdate();
  // };

  // onUpdate = () => {
  //   console.log("onUpdate");
  // };

  // addOnUpdate = (fn: () => void) => {
  //   this.onUpdate = fn;
  // };
}

const Vec4Schema = schema(z.any());
export class Vec4 extends Node {
  name = "Vec4";
  inputs = {
    a: new Input({
      name: "A",
      type: schema(z.any()),
      defaultValue: () => vec3(1, 0, 1),
    }),
    b: new Input({ name: "B", type: schema(z.any()), defaultValue: () => 1 }),
  };
  outputs = {
    value: new Output({
      name: "Value",
      type: Vec4Schema,
      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => () => vec4(...inputs.map((i) => i())))
      ),
    }),
  };
}

const BaseColorSchema = schema(z.any());
export class BaseColorNode extends Node {
  name = "Base Color";
  inputs = {
    a: new Input({
      name: "A",
      type: schema(z.any()),
      defaultValue: () => vec4(1, 0, 0, 1),
    }),
  };
  outputs = {
    value: new Output({
      name: "Value",
      type: BaseColorSchema,
      observable: combineLatest([this.inputs.a]).pipe(
        map((inputs) => {
          console.log(inputs, "INPUTS");

          return Fn(() => inputs[0]());
        })
      ),
    }),
  };
}

//Nodes for three tsl operators
const AddInputSchema = schema(z.any());

export class Add extends Node {
  name = "Add";
  inputs = {
    a: new Input({
      name: "Value",
      type: AddInputSchema,
      defaultValue: () => vec2(0, 0),
    }),
    b: new Input({
      name: "Value2",
      type: AddInputSchema,
      defaultValue: () => vec2(0, 0),
    }),
  };

  outputs = {
    output: new Output({
      name: "Output",
      type: AddInputSchema,
      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => {
          return () => add(...inputs.map((i) => i()));
        })
      ),
    }),
  };

  addInputPort = () => {
    const inputIndex = Object.keys(this.inputs).length;
    this.inputs = {
      ...this.inputs,
      [`input${inputIndex}`]: new Input({
        name: `Input${inputIndex}`,
        type: schema(z.any()),
        defaultValue: () => vec2(0, 0),
      }),
    };

    const inputs = Object.values(this.inputs);
    const newObservable = combineLatest(inputs).pipe(
      map((inputs) => {
        return () => add(...inputs.map((i) => i()));
      })
    );

    this.outputs.output.updateObservable(newObservable);

    this.onUpdate();
  };

  onUpdate = () => {
    console.log("onUpdate");
  };

  addOnUpdate = (fn: () => void) => {
    this.onUpdate = fn;
  };
}

const MulInputSchema = schema(z.any());
export class Mul extends Node {
  name = "Mul";
  inputs = {
    a: new Input({
      name: "Value",
      type: MulInputSchema,
      defaultValue: () => vec2(0, 0),
    }),
    b: new Input({
      name: "Value2",
      type: MulInputSchema,
      defaultValue: () => vec2(0, 0),
    }),
  };

  outputs = {
    output: new Output({
      name: "Output",
      type: MulInputSchema,
      observable: combineLatest([this.inputs.a, this.inputs.b]).pipe(
        map((inputs) => {
          return () => add(inputs[0](), inputs[1]());
        })
      ),
    }),
  };
}

const CosInputSchema = schema(z.any());
export class Cos extends Node {
  name = "Cos";
  inputs = {
    a: new Input({
      name: "Value",
      type: CosInputSchema,
      defaultValue: () => vec2(0, 0),
    }),
  };

  outputs = {
    output: new Output({
      name: "Output",
      type: CosInputSchema,
      observable: combineLatest([this.inputs.a]).pipe(
        map((inputs) => {
          return () => cos(inputs[0]());
        })
      ),
    }),
  };
}

// cos
