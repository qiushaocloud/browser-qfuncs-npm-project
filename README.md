# browser-qfuncs-npm-project
这是 browser-qfuncs npm 包的源码，主要封装一些功能类方法，用于 browser 环境，例如：deepAssign、deepCopy、isEqualObject、isEqualArray 等

### npm 包
* 安装 npm 包: `npm install --save @qiushaocloud/browser-qfuncs`
* 使用示例
  ```typescript
  import '@qiushaocloud/browser-qfuncs';
  /*
  import qFuncs, {
    moduleEventInstance,
    CustomEventManager,
    qFuncs,
    VERSIONS,
    VERSIONSTIME,
    ICustomEventManager,
    IQMethods
  } from '@qiushaocloud/browser-qfuncs';
  */

  const obj = {};
  console.log(qFuncs.isJson(obj));
  ```

### 接口文件
* CustomEventManager 接口定义
  ```typescript
    /** 自定义事件类接口 */
    export interface ICustomEventManager{
        on(eventType:string, listener: IFnAnyArgs, markid?: string | number): void;
        off(eventType:string, listener?: IFnAnyArgs): void;
        offAll(eventType: string): void;
        offByMarkId(eventType: string, markid: string | number): void;
        offAllByMarkId(markid: string | number): void;
        hasListener(eventType:string): boolean;
        hasListenerByMarkId(eventType:string, markid: string | number): boolean;
        trigger(eventType: string, ...args: any[]): void;
        clearAllEvent(): void;
        getAllEventTypes(): string[];
    }
  ```

