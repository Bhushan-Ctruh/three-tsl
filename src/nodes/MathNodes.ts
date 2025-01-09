import { Input, Output, schema, Node } from "../nodl-core";
import { z } from "zod";
import {
  add,
  mul,
  sub,
  div,
  mod,
  modInt,
  equal,
  lessThan,
  greaterThan,
  lessThanEqual,
  greaterThanEqual,
  abs,
  vec2,
  acos,
  asin,
  atan,
  atan2,
  clamp,
  ceil,
  cos,
  cross,
  degrees,
  distance,
  dot,
  floor,
  fract,
  length,
  log,
} from "three/tsl";
import { combineLatest, map } from "rxjs";
// const a = abs(vec2(1, 2), vec2(1, 2), vec2(1, 2), vec2(1, 1));
// console.log(a.getSelf());

// abs( x )	Return the absolute value of the parameter.
// acos( x )	Return the arccosine of the parameter.
// all( x )	Return true if all components of x are true.
// any( x )	Return true if any component of x is true.
// asin( x )	Return the arcsine of the parameter.
// atan( y, x )	Return the arc-tangent of the parameters.
// bitcast( x, y )	Reinterpret the bits of a value as a different type.
// cbrt( x )	Return the cube root of the parameter.
// ceil( x )	Find the nearest integer that is greater than or equal to the parameter.
// clamp( x, min, max )	Constrain a value to lie between two further values.
// cos( x )	Return the cosine of the parameter.
// cross( x, y )	Calculate the cross product of two vectors.
// dFdx( p )	Return the partial derivative of an argument with respect to x.
// dFdy( p )	Return the partial derivative of an argument with respect to y.
// degrees( radians )	Convert a quantity in radians to degrees.
// difference( x, y )	Calculate the absolute difference between two values.
// distance( x, y )	Calculate the distance between two points.
// dot( x, y )	Calculate the dot product of two vectors.
// equals( x, y )	Return true if x equals y.
// exp( x )	Return the natural exponentiation of the parameter.
// exp2( x )	Return 2 raised to the power of the parameter.
// faceforward( N, I, Nref )	Return a vector pointing in the same direction as another.
// floor( x )	Find the nearest integer less than or equal to the parameter.
// fract( x )	Compute the fractional part of the argument.
// fwidth( x )	Return the sum of the absolute derivatives in x and y.
// inverseSqrt( x )	Return the inverse of the square root of the parameter.
// invert( x )	Invert an alpha parameter ( 1. - x ).
// length( x )	Calculate the length of a vector.
// lengthSq( x )	Calculate the squared length of a vector.
// log( x )	Return the natural logarithm of the parameter.
// log2( x )	Return the base 2 logarithm of the parameter.
// max( x, y )	Return the greater of two values.
// min( x, y )	Return the lesser of two values.
// mix( x, y, a )	Linearly interpolate between two values.
// negate( x )	Negate the value of the parameter ( -x ).
// normalize( x )	Calculate the unit vector in the same direction as the original vector.
// oneMinus( x )	Return 1 minus the parameter.
// pow( x, y )	Return the value of the first parameter raised to the power of the second.
// pow2( x )	Return the square of the parameter.
// pow3( x )	Return the cube of the parameter.
// pow4( x )	Return the fourth power of the parameter.
// radians( degrees )	Convert a quantity in degrees to radians.
// reciprocal( x )	Return the reciprocal of the parameter (1/x).
// reflect( I, N )	Calculate the reflection direction for an incident vector.
// refract( I, N, eta )	Calculate the refraction direction for an incident vector.
// round( x )	Round the parameter to the nearest integer.
// saturate( x )	Constrain a value between 0 and 1.
// sign( x )	Extract the sign of the parameter.
// sin( x )	Return the sine of the parameter.
// smoothstep( e0, e1, x )	Perform Hermite interpolation between two values.
// sqrt( x )	Return the square root of the parameter.
// step( edge, x )	Generate a step function by comparing two values.
// tan( x )	Return the tangent of the parameter.
// transformDirection( dir, matrix )	Transform the direction of a vector by a matrix and then normalize the result.
// trunc( x )

const AddInputSchema = schema(z.any());

