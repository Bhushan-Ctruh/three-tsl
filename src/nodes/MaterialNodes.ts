import { Input, Output, schema, Node } from "../nodl-core";
import { z } from "zod";

import { vec4, Fn } from "three/tsl";
import { combineLatest, map } from "rxjs";

const BaseColorSchema = schema(z.any());
export class MeshStandardMaterialNode extends Node {
  name = "Mesh Standard Material";
  inputs = {
    a: new Input({
      name: "Base Color",
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
          return Fn(() => inputs[0]());
        })
      ),
    }),
  };
}
