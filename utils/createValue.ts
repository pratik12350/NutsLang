import {NullValue, NumberValue, BooleanValue} from "../runtime/values";

export function CREATE_NULL() {
  return {type: "null", value: null} as NullValue
};


export function CREATE_NUMBER(n: number = 0) {
  return {type: "number", value: n} as NumberValue
};

export function CREATE_BOOL(bool = true) {
  return {type: "boolean", value: bool} as BooleanValue
}
