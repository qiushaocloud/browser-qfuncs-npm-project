/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import QToType from './to-type';
import {IQCompare} from './qfuncs.i';

class QCompare extends QToType implements IQCompare {
/** 判断两个 function 是否相等 */
  isEqualFunction (fun1: any, fun2: any): boolean {
    if (fun1 === fun2) return true;

    if (!this.isFunction(fun1) || !this.isFunction(fun2))
      return fun1 === fun2;

    if (String(fun1) !== String(fun2))
      return false;

    return true;
  }

  isEqualDate (date1: any, date2: any): boolean {
    if (date1 === date2) return true;

    if (!this.isDate(date1) || !this.isDate(date2))
      return date1 === date2;

    return date1.getTime() === date2.getTime();
  }

  isEqualArray (arr1: any[], arr2: any[], isSimpleCompare?: boolean): boolean {
    if (arr1 === arr2) return true;

    if (!Array.isArray(arr1) || !Array.isArray(arr2))
      return arr1 === arr2;

    if (arr1.length !== arr2.length)
      return false;

    if (isSimpleCompare) {
      try {
        return JSON.stringify(arr1) === JSON.stringify(arr2);
        // eslint-disable-next-line no-catch-shadow
      } catch (err) {
        return false;
      }
    }

    for (let i = 0; i < arr1.length; i++) {
      if (this.isPlainObject(arr1[i]) && this.isPlainObject(arr2[i])) {
        if (!(this.isEqualObject(arr1[i], arr2[i]))) {
          return false;
        }
      } else if (this.isFunction(arr1[i]) && this.isFunction(arr2[i])) {
        if (!this.isEqualFunction(arr1[i], arr2[i])) {
          return false;
        }
      } else if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
        if (!this.isEqualArray(arr1[i], arr2[i])) {
          return false;
        }
      } else if (this.isDate(arr1[i]) && this.isDate(arr2[i])) {
        if (!this.isEqualDate(arr1[i], arr2[i])) {
          return false;
        }
      } else if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  isEqualObject (obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;

    if (!this.isPlainObject(obj1) || !this.isPlainObject(obj2))
      return obj1 === obj2;

    if (this._getObjectOrArrLen(obj1) !== this._getObjectOrArrLen(obj2))
      return false;

    for (const key in obj1) {
      if (key === '__proto__' || obj1[key] === obj2[key])
        continue;

      if (this.isPlainObject(obj1[key]) && this.isPlainObject(obj2[key])) {
        if (!this.isEqualObject(obj1[key], obj2[key])) {
          return false;
        }
      } else if (this.isFunction(obj1[key]) && this.isFunction(obj2[key])) {
        if (!this.isEqualFunction(obj1[key], obj2[key])) {
          return false;
        }
      } else if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
        if (!this.isEqualArray(obj1[key], obj2[key])) {
          return false;
        }
      } else if (this.isDate(obj1[key]) && this.isDate(obj2[key])) {
        // 这里的方法在上面的文章里有
        if (!this.isEqualDate(obj1[key], obj2[key])) {
          return false;
        }
      } else if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  }

  isEqualObjectOrArray (obj1: any, obj2: any, isSimpleCompare?: boolean): boolean {
    if (obj1 === obj2) return true;

    if (!this.isJsonOrArray(obj1) || !this.isJsonOrArray(obj2))
      return obj1 === obj2;

    if (this._getObjectOrArrLen(obj1) !== this._getObjectOrArrLen(obj2))
      return false;

    if (Array.isArray(obj1) && Array.isArray(obj2))
      return this.isEqualArray(obj1, obj2, isSimpleCompare);

    return this.isEqualObject(obj1, obj2);
  }

  isEqualJsonOrArrayByJsonStringify (obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;

    if (!this.isJsonOrArray(obj1) || !this.isJsonOrArray(obj2))
      return obj1 === obj2;

    if (this._getObjectOrArrLen(obj1) !== this._getObjectOrArrLen(obj2))
      return false;

    try {
      return JSON.stringify(obj1) === JSON.stringify(obj2);
      // eslint-disable-next-line no-catch-shadow
    } catch (err) {
      return false;
    }
  }

  isEqualAnyValue (val1: any, val2: any, isSimpleCompare?: boolean): boolean {
    if (val1 === val2) return true;

    if (
      typeof val1 === 'string' || typeof val1 === 'number' || typeof val1 === 'boolean'
        || typeof val2 === 'string' || typeof val2 === 'number' || typeof val2 === 'boolean'
    ) {
      return val1 === val2;
    }

    if (this.isPlainObject(val1) && this.isPlainObject(val2))
      return this.isEqualObject(val1, val2);

    if (Array.isArray(val1) && Array.isArray(val2))
      return this.isEqualArray(val1, val2, isSimpleCompare);

    if (this.isDate(val1) && this.isDate(val2))
      return this.isEqualDate(val1, val2);

    if (this.isFunction(val1) && this.isFunction(val2))
      return this.isEqualFunction(val1, val2);

    return val1 === val2;
  }

  private _getObjectOrArrLen (obj: any): number | -1 {
    if (Array.isArray(obj))
      return obj.length;

    if (this.isJson(obj))
      return Object.keys(obj).length;

    return -1;
  }
}

export default QCompare;

