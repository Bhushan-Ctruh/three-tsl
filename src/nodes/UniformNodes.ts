import { Output, schema, Node, Input } from "../nodl-core";
import { z } from "zod";
import { TextureLoader, Vector2, Vector3 } from "three";
import { uniform, time, texture, uv } from "three/tsl";
import { BehaviorSubject, combineLatest, map, of, switchMap } from "rxjs";

export class Vec2Uniform extends Node {
  name = "Vec2Uniform";
  inputs = {};
  public _value = new Vector2();
  outputs = {
    value: new Output({
      name: "Value",
      type: schema(z.any()),
      observable: of(() => uniform(this._value)),
    }),
  };
}

export class Vec3Uniform extends Node {
  name = "Vec3Uniform";
  inputs = {};
  public _value = new Vector3();
  outputs = {
    value: new Output({
      name: "Value",
      type: schema(z.any()),
      observable: of(() => uniform(this._value)),
    }),
  };
}

export class FloatUniform extends Node {
  name = "FloatUniform";
  inputs = {};
  public _value = uniform(0);
  outputs = {
    value: new Output({
      name: "Value",
      type: schema(z.any()),
      observable: of(() => this._value),
    }),
  };
}

export class TimeUniform extends Node {
  name = "TimeUniform";
  inputs = {};
  outputs = {
    value: new Output({
      name: "Value",
      type: schema(z.any()),
      observable: of(() => time),
    }),
  };
}

const textureLoader = new TextureLoader();

export class TextureUniform extends Node {
  name = "Texture";
  inputs = {
    uvs: new Input({
      name: "UVs",
      type: schema(z.any()),
      defaultValue: uv,
    }),
  };

  private _value = new BehaviorSubject<string>("/uv_grid.jpg");

  public value = this._value.asObservable();

  outputs = {
    value: new Output({
      name: "Value",
      type: schema(z.any()),

      observable: combineLatest([this._value, this.inputs.uvs]).pipe(
        map(
          (inputs) => () => texture(textureLoader.load(inputs[0]), inputs[1]())
        )
      ),
      //   observable: this._value.pipe(
      //     switchMap((newValue) => {
      //       return of(() => texture(textureLoader.load(newValue), uv()));
      //     })
      //   ),
    }),
  };

  setTexture(texture: string) {
    this._value.next(texture);
  }
}

export const UniformNodes = {
  Vec2Uniform,
  Vec3Uniform,
  FloatUniform,
  TimeUniform,
  TextureUniform,
};
