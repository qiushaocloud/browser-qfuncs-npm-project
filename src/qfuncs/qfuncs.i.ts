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
  /** 浅比较是否相等，相等情况：val1 === val2 ｜ for(val1) === for(val2) */
  isShoalEqual(val1: any, val2: any): boolean;
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
  removeArrayItems<T=any> (arr: T[], removeItems: T[], count?: number, isSimpleCompare?: boolean): number[];
  removeArrayItemsByIndexs<T=any> (arr: T[], removeIndexs: number[] | number): void;
  batchArrayPop<T=any> (arr: T[], count?: number): T[];
  batchArrayShift<T=any> (arr: T[], count?: number): T[];
  findArrayItem<T=any> (arr: T[], findItem: T, count?: number, isSimpleCompare?: boolean): number[];
  findArrayItems<T=any> (arr: T[], findItems: T[], count?: number, isSimpleCompare?: boolean): number[];
  findArrayOneItemByConditions<T=any> (arr: T[], conditionsFn: (item:T) => boolean, isReverse?: boolean): T | undefined;
  findArrayItemsByConditions<T=any> (arr: T[], conditionsFn: (item:T) => boolean, count?: number): {[itemIndex: number]: T};
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
  diffUniqueArrayItems<T=any> (arr1: T[], arr2: T[], isSimpleCompare?: boolean): {more: T[], less: T[]};
  /** 当 for(items) 不在数组中时 push 到数组中 */
  pushArrayItemsNX<T=any> (arr: T[], items: T[], isSimpleCompare?: boolean): T[];
  /** 当 item 不在数组中时 push 到数组中 */
  pushArrayItemNX<T=any> (arr: T[], item: T, isSimpleCompare?: boolean): T | undefined;
  /** 当 for(items) 不在数组中时 unshift 到数组中 */
  unshiftArrayItemsNX<T=any> (arr: T[], items: T[], isSimpleCompare?: boolean): T[];
  /** 当 item 不在数组中时 unshift 到数组中 */
  unshiftArrayItemNX<T=any> (arr: T[], item: T, isSimpleCompare?: boolean): T | undefined;
}

export interface IQObject {
  deepAssign (sourceObj:QJson, destObj:QJson): QJson;
  deepCopy (obj: QJson, isUseRecursive?: boolean): QJson;
  hasObjKeys (obj: QJson, keys: string[] | string): boolean;
  getObjVals (obj: QJson, keys: string[] | string): QJson;
  getObjVal<T=any> (obj: QJsonT<T>,  key: string): T | undefined;
  getObjValWhenEmptySetDef<T=any> (obj: QJsonT<T>, key: string, defaultVal: T): T;
  delObjItems (obj: QJson, keys: string[] | string): QJson;
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
   * @param isCacheListener 是否缓存 listener，如果缓存了，则 removeEvent 时没传 listener 则会删除缓存的 listeners
  */
  addEvent (element: HTMLElement | Window | Document, eType: string, listener: QFnAnyArgs, optionsOrUseCapture?: QJson | boolean, isCacheListener?: boolean): void;

  /** 事件解绑
   * @param element 事件元素
   * @param eType 事件类型
   * @param listener 需要从目标事件移除的事件监听器函数，不传则移除该事件类型中所有绑定的缓存 listener 【注：所有调用 addEvent 进行绑定类型的缓存 listener 】
   * @param optionsOrUseCapture 参考浏览器 removeEventListener API 的 removeEventListener(type, listener, options) 和 removeEventListener(type, listener, useCapture)
   */
  removeEvent (element: HTMLElement | Window | Document, eType: string, listener?: QFnAnyArgs, optionsOrUseCapture?: QJson | boolean): void;

  isSupportFullScreen (): boolean;
  getFullScreenElement (): HTMLElement | undefined;
  enterFullScreen (element?: HTMLElement): void;
  exitFullScreen (): void;
  addFullScreenChangeListener (listener: QFnEmptyArgs): void;
  /** 移除全屏改变监听器，如果 listener 不传，则移除所有缓存 listener【注：所有调用 addFullScreenChangeListener 和 addEvent(fullscreenchange、mozfullscreenchange、webkitfullscreenchange、MSFullscreenChange) 缓存的 listener 】 */
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
  formatError (error: string | Error): QJson;
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