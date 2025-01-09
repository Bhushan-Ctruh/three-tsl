import { Input, Output, schema, Node } from "../nodl-core";
import { z } from "zod";
import { vec2, vec3, vec4, float, int, uint, bool, color } from "three/tsl";
import { combineLatest, map } from "rxjs";

// const isNodeOfType = (nodeType: string) => (val: any) =>
//   val &&
//   typeof val.getSelf === "function" &&
//   val.getSelf().nodeType === nodeType;

export class Float extends Node {
  name = "Float";
  inputs = {
    a: new Input({
      name: "A",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
  };
  outputs = {
    value: new Output({
      name: "Value",
      type: schema(z.any()),
      observable: combineLatest([this.inputs.a]).pipe(
        map((inputs) => {
          return () => float(inputs[0]());
        })
      ),
    }),
  };
}

export class Int extends Node {
  name = "Int";
  inputs = {
    a: new Input({
      name: "A",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
  };
  outputs = {
    value: new Output({
      name: "Value",
      type: schema(z.any()),
      observable: combineLatest([this.inputs.a]).pipe(
        map((inputs) => {
          return () => int(inputs[0]());
        })
      ),
    }),
  };
}

export class Uint extends Node {
  name = "Uint";
  inputs = {
    a: new Input({
      name: "A",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
  };
  outputs = {
    value: new Output({
      name: "Value",
      type: schema(z.any()),
      observable: combineLatest([this.inputs.a]).pipe(
        map((inputs) => {
          return () => uint(inputs[0]());
        })
      ),
    }),
  };
}

const Vec2Schema = schema(z.any());
export class Vec2 extends Node {
  name = "Vec2";
  inputs = {
    a: new Input({ name: "A", type: Vec2Schema, defaultValue: () => 0 }),
    b: new Input({ name: "B", type: Vec2Schema, defaultValue: () => 0 }),
  };
  outputs = {
    value: new Output({
      name: "Value",
      type: Vec2Schema,
      observable: combineLatest([this.inputs.a, this.inputs.b]).pipe(
        map((inputs) => {
          //   const;
          return () => vec2(...inputs.map((i) => i()));
        })
      ),
    }),
  };
}

const Vec3Schema = schema(z.any());
export class Vec3 extends Node {
  name = "Vec3";
  inputs = {
    a: new Input({
      name: "A",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
    b: new Input({
      name: "B",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
    c: new Input({
      name: "C",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
  };
  outputs = {
    value: new Output({
      name: "Value",
      type: Vec3Schema,
      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => {
          return () => vec3(...inputs.map((i) => i()));
        })
      ),
    }),
  };
}

const Vec4Schema = schema(z.any());
export class Vec4 extends Node {
  name = "Vec4";
  inputs = {
    a: new Input({
      name: "A",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
    b: new Input({
      name: "B",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
    c: new Input({
      name: "C",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
    d: new Input({
      name: "D",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
  };
  outputs = {
    value: new Output({
      name: "Value",
      type: Vec4Schema,
      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => {
          return () => vec4(...inputs.map((i) => i()));
        })
      ),
    }),
  };
}

export class SplitVec2 extends Node {
  name = "Split Vec2";
  inputs = {
    a: new Input({
      name: "A",
      type: schema(z.any()),
      defaultValue: () => vec2(1, 0),
    }),
  };
  outputs = {
    x: new Output({
      name: "X",
      type: schema(z.any()),
      observable: combineLatest([this.inputs.a]).pipe(
        map((inputs) => () => inputs[0]().x)
      ),
    }),
    y: new Output({
      name: "Y",
      type: schema(z.any()),
      observable: combineLatest([this.inputs.a]).pipe(
        map((inputs) => () => inputs[0]().y)
      ),
    }),
  };
}

export class SplitVec3 extends Node {
  name = "Split Vec3";
  inputs = {
    a: new Input({
      name: "A",
      // type: schema(z.function().returns())),
      type: schema(z.any()),
      defaultValue: () => vec3(1, 0, 1),
    }),
  };
  outputs = {
    x: new Output({
      name: "X",
      type: schema(z.any()),
      observable: combineLatest([this.inputs.a]).pipe(
        map((inputs) => () => inputs[0]().x)
      ),
    }),
    y: new Output({
      name: "Y",
      type: schema(z.any()),
      observable: combineLatest([this.inputs.a]).pipe(
        map((inputs) => () => inputs[0]().y)
      ),
    }),
    z: new Output({
      name: "Z",
      type: schema(z.any()),
      observable: combineLatest([this.inputs.a]).pipe(
        map((inputs) => () => inputs[0]().z)
      ),
    }),
  };
}

export class SplitVec4 extends Node {
  name = "Split Vec4";
  inputs = {
    a: new Input({
      name: "A",
      type: schema(z.any()),
      defaultValue: () => vec4(1, 0, 1, 1),
    }),
  };
  outputs = {
    x: new Output({
      name: "X",
      type: schema(z.any()),
      observable: combineLatest([this.inputs.a]).pipe(
        map((inputs) => () => inputs[0]().x)
      ),
    }),
    y: new Output({
      name: "Y",
      type: schema(z.any()),
      observable: combineLatest([this.inputs.a]).pipe(
        map((inputs) => () => inputs[0]().y)
      ),
    }),
    z: new Output({
      name: "Z",
      type: schema(z.any()),
      observable: combineLatest([this.inputs.a]).pipe(
        map((inputs) => () => inputs[0]().z)
      ),
    }),
    w: new Output({
      name: "W",
      type: schema(z.any()),
      observable: combineLatest([this.inputs.a]).pipe(
        map((inputs) => () => inputs[0]().w)
      ),
    }),
  };
}

export const ConstantNodes = {
  Float,
  Vec2,
  Vec3,
  Vec4,
  SplitVec2,
  SplitVec3,
  SplitVec4,
  Int,
  Uint,
};
