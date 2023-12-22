/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import QCheckType from './check-type';
import {IQToType} from './qfuncs.i';

class QToType extends QCheckType implements IQToType {
  toJsonStringify (json: Record<string, any>): string {
    if (!json) {
      return json;
    }

    try {
      if (typeof  json !== 'object')
        return json;

      const jsonString = JSON.stringify(json);
      if (jsonString)
        return jsonString;
    } catch (e) {} // eslint-disable-line no-empty

    return (json as unknown as string);
  }

  toJsonParse (jsonStr: string): Record<string, any> {
    if (!jsonStr)
      return (jsonStr as unknown as Record<string, any>);

    try {
      if (typeof jsonStr === 'object' && Object.prototype.toString.call(jsonStr).toLowerCase() === '[object object]' && !(jsonStr as any).length) {
        return jsonStr;
      }
      const json = (JSON.parse(jsonStr) as Record<string, any>);

      if (json)
        return json;
    } catch (e) {}// eslint-disable-line no-empty

    return (jsonStr as unknown as Record<string, any>);
  }

  /* 转为布尔类型*/
  toParseBoolean (bol: unknown): boolean {
    let isBool = false;

    if (!(bol === undefined || bol === null || bol === '')) {
      if (typeof bol === 'boolean') {
        isBool = bol;
      } else if (typeof bol === 'number') {
        isBool = !!bol;
      } else if (typeof bol === 'string') {
        const bolNum = Number(bol);
        if (typeof bolNum === 'number' && !isNaN(bolNum)) {
          isBool = !!bolNum;
        } else {
          isBool = bol === 'true';
        }
      } else {
        isBool = !!bol;
      }
    }

    return isBool;
  }
}

export default QToType;