/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {IQCheckType} from './qfuncs.i';

class QCheckType implements IQCheckType {
  isNumber (num: any, isAllowNumStr?: boolean): boolean {
    if (isAllowNumStr && typeof num === 'string') {
      const numTmp = Number(num);
      return typeof numTmp === 'number' && !isNaN(numTmp);
    }

    return typeof num === 'number' && !isNaN(num);
  }

  isString (str: any): boolean {
    return typeof str === 'string';
  }

  isBoolean (bol: any): boolean {
    return typeof bol === 'boolean';
  }

  isNullOrUndefined (arg: unknown, isConsiderStr?: boolean): boolean {
    return arg === undefined || arg === null || !!(isConsiderStr && (arg === 'null' || arg === 'undefined'));
  }

  /** 是否是普通对象 */
  isPlainObject (obj: any): boolean {
    return typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Object]';
  }

  /** 是否是 Json */
  isJson (json: any) {
    const result = typeof json === 'object' && Object.prototype.toString.call(json) === '[object Object]' && !json.length;
    return result;
  }

  /** 是否是 Json string */
  isJsonString (jsonStr: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const json = JSON.parse(jsonStr);
      return this.isJson(json);
      // eslint-disable-next-line no-catch-shadow
    } catch (err) {
      return false;
    }
  }

  /** 是否是 Array */
  // isArray (arr: any) {
  //   return Array.isArray(arr);
  // };

  /** 是否是 Json or Array */
  isJsonOrArray (obj: any) {
    return Array.isArray(obj) || this.isJson(obj);
  }

  /** 是否是 Date */
  isDate (date: any) {
    return typeof date === 'object' && Object.prototype.toString.call(date) === '[object Date]';
  }

  /** 是否是 Function */
  isFunction (fun: any) {
    return typeof fun === 'function' && Object.prototype.toString.call(fun) === '[object Function]';
  }
}

export default QCheckType;