* qFuncs(IQMethods) 接口文件: qfuncs.i.ts
  ```typescript
  export interface IQCheckType {
    isNumber(num: any, isAllowNumStr?: boolean): boolean;
    isString(str: any): boolean;
    isBoolean(bol: any): boolean;
    isNullOrUndefined (arg: unknown, isConsiderStr?: boolean): boolean;
    isPlainObject(obj: any): boolean;
    isJson(json: any): boolean;
    isJsonString(jsonstr: string): boolean;
    // isArray(arr: any): boolean;
    isJsonOrArray(obj: any): boolean;
    isDate(date: any): boolean;
    isFunction(fun: any): boolean;
  }

  export interface IQToType {
    toJsonStringify (json: Record<string, any>): string;
    toJsonParse (jsonStr: string): Record<string, any>;
    toParseBoolean (bol: unknown): boolean;
  }

  export interface IQCompare {
    isEqualFunction(fun1: any, fun2: any): boolean;
    isEqualDate(fun1: any, fun2: any): boolean;
    isEqualArray(arr1: any[], arr2: any[], isSimpleCompare?: boolean): boolean;
    isEqualObject(obj1: any, obj2: any): boolean;
    isEqualObjectOrArray(obj1: any, obj2: any, isSimpleCompare?: boolean): boolean;
    isEqualJsonOrArrayByJsonStringify(obj1: any, obj2: any): boolean;
    isEqualAnyValue(val1: any, val2: any, isSimpleCompare?: boolean): boolean;
  }

  export interface IQDate {
    getCurrDateSec (date?: Date | number | string): number;
    toDateSec (dateMsec: number): number;
    getCurrFormatDay (date?: Date | number | string): string;
    getCurrFormatTime (date?: Date | number | string, isGetMs?: boolean): string;
  }

  export interface IQArray {
    isArrayIncludes<T=any> (arr: T[], searchElement: T, fromIndex?: number, isSimpleCompare?: boolean): boolean;
    arrayIndexOf<T=any> (arr: T[], searchElement: T, fromIndex?: number, isSimpleCompare?: boolean): number;
    removeArrayItem<T=any> (arr: T[], removeItem: T, count?: number, isSimpleCompare?: boolean): number[];
    removeArrayItems<T=any> (arr: T[], removeItems: T[] | T, count?: number, isSimpleCompare?: boolean): number[];
    removeArrayItemsByIndexs<T=any> (arr: T[], removeIndexs: number[] | number): void;
    batchArrayPop<T=any> (arr: T[], count?: number): T[];
    batchArrayShift<T=any> (arr: T[], count?: number): T[];
    findArrayItem<T=any> (arr: T[], findItem: T, count?: number, isSimpleCompare?: boolean): number[];
    findArrayItems<T=any> (arr: T[], findItems: T[], count?: number, isSimpleCompare?: boolean): number[];
    findArrayItemsByConditions<T=any> (arr: T[], conditionsFn: (item:T) => boolean): {[itemIndex: number]: T};
    removeArrayItemsByConditions<T=any> (arr: T[], conditionsFn: (item:T) => boolean): {removeItemIndexs: number[], removeItems: T[]};
    isArrayIncludesByConditions<T=any> (arr: T[], conditionsFn: (item:T) => boolean): boolean;
    /** 正常数组去重 */
    uniqueArray<T=any> (arr: T[], isSimpleCompare?: boolean): void;
    /** 正常数组去重，返回新数组【即: 原数组不会被修改】 */
    uniqueNewArray<T=any> (arr: T[], isSimpleCompare?: boolean): T[];
    /** 通过规则进行数组去重，且返回删除的下标集
    * @param arr 数组
    * @param rule [可选] 1:去重且位置不变 2:去重且更新位置，默认为1
    * @return 删除的数组下标集
    */
    uniqueArrayByRule<T=any> (arr: T[], rule?: number, isSimpleCompare?: boolean): number[];
    convertSet2Arr<T=any> (set: Set<T>): T[];
    /** 去重 arr2 相对 arr1 而言，多了哪些 items，少了哪些 items */
    diffUniqueArrayItems (arr1: any[], arr2: any[], isSimpleCompare?: boolean): {more: any[], less: any[]};
  }

  export interface IQObject {
    deepAssign (sourceObj:IJson, destObj:IJson): IJson;
    deepCopy (obj: IJson, isUseRecursive?: boolean): IJson;
    hasObjKeys (obj: IJson, keys: string[] | string): boolean;
    getObjVals (obj: IJson, keys: string[] | string): IJson;
    getObjVal<T=any> (obj: IJsonT<T>,  key: string): T | undefined;
    getObjValWhenEmptySetDef<T=any> (obj: IJsonT<T>, key: string, defaultVal: T): T;
    delObjItems (obj: IJson, keys: string[] | string): IJson;
  }

  export interface IQMethods extends IQCheckType, IQCompare, IQToType, IQDate, IQArray, IQObject {
    /** 延迟执行,需要用 async 和 await 组合实现 */
    sleep (ts: number): Promise<void>;
    /** 随机获取范围内 count 个值 */
    randomRangeValues (start: number, end: number, count?: number): number[];
    generateUuid (): string;
    generateRandomNumberId (): number;
    generateRandomId (isUseNumAndDate?: boolean): string;
    formatError (error: string | Error): IJson;
  }

  declare global {
    const qFuncs: IQMethods;
    interface Window {
      qFuncs: IQMethods;
    }
  }
  ```

### 代码文件
* main.ts 代码，根据代码能知道导出了哪些东西
```typescript
// eslint-disable-next-line spaced-comment, @typescript-eslint/triple-slash-reference

import {IQMethods} from '@src/qfuncs/qfuncs.i';
import qFuncs, {QMethods} from '@src/qfuncs';
import CustomEventManager, {moduleEventInstance, ICustomEventManager} from '@common/custom-event-manager';
import {VERSIONS, VERSIONSTIME} from '@enum/version';

export {
  ICustomEventManager,
  IQMethods
};

export {
  moduleEventInstance,
  CustomEventManager,
  QMethods,
  qFuncs,
  VERSIONS,
  VERSIONSTIME
};

export default qFuncs;
```