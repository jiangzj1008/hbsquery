import * as Attributes from './api/attributes';

type MethodsType = typeof Attributes;

export interface Hbsquery<T> extends MethodsType {}

export class Hbsquery<T> extends Array<T> {
  constructor(elements: ArrayLike<T>) {
    super();

    this.length = elements.length;
    for (let index = 0; index < elements.length; index++) {
      const element = elements[index];
      this[index] = element;
    }
  }
}

Object.assign(Hbsquery.prototype, Attributes);
