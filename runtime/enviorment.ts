import {RuntimeValue} from './values'

export default class Enviorment {
  private parent?: Enviorment;
  private variables?: Map<string, RuntimeValue>;

  constructor(parentEnv?: Enviorment) {
    this.parent = parentEnv;
    this.variables = new Map();
  }

  public declareVariable(varName: string, value: RuntimeValue): RuntimeValue {
    if (this.variables?.has(varName)) {
      throw `Cannot define variable ${varName}. As it is already defined`
    }

    this.variables?.set(varName, value);
    return value;
  }

  public assignVariable(varName: string, value: RuntimeValue): RuntimeValue {
    const env = this.resolve(varName);
    env.variables?.set(varName, value);
    return value;
  }

  public lookupVariable(varName: string): RuntimeValue {
    const env = this.resolve(varName);
    return env.variables?.get(varName) as RuntimeValue;
  }

  public resolve(varName: string): Enviorment {
    if (this.variables?.has(varName)) return this;

    if (this.parent == undefined) {
      throw `Cannot resolve ${varName} as it does not exist.`
    }

    return this.parent.resolve(varName)
  }
}
