import { action, computed, makeObservable, observable } from "mobx";
import { v4 as uuid } from "uuid";

import { NodeData } from "./Node.types";
import { Connection } from "../Connection/Connection";
import { Input } from "../Input/Input";
import { Output } from "../Output/Output";

export abstract class Node<TData extends NodeData = NodeData> {
  /** Identifier */
  public id: string = uuid();
  /** Node Name */
  public name: string = this.constructor.name;
  /** Node Inputs */
  public abstract inputs: Record<string, Input>;
  /** Node Outputs */
  public abstract outputs: Record<string, Output>;

  public localName: null | string = null;

  public abstract code(args: string[]): {
    code: string;
    dependencies: string[];
  };
  /** Arbitrary Data Store */
  public data: TData = {} as TData;

  constructor() {
    this.makeObservable();
  }

  public makeObservable = () => {
    makeObservable(this, {
      id: observable,
      data: observable,
      connections: computed,
      dispose: action,
    });
  };

  /** Associated connections */
  public get connections() {
    const res = [...Object.values(this.inputs), ...Object.values(this.outputs)]
      .flatMap((port) =>
        "connection" in port ? [port.connection] : port.connections
      )
      .filter((connection): connection is Connection<unknown> =>
        Boolean(connection)
      );

    return res;
  }

  /** Disposes the Node */
  public dispose(): void {
    for (const input of Object.values(this.inputs)) {
      input.dispose();
    }

    for (const output of Object.values(this.outputs)) {
      output.dispose();
    }
  }
}
