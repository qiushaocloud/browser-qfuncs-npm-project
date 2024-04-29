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
  /** 获取当前时间戳，只支持 get */
  nowTimestamp: number;
  /** 返回校准后的当前时间戳，只支持 get */
  nowCalibrationTimestamp: number;
  /** 时间校准差值，支持 set / get */
  timeCalibrationDiff: number;
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

/**
  browserKernelName:browserMatch.browser , //浏览器使用的版本名字
  browserKernelVersion:browserMatch.version ,//浏览器使用的版本号
  appCodeName:navigator.appCodeName , //返回浏览器的代码名。
  appMinorVersion:navigator.appMinorVersion , //返回浏览器的次级版本。
  appName:navigator.appName , //返回浏览器的名称。
  appVersion:navigator.appVersion ,  //	返回浏览器的平台和版本信息。
  browserLanguage:navigator.browserLanguage , //	返回当前浏览器的语言。
  cookieEnabled: navigator.cookieEnabled , //	返回指明浏览器中是否启用 cookie 的布尔值。
  cpuClass:navigator.cpuClass , //	返回浏览器系统的 CPU 等级。
  onLine:navigator.onLine , //	返回指明系统是否处于脱机模式的布尔值。
  platform:navigator.platform , //	返回运行浏览器的操作系统平台。
  systemLanguage:navigator.systemLanguage ,  //返回 OS 使用的默认语言。
  userAgent:userAgent , //返回由客户机发送服务器的 user-agent 头部的值。
  userLanguage:navigator.userLanguage , //	返回 OS 的自然语言设置。
 */
export interface IBrowserInfo {
  userAgent: string;
  language: string;
  platform: string;
  appName: string;
  appVersion: string;
  browserLanguage: string;
  cpuClass: string;
  onLine: boolean;
  cookieEnabled: boolean;
  browserKernelName: string;
  browserKernelVersion: string;
}

export interface IQBrowser {
  /** 获取 localStorage 存储的 item */
  getLocalStorageItem (key: string): string | null;

  /** 设置 localStorage 存储的 item */
  setLocalStorageItem (key: string, value: string): void;

  /** 删除 localStorage 存储的 item */
  removeLocalStorageItem (key: string): void;

  /** 清空 localStorage 存储的所有 item */
  clearLocalStorage (): void;

  /** 获取 sessionStorage 存储的 item */
  getSessionStorageItem (key: string): string | null;

  /** 设置 sessionStorage 存储的 item */
  setSessionStorageItem (key: string, value: string): void;

  /** 删除 sessionStorage 存储的 item */
  removeSessionStorageItem (key: string): void;

  /** 清空 sessionStorage 存储的所有 item */
  clearSessionStorage (): void;

  /** 获取当前页面的 url 中的所有参数 */
  getLocationParams (): QJsonT<string>;

  /** 获取当前页面的 url 中的某个参数的值 */
  getLocationParam (key: string): string | null;

  /** 获取当前页面的 url 中的某个参数的值，并转为 number 类型 */
  getLocationParamNumber (key: string): number | null;

  /** 获取当前页面的 url 中的某个参数的值，并转为 boolean 类型 */
  getLocationParamBoolean (key: string): boolean | null;

  /** 获取当前页面的 url 中的某个参数的值，并转为 json 类型 */
  getLocationParamJson (key: string): QJson | null;

  /** 获取当前页面的 url 中的某个参数的值，并转为数组类型 */
  getLocationParamArray<T=any> (key: string): T[] | null;

  // /** 获取浏览器基本信息 */
  // getBrowserInfo(): IBrowserInfo;

  // /** 获取操作系统类型 */
  // getDetectOS(): string;

  // /** 获取设备类型 */
  // getDeviceModel (): string;

  // /** 获取浏览器引擎名 */
  // getBrowserName(): string;

  // /** 获取浏览器版本号 */
  // getBrowserVersion(): string;

  // /** 是否是移动端 */
  // isMobile(): boolean;

  // /** 是否是微信浏览器 */
  // isWechatBrowser(): boolean;

  // /** 获取浏览器内核名 */
  // getBrowserKernelName(): string;

  // /** 获取浏览器内核版本 */
  // getBrowserKernelVersion(): string;
}

export interface IQDom {
  /** 封装阻止事件冒泡函数
   * @param evtCallback 原事件回调函数
   * @param isExecPreventDefault 是否执行 preventDefault, 默认为 false
   * @returns 返回阻止事件后的函数
   */
  stopPropagationWrapper(evtCallback: (event: Event) => void, isExecPreventDefault?: boolean): (event: Event) => void;

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

  /** 判断元素是否在 DOM 结构中 */
  isElementInDOMStructure (element: HTMLElement): boolean;

  /** 绑定元素大小变化监听器，返回观察者 id
   * @param element 监听元素
   * @param listener 监听器函数
   * @param options [可选] 选项
   *   - 'autoRemoveOnElementVanish': 是否元素不在界面上就自动移除监听器，默认为 false 【注：不会立即移除，每隔 5s 会检测一下】
   *   - 'disableDebouncing': 是否禁用 debounce，默认为 false
   *   - 'debounceInterval': debounce 间隔时间，默认为 100 【注：单位：毫秒】
   * @returns 返回观察者 id (observerId)
   */
  bindResizeObserver (
    element: HTMLElement,
    listener: QFnEmptyArgs,
    options?: {
      autoRemoveOnElementVanish?: boolean,
      disableDebouncing?: boolean,
      debounceInterval?: number
    }
  ): string;

  /** 移除元素大小变化监听器
   * @param observerId 观察者 id
   */
  removeResizeObserver (observerId: string): void;

  /** 移除 element 绑定的所有大小变化监听器
   * @param element 监听元素
   */
  removeResizeObserversByElement (element: HTMLElement): void;
}

export interface IQTimer {
  /** 延迟执行,需要用 async 和 await 组合实现 */
  sleep (ts: number): Promise<void>;

  /** 添加到定时队列
   * @param queueId 定时队列 id
   * @param callback 定时器回调函数
   * @param intervalTs 定时器间隔时间，单位：毫秒
  */
  addIntervalQueue (queueId: string, callback: QFnEmptyArgs, intervalTs: number): void;

  /** 从定时队列移除
   * @param queueId 定时队列 id
  */
  removeIntervalQueue (queueId: string): void;

  /** 是否有定时队列任务
   * @param queueId 定时队列 id
  */
  hasIntervalQueue (queueId: string): boolean;

  /** 获取所有定时队列 id
   * @returns 返回所有定时队列 id
   */
  getAllIntervalQueueIds (): string[];
}

export interface IQFunc {
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

export interface IQMethods extends
IQFunc, IQCheckType, IQCompare, IQToType, IQDate,
IQArray, IQObject, IQTimer, IQBrowser, IQDom {
  /** 随机获取范围内 count 个值 */
  randomRangeValues (start: number, end: number, count?: number): number[];
  generateUuid (): string;
  generateRandomNumberId (): number;
  generateRandomId (isUseNumAndDate?: boolean): string;
  formatError (error: string | Error): QJson;
}

declare global {
  const qFuncs: IQMethods;
  interface Window {
    qFuncs: IQMethods;
  }
}