export class Add extends Node {
  name = "Add";
  inputs = {
    a: new Input({
      name: "Value",
      type: AddInputSchema,
      defaultValue: () => 0,
    }),
    b: new Input({
      name: "Value2",
      type: AddInputSchema,
      defaultValue: () => 0,
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
        defaultValue: () => 0,
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

  onUpdate = () => {};

  addOnUpdate = (fn: () => void) => {
    this.onUpdate = fn;
  };
}

export class Mul extends Node {
  name = "mul";
  inputs = {
    a: new Input({
      name: "Value",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
    b: new Input({
      name: "Value2",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
  };
  outputs = {
    output: new Output({
      name: "Output",
      type: schema(z.any()),
      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => {
          return () => mul(...inputs.map((i) => i()));
        })
      ),
    }),
  };
}

export class Sub extends Node {
  name = "sub";
  inputs = {
    a: new Input({
      name: "Value",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
    b: new Input({
      name: "Value2",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
  };
  outputs = {
    output: new Output({
      name: "Output",
      type: schema(z.any()),
      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => {
          return () => sub(...inputs.map((i) => i()));
        })
      ),
    }),
  };
}

export class Div extends Node {
  name = "div";
  inputs = {
    a: new Input({
      name: "Value",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
    b: new Input({
      name: "Value2",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
  };
  outputs = {
    output: new Output({
      name: "Output",
      type: schema(z.any()),
      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => {
          return () => div(...inputs.map((i) => i()));
        })
      ),
    }),
  };
}

// abs( x )	Return the absolute value of the parameter.
// acos( x )	Return the arccosine of the parameter.
// all( x )	Return true if all components of x are true.
// any( x )	Return true if any component of x is true.
// asin( x )	Return the arcsine of the parameter.
// atan( y, x )	Return the arc-tangent of the parameters.
// bitcast( x, y )	Reinterpret the bits of a value as a different type.
// cbrt( x )	Return the cube root of the parameter.
// ceil( x )	Find the nearest integer that is greater than or equal to the parameter.
// clamp( x, min, max )	Constrain a value to lie between two further values.
// cos( x )	Return the cosine of the parameter.
// cross( x, y )	Calculate the cross product of two vectors.
// dFdx( p )	Return the partial derivative of an argument with respect to x.
// dFdy( p )	Return the partial derivative of an argument with respect to y.
// degrees( radians )	Convert a quantity in radians to degrees.
// difference( x, y )	Calculate the absolute difference between two values.
// distance( x, y )	Calculate the distance between two points.
// dot( x, y )	Calculate the dot product of two vectors.
// equals( x, y )	Return true if x equals y.
// exp( x )	Return the natural exponentiation of the parameter.
// exp2( x )	Return 2 raised to the power of the parameter.
// faceforward( N, I, Nref )	Return a vector pointing in the same direction as another.
// floor( x )	Find the nearest integer less than or equal to the parameter.
// fract( x )	Compute the fractional part of the argument.
// fwidth( x )	Return the sum of the absolute derivatives in x and y.
// inverseSqrt( x )	Return the inverse of the square root of the parameter.
// invert( x )	Invert an alpha parameter ( 1. - x ).
// length( x )	Calculate the length of a vector.
// lengthSq( x )	Calculate the squared length of a vector.
// log( x )	Return the natural logarithm of the parameter.
// log2( x )	Return the base 2 logarithm of the parameter.
// max( x, y )	Return the greater of two values.
// min( x, y )	Return the lesser of two values.
// mix( x, y, a )	Linearly interpolate between two values.
// negate( x )	Negate the value of the parameter ( -x ).
// normalize( x )	Calculate the unit vector in the same direction as the original vector.
// oneMinus( x )	Return 1 minus the parameter.
// pow( x, y )	Return the value of the first parameter raised to the power of the second.
// pow2( x )	Return the square of the parameter.
// pow3( x )	Return the cube of the parameter.
// pow4( x )	Return the fourth power of the parameter.
// radians( degrees )	Convert a quantity in degrees to radians.
// reciprocal( x )	Return the reciprocal of the parameter (1/x).
// reflect( I, N )	Calculate the reflection direction for an incident vector.
// refract( I, N, eta )	Calculate the refraction direction for an incident vector.
// round( x )	Round the parameter to the nearest integer.
// saturate( x )	Constrain a value between 0 and 1.
// sign( x )	Extract the sign of the parameter.
// sin( x )	Return the sine of the parameter.
// smoothstep( e0, e1, x )	Perform Hermite interpolation between two values.
// sqrt( x )	Return the square root of the parameter.
// step( edge, x )	Generate a step function by comparing two values.
// tan( x )	Return the tangent of the parameter.
// transformDirection( dir, matrix )	Transform the direction of a vector by a matrix and then normalize the result.
// trunc( x )

//create Nodes for above functions
export class Abs extends Node {
  name = "abs";
  inputs = {
    a: new Input({
      name: "Value",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
  };
  outputs = {
    output: new Output({
      name: "Output",
      type: schema(z.any()),
      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => {
          return () => abs(...inputs.map((i) => i()));
        })
      ),
    }),
  };
}
// Helper function to evaluate inputs
const evaluateInputs = (inputs: any[], func: (...args: any[]) => any) => {
  return () => func(...inputs.map((i) => i()));
};

export class Acos extends Node {
  name = "acos";
  inputs = {
    a: new Input({
      name: "Value",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
  };
  outputs = {
    output: new Output({
      name: "Output",
      type: schema(z.any()),
      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => evaluateInputs(inputs, acos))
      ),
    }),
  };
}

export class Asin extends Node {
  name = "asin";
  inputs = {
    a: new Input({
      name: "Value",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
  };
  outputs = {
    output: new Output({
      name: "Output",
      type: schema(z.any()),
      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => evaluateInputs(inputs, asin))
      ),
    }),
  };
}

export class Atan extends Node {
  name = "atan";
  inputs = {
    y: new Input({
      name: "Y",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
    x: new Input({
      name: "X",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
  };
  outputs = {
    output: new Output({
      name: "Output",
      type: schema(z.any()),
      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => evaluateInputs(inputs, atan2))
      ),
    }),
  };
}

export class Clamp extends Node {
  name = "clamp";
  inputs = {
    x: new Input({
      name: "Value",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
    min: new Input({
      name: "Min",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
    max: new Input({
      name: "Max",
      type: schema(z.any()),
      defaultValue: () => 1,
    }),
  };
  outputs = {
    output: new Output({
      name: "Output",
      type: schema(z.any()),
      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => evaluateInputs(inputs, clamp))
      ),
    }),
  };
}

export class Ceil extends Node {
  name = "ceil";
  inputs = {
    a: new Input({
      name: "Value",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
  };
  outputs = {
    output: new Output({
      name: "Output",
      type: schema(z.any()),

      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => evaluateInputs(inputs, ceil))
      ),
    }),
  };
}

export class Cos extends Node {
  name = "cos";
  inputs = {
    a: new Input({
      name: "Value",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
  };
  outputs = {
    output: new Output({
      name: "Output",
      type: schema(z.any()),
      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => evaluateInputs(inputs, cos))
      ),
    }),
  };
}

export class Cross extends Node {
  name = "cross";
  inputs = {
    x: new Input({
      name: "Vector A",
      type: schema(z.any()),
      defaultValue: () => [0, 0, 0],
    }),
    y: new Input({
      name: "Vector B",
      type: schema(z.any()),
      defaultValue: () => [0, 0, 0],
    }),
  };
  outputs = {
    output: new Output({
      name: "Output",
      type: schema(z.any()),
      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => evaluateInputs(inputs, cross))
      ),
    }),
  };
}

export class Degrees extends Node {
  name = "degrees";
  inputs = {
    a: new Input({
      name: "Radians",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
  };
  outputs = {
    output: new Output({
      name: "Output",
      type: schema(z.any()),
      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => evaluateInputs(inputs, degrees))
      ),
    }),
  };
}

export class Distance extends Node {
  name = "distance";
  inputs = {
    x: new Input({
      name: "Point A",
      type: schema(z.any()),
      defaultValue: () => [0, 0, 0],
    }),
    y: new Input({
      name: "Point B",
      type: schema(z.any()),
      defaultValue: () => [0, 0, 0],
    }),
  };
  outputs = {
    output: new Output({
      name: "Output",
      type: schema(z.any()),
      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => evaluateInputs(inputs, distance))
      ),
    }),
  };
}

export class Dot extends Node {
  name = "dot";
  inputs = {
    x: new Input({
      name: "Vector A",
      type: schema(z.any()),
      defaultValue: () => [0, 0, 0],
    }),
    y: new Input({
      name: "Vector B",
      type: schema(z.any()),
      defaultValue: () => [0, 0, 0],
    }),
  };
  outputs = {
    output: new Output({
      name: "Output",
      type: schema(z.any()),
      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => evaluateInputs(inputs, dot))
      ),
    }),
  };
}

export class Floor extends Node {
  name = "floor";
  inputs = {
    a: new Input({
      name: "Value",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
  };
  outputs = {
    output: new Output({
      name: "Output",
      type: schema(z.any()),
      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => evaluateInputs(inputs, floor))
      ),
    }),
  };
}

export class Fract extends Node {
  name = "fract";
  inputs = {
    a: new Input({
      name: "Value",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
  };
  outputs = {
    output: new Output({
      name: "Output",
      type: schema(z.any()),
      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => evaluateInputs(inputs, fract))
      ),
    }),
  };
}

export class Length extends Node {
  name = "length";
  inputs = {
    a: new Input({
      name: "Vector",
      type: schema(z.any()),
      defaultValue: () => [0, 0, 0],
    }),
  };
  outputs = {
    output: new Output({
      name: "Output",
      type: schema(z.any()),
      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => evaluateInputs(inputs, length))
      ),
    }),
  };
}

export class Log extends Node {
  name = "log";
  inputs = {
    a: new Input({
      name: "Value",
      type: schema(z.any()),
      defaultValue: () => 0,
    }),
  };
  outputs = {
    output: new Output({
      name: "Output",
      type: schema(z.any()),
      observable: combineLatest([...Object.values(this.inputs)]).pipe(
        map((inputs) => evaluateInputs(inputs, log))
      ),
    }),
  };
}

export const MathNodes = {
  Add,
  Mul,
  Sub,
  Div,
  Abs,
  Acos,
  Asin,
  Atan,
  Clamp,
  Ceil,
  Cos,
  Cross,
  Degrees,
  Distance,
  Dot,
  Floor,
  Fract,
  Length,
  Log,
};
