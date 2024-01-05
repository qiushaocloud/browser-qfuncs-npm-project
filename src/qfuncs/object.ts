/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import QDate from './date';
import {IQObject} from './qfuncs.i';

class QObject extends QDate implements IQObject {
  deepAssign (sourceObj:IQJson, destObj:IQJson): IQJson {
    const changeObj:IQJson = {};

    for (const key in destObj) {
      const sourceVal: unknown = sourceObj[key];
      const destVal: unknown = destObj[key];

      if (sourceVal === undefined) {
        sourceObj[key] = destVal;
        changeObj[key] = destVal;
      } else if (typeof sourceVal === 'object' && typeof destVal === 'object') {
        const changeObjTmp = this.deepAssign((sourceVal as IQJson), (destVal as IQJson));
        if (Object.keys(changeObjTmp).length) {
          changeObj[key] = changeObjTmp;
        }
      } else {
        if (sourceVal !== destVal) {
          sourceObj[key] = destVal;
          changeObj[key] = destVal;
        }
      }
    }

    return changeObj;
  }

  deepCopy (obj: IQJson, isUseRecursive?: boolean): IQJson {
    if (!(Array.isArray(obj) || this.isPlainObject(obj)))
      return obj;

    if (isUseRecursive) {
      const newObj: IQJson = Array.isArray(obj) ? [] : {};

      for (const key in obj) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const val = obj[key];
        if (Array.isArray(obj) || this.isPlainObject(obj))
          newObj[key] = this.deepCopy(val, isUseRecursive);
        else
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          newObj[key] = val;
      }

      return newObj;
    }

    return (JSON.parse(JSON.stringify(obj)) as IQJson);
  }

  hasObjKeys (obj: IQJson, keys: string[] | string): boolean {
    if (!obj.hasOwnProperty) return false;

    if (typeof keys === 'string') {
      // eslint-disable-next-line no-prototype-builtins
      return obj.hasOwnProperty(keys);
    }

    for (const key of keys) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) return true;
    }

    return false;
  }

  getObjVals (obj: IQJson,  keys: string[] | string): IQJson {
    const vals: IQJson = {};

    if (typeof keys === 'string') {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty && obj.hasOwnProperty(keys)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        vals[keys] = obj[keys];
      }
      return vals;
    }

    for (const key of keys) {
      // eslint-disable-next-line no-prototype-builtins
      if (!obj.hasOwnProperty || obj.hasOwnProperty(key)) continue;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      vals[key] = obj[key];
    }

    return vals;
  }

  getObjVal<T=any> (obj: IQJsonT<T>,  key: string): T | undefined {
    return obj[key];
  }

  getObjValWhenEmptySetDef<T=any> (obj: IQJsonT<T>, key: string, defaultVal: T): T {
    let val = obj[key];

    if (val === undefined) {
      val = defaultVal;
      obj[key] = val;
    }

    return val;
  }

  delObjItems (obj: IQJson, keys: string[] | string): IQJson {
    const delObj: IQJson = {};
    if (typeof keys === 'string') {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty && obj.hasOwnProperty(keys)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        delObj[keys] = obj[keys];
        delete obj[keys];
      }
      return delObj;
    }

    for (const key of keys) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty && obj.hasOwnProperty(key)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        delObj[key] = obj[key];
        delete obj[key];
      }
    }
    return delObj;
  }
}

export default QObject;