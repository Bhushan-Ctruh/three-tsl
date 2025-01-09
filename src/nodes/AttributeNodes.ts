import { Output, schema, Node } from "../nodl-core";
import { z } from "zod";

import { uv } from "three/tsl";
import { of } from "rxjs";

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

export const AttributeNodes = {
  UV,
};
