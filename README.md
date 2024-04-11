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
<!-- * package.json 依赖 `@types/qtypings-browser-global`: `"@types/qtypings-browser-global": "git+https://gitee.com/qiushaocloud/npmjs-dts-types-projects.git#qtypings-browser-global"` 或 `"@types/qtypings-browser-global": "latest"` -->

### 接口文件
* CustomEventManager 接口定义
  ```typescript
    /** 自定义事件类接口 */
    export interface ICustomEventManager{
        on(eventType:string, listener: IFnAnyArgs, markid?: string | number): void;
        once(eventType:string, listener: QFnAnyArgs, markid?: string | number): void;
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

  export interface IQBrowser {
    /** 封装阻止事件冒泡函数
     * @param evtCallback 原事件回调函数
     * @returns 返回阻止事件后的函数
    */
    stopPropagationWrapper(evtCallback: (event: Event) => void): (event: Event) => void;

    /** 封装 stopImmediatePropagation(阻止监听同一事件的其他事件监听器被调用) 函数
     * @param evtCallback 原事件回调函数
     * @returns 返回阻止事件后的函数
    */
    stopImmediatePropagationWrapper(evtCallback: (event: Event) => void): (event: Event) => void;

    hasDomClass(element: HTMLElement, className: string | string[]): boolean;
    addDomClass(element: HTMLElement, className: string | string[]): void;
    removeDomClass(element: HTMLElement, className: string | string[]): void;

    /** 绑定事件
     * @param element 事件元素
     * @param eType 事件类型
     * @param listener 事件处理器
     * @param optionsOrUseCapture 参考浏览器 addEventListener API 的 addEventListener(type, listener, options) 和 addEventListener(type, listener, useCapture)
    */
    addEvent (element: HTMLElement | Window | Document, eType: string, listener: QFnAnyArgs, optionsOrUseCapture?: QJson | boolean): void;

    /** 事件解绑
     * @param element 事件元素
     * @param eType 事件类型
     * @param listener 需要从目标事件移除的事件监听器函数，不传则移除该事件类型中所有绑定的 listener 【注：所有调用 addEvent 进行绑定类型的 listener 】
     * @param optionsOrUseCapture 参考浏览器 removeEventListener API 的 removeEventListener(type, listener, options) 和 removeEventListener(type, listener, useCapture)
    */
    removeEvent (element: HTMLElement | Window | Document, eType: string, listener?: QFnAnyArgs, optionsOrUseCapture?: QJson | boolean): void;

    isSupportFullScreen (): boolean;
    getFullScreenElement (): HTMLElement | undefined;
    enterFullScreen (element?: HTMLElement): void;
    exitFullScreen (): void;
    addFullScreenChangeListener (listener: QFnEmptyArgs): void;
    /** 移除全屏改变监听器，如果 listener 不传，则移除所有 listener【注：所有调用 addFullScreenChangeListener 和 addEvent(fullscreenchange、mozfullscreenchange、webkitfullscreenchange、MSFullscreenChange) 的 listener 】 */
    removeFullScreenChangeListener (listener?: QFnEmptyArgs): void;
  }

  export interface IQMethods extends IQCheckType, IQCompare, IQToType, IQDate, IQArray, IQObject, IQBrowser {
    /** 延迟执行,需要用 async 和 await 组合实现 */
    sleep (ts: number): Promise<void>;
    /** 随机获取范围内 count 个值 */
    randomRangeValues (start: number, end: number, count?: number): number[];
    generateUuid (): string;
    generateRandomNumberId (): number;
    generateRandomId (isUseNumAndDate?: boolean): string;
    formatError (error: string | Error): IJson;
    /** 防抖函数
     * @param func 原函数
     * @param delay 延迟时间
     * @param immediate 首次触发时是否立即执行
     * @returns 返回防抖后的函数
     */
    debounce(func: QFnAnyArgs, delay: number, immediate?: boolean): QFnAnyArgs;

    /** 节流函数
     * @param func 原函数
     * @param delay 延迟时间
     * @returns 返回节流后的函数
     */
    throttle(func: QFnAnyArgs, delay: number): QFnAnyArgs;
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


#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request



#### 开源不易，如果对您有帮助，请您动一动您的小手，给作者点 Star，也请您多多关注分享者「[邱少羽梦](https://www.qiushaocloud.top)」

* 分享者邮箱: [qiushaocloud@126.com](mailto:qiushaocloud@126.com)
* [分享者博客](https://www.qiushaocloud.top)
* [分享者自己搭建的 gitlab](https://gitlab.qiushaocloud.top/qiushaocloud) 
* [分享者 gitee](https://gitee.com/qiushaocloud/dashboard/projects) 
* [分享者 github](https://github.com/qiushaocloud?tab=repositories) 
