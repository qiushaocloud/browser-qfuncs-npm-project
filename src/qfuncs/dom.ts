/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import QTimer from './timer';
import {IQDom} from './qfuncs.i';

class QDom extends QTimer implements IQDom {
  private _resizeObservers: QJsonT<{
    element: HTMLElement,
    ins?: ResizeObserver,
    oldWHSize?: {width: number, height: number},
    listener?: QFnEmptyArgs,
    autoRemoveOnElementVanish?: boolean
  }> = {};

  stopPropagationWrapper (evtCallback: (event: Event) => void, isExecPreventDefault?: boolean): (event: Event) => void {
    return function (event?: Event) {
      if (event && event instanceof Event) {
        // 阻止事件冒泡
        isExecPreventDefault && event.preventDefault && event.preventDefault();
        event.stopPropagation && event.stopPropagation();
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore 忽略 this
      // eslint-disable-next-line no-invalid-this
      evtCallback.call(this, event);
    };
  }

  /** 封装 stopImmediatePropagation(阻止监听同一事件的其他事件监听器被调用) 函数
   * @param evtCallback 原事件回调函数
   * @returns 返回阻止事件后的函数
   */
  stopImmediatePropagationWrapper (evtCallback: (event: Event) => void): (event: Event) => void {
    return function (event?: Event) {
      if (event && event instanceof Event) {
        event.stopImmediatePropagation && event.stopImmediatePropagation();
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore 忽略 this
      // eslint-disable-next-line no-invalid-this
      evtCallback.call(this, event);
    };
  }

  hasDomClass (element: HTMLElement, className: string | string[]): boolean {
    if (!(element instanceof HTMLElement)) return false;

    const eleClassName = element.className;
    if (!eleClassName) return false;

    if (typeof className === 'string')
      return new RegExp(`(^${className}$|^${className} | ${className}$| ${className} )`).test(eleClassName);

    if (Array.isArray(className)) {
      for (const classItem of className) {
        if (!new RegExp(`(^${classItem}$|^${classItem} | ${classItem}$| ${classItem} )`).test(eleClassName)) {
          return false;
        }
      }
      return true;
    }

    return false;
  }

  addDomClass (element: HTMLElement, className: string | string[]): void {
    if (!(element instanceof HTMLElement)) return;

    if (typeof className === 'string')
      return element.classList.add(className);

    if (Array.isArray(className))
      element.classList.add(...className);
  }

  removeDomClass (element: HTMLElement, className: string | string[]): void {
    if (!(element instanceof HTMLElement)) return;

    if (typeof className === 'string')
      return element.classList.remove(className);

    if (Array.isArray(className))
      element.classList.remove(...className);
  }

  /** 绑定事件
   * @param element 事件元素
   * @param eType 事件类型
   * @param listener 事件处理器
   * @param optionsOrUseCapture 参考浏览器 addEventListener API 的 addEventListener(type, listener, options) 和 addEventListener(type, listener, useCapture)
   * @param cacheGroupId 缓存组标记，一旦设置后，listener 会进行缓存，支持通过 cacheGroupId 移除该组监听的事件【如果缓存了，则 removeEvent 时没传 listener 则会删除缓存的 listeners】
   * @returns 返回缓存的事件 id (cacheEventId)，如果 cacheGroupId 为空，则返回 undefined【支持通过 cacheEventId 移除该事件】
  */
  addEvent (
    element: HTMLElement | Window | Document,
    eType: string,
    listener: QFnAnyArgs,
    optionsOrUseCapture?: QJson | boolean,
    cacheGroupId?: string
  ): string | void {
    if (!element || !eType || !listener)
      return;

    let cacheEventId: string | undefined = undefined;
    if (cacheGroupId) {
      cacheEventId = `${cacheGroupId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      (listener as any).cacheEventId = cacheEventId;
      (listener as any).cacheGroupId = cacheGroupId;
    }

    let isSave = !!cacheGroupId;
    if (element.addEventListener) { // 如果支持addEventListener
      element.addEventListener(eType, listener, optionsOrUseCapture);
    } else if ((element as any).attachEvent) { // 如果支持attachEvent
      (element as any).attachEvent('on' + eType, listener);
    } else { // 否则使用兼容的onclick绑定
      isSave = false;
      (element as any)['on' + eType] = listener;
    }

    if (isSave) {
      let qtmpEventListeners = (element as any)._qtmpEventListeners as QJsonT<QFnAnyArgs[]>;
      if (!qtmpEventListeners)  {
        qtmpEventListeners = {};
        (element as any)._qtmpEventListeners = qtmpEventListeners;
      }

      let eTypeListenerArr = qtmpEventListeners[eType];
      if (!eTypeListenerArr) {
        eTypeListenerArr = [];
        qtmpEventListeners[eType] = eTypeListenerArr;
      }

      !eTypeListenerArr.includes(listener) && eTypeListenerArr.push(listener);
    }

    return cacheEventId;
  }

  /** 事件解绑
   * @param element 事件元素
   * @param eType 事件类型
   * @param listener 需要从目标事件移除的事件监听器函数，不传则移除该事件类型中所有绑定的 listener 【注：所有调用 addEvent 进行绑定类型的 listener 】
   * @param optionsOrUseCapture 参考浏览器 removeEventListener API 的 removeEventListener(type, listener, options) 和 removeEventListener(type, listener, useCapture)
   */
  removeEvent (
    element: HTMLElement | Window | Document,
    eType: string,
    listener?: QFnAnyArgs,
    optionsOrUseCapture?: QJson | boolean
  ): void {
    if (!element || !eType)
      return;

    const eTypeListenerArr = ((element as any)._qtmpEventListeners && (element as any)._qtmpEventListeners[eType]) as QFnAnyArgs[];
    if (element.removeEventListener) {
      if (listener) {
        element.removeEventListener(eType, listener, optionsOrUseCapture);
        if (!eTypeListenerArr || !eTypeListenerArr.length) return;
        const listenerIndex = eTypeListenerArr.indexOf(listener);
        listenerIndex !== -1 && eTypeListenerArr.splice(listenerIndex, 1);
      } else {
        if (!eTypeListenerArr || !eTypeListenerArr.length) return;
        delete (element as any)._qtmpEventListeners[eType];
        for (const eTypeListener of eTypeListenerArr) {
          element.removeEventListener(eType, eTypeListener, optionsOrUseCapture);
        }
      }
    } else if ((element as any).detachEvent) {
      if (listener) {
        (element as any).detachEvent('on' + eType, listener);
        if (!eTypeListenerArr || !eTypeListenerArr.length) return;
        const listenerIndex = eTypeListenerArr.indexOf(listener);
        listenerIndex !== -1 && eTypeListenerArr.splice(listenerIndex, 1);
      } else {
        if (!eTypeListenerArr || !eTypeListenerArr.length) return;
        delete (element as any)._qtmpEventListeners[eType];
        for (const eTypeListener of eTypeListenerArr) {
          (element as any).detachEvent('on' + eType, eTypeListener);
        }
      }
    } else {
      (element as any)['on' + eType] = null;
      (element as any)._qtmpEventListeners && (delete (element as any)._qtmpEventListeners[eType]);
    }
  }

  /** 通过 cacheEventId 解绑对应的事件
   * @param element 事件元素
   * @param eType 事件类型
   * @param cacheEventId 缓存的事件 id
   */
  removeEventByCacheEventId (
    element: HTMLElement | Window | Document,
    eType: string,
    cacheEventId: string
  ): void {
    if (!element || !eType || !cacheEventId)
      return;

    if ((element as any)['on' + eType] && typeof (element as any)['on' + eType] === 'function' && (element as any)['on' + eType].cacheEventId === cacheEventId)
      this.removeEvent(element, eType, (element as any)['on' + eType]);

    const eTypeListenerArr = ((element as any)._qtmpEventListeners && (element as any)._qtmpEventListeners[eType]) as QFnAnyArgs[];
    if (!eTypeListenerArr || !eTypeListenerArr.length) return;

    for (const eTypeListener of eTypeListenerArr) {
      if ((eTypeListener as any).cacheEventId === cacheEventId) {
        this.removeEvent(element, eType, eTypeListener);
        break;
      }
    }
  }

  /** 通过 cacheGroupId 解绑指定事件类型中该组的事件
   * @param element 事件元素
   * @param eType 事件类型
   * @param cacheGroupId 缓存组标记
   */
  removeEventsByCacheGroupId (
    element: HTMLElement | Window | Document,
    eType: string,
    cacheGroupId: string
  ): void {
    if (!element || !eType || !cacheGroupId)
      return;

    if ((element as any)['on' + eType] && typeof (element as any)['on' + eType] === 'function' && (element as any)['on' + eType].cacheGroupId === cacheGroupId)
      this.removeEvent(element, eType, (element as any)['on' + eType]);

    const eTypeListenerArr = ((element as any)._qtmpEventListeners && (element as any)._qtmpEventListeners[eType]) as QFnAnyArgs[];
    if (!eTypeListenerArr || !eTypeListenerArr.length) return;

    for (const eTypeListener of eTypeListenerArr) {
      if ((eTypeListener as any).cacheGroupId === cacheGroupId) {
        this.removeEvent(element, eType, eTypeListener);
      }
    }
  }

  /** 通过 cacheGroupId 解绑该组的事件
   * @param element 事件元素
   * @param cacheGroupId 缓存组标记
   */
  removeAllEventsByCacheGroupId (
    element: HTMLElement | Window | Document,
    cacheGroupId: string
  ): void {
    if (!element || !cacheGroupId)
      return;

    for (const eType in (element as any)._qtmpEventListeners) {
      this.removeEventsByCacheGroupId(element, eType, cacheGroupId);
    }
  }

  isSupportFullScreen (): boolean {
    return !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled);
  }

  getFullScreenElement (): HTMLElement | undefined {
    const fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    return (fullscreenElement as HTMLElement) || undefined;
  }

  enterFullScreen (element: HTMLElement = document.documentElement): void {
    try {
      if (typeof (element as any).requestFullscreen === 'function') {
        (element as any).requestFullscreen();
      } else if (typeof (element as any).mozRequestFullScreen === 'function') {
        (element as any).mozRequestFullScreen(); // Firefox
      } else if (typeof (element as any).webkitRequestFullscreen === 'function') {
        (element as any).webkitRequestFullscreen(); // Chrome, Safari and Opera
      } else if (typeof (element as any).msRequestFullscreen === 'function') {
        (element as any).msRequestFullscreen(); // Internet Explorer and Edge
      } else {
        // eslint-disable-next-line no-console
        console.error('enterFullScreen not support', element.id, element.className);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('enterFullScreen error,', error, element.id, element.className);
    }
  }

  exitFullScreen (): void {
    try {
      if (typeof document.exitFullscreen === 'function') {
        (document as any).exitFullscreen();
      } else if (typeof document.mozCancelFullScreen === 'function') { // Firefox
        (document as any).mozCancelFullScreen();
      } else if (typeof document.webkitExitFullscreen === 'function') { // Chrome, Safari and Opera
        (document as any).webkitExitFullscreen();
      } else if (typeof document.msExitFullscreen === 'function') { // Internet Explorer and Edge
        (document as any).msExitFullscreen();
      } else {
        // eslint-disable-next-line no-console
        console.error('exitFullScreen not support');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('exitFullScreen error,', err);
    }
  }

  addFullScreenChangeListener (listener: QFnEmptyArgs): void {
    this.addEvent(document, 'fullscreenchange', listener, undefined, 'QFuncs:QDom');
    this.addEvent(document, 'mozfullscreenchange', listener, undefined, 'QFuncs:QDom'); // Firefox
    this.addEvent(document, 'webkitfullscreenchange', listener, undefined, 'QFuncs:QDom'); // Chrome, Safari and Opera
    this.addEvent(document, 'MSFullscreenChange', listener, undefined, 'QFuncs:QDom'); // Internet Explorer and Edge
  }

  /** 移除全屏改变监听器，如果 listener 不传，则移除所有缓存 listener【注：所有调用 addFullScreenChangeListener 和 addEvent(fullscreenchange、mozfullscreenchange、webkitfullscreenchange、MSFullscreenChange) 缓存的 listener 】 */
  removeFullScreenChangeListener (listener?: QFnEmptyArgs): void {
    this.removeEvent(document, 'fullscreenchange', listener);
    this.removeEvent(document, 'mozfullscreenchange', listener); // Firefox
    this.removeEvent(document, 'webkitfullscreenchange', listener); // Chrome, Safari and Opera
    this.removeEvent(document, 'MSFullscreenChange', listener); // Internet Explorer and Edge
  }

  isElementInDOMStructure (element: HTMLElement): boolean {
    if (!element || !(element instanceof HTMLElement) || !element.parentNode)
      return false;

    if (element === document.documentElement)
      return true;

    return document.documentElement.contains(element);
  }

  /** 绑定元素大小变化监听器，返回观察者 id */
  bindResizeObserver (
    element: HTMLElement,
    listener: QFnEmptyArgs,
    options?: {
      autoRemoveOnElementVanish?: boolean,
      disableDebouncing?: boolean,
      debounceInterval?: number
    }
  ): string {
    if (!element || typeof listener !== 'function') return '';

    const observerId = Math.floor(100000000000000000 + Math.random() * 900000000000000000) + '_' + Date.now();
    const listenerDebounce = options?.disableDebouncing ? listener : this.debounce(listener, options?.debounceInterval || 150, true); // 防抖处理，150ms 内只执行一次
    const autoRemoveOnElementVanish = options?.autoRemoveOnElementVanish;

    if (autoRemoveOnElementVanish && !this.hasIntervalQueue('QDom:bindResizeObserver:autoRemove')) { // 启动定时器检查元素是否移除
      this.addIntervalQueue('QDom:bindResizeObserver:autoRemove', () => {
        let isRemoveInterval = true;

        for (const observerIdTmp in this._resizeObservers) {
          const {element: elementTmp, autoRemoveOnElementVanish: autoRemoveOnElementVanishTmp} = this._resizeObservers[observerIdTmp];
          if (!elementTmp || !autoRemoveOnElementVanishTmp) continue;
          isRemoveInterval = false;

          if (!this.isElementInDOMStructure(elementTmp)) { // 不在 dom 结构上，需要移除观察者
            this.removeResizeObserver(observerIdTmp);
          }
        }

        isRemoveInterval && this.removeIntervalQueue('QDom:bindResizeObserver:autoRemove');
      }, 5000);
    }

    if ('ResizeObserver' in window) { // 浏览器支持 ResizeObserver
      const resizeObserver = new ResizeObserver(listenerDebounce);
      resizeObserver.observe(element);
      this._resizeObservers[observerId] = {element, ins: resizeObserver, autoRemoveOnElementVanish};
      return observerId;
    }

    // 浏览器不支持 ResizeObserver
    // eslint-disable-next-line no-console
    console.log('browser not support ResizeObserver, use interval to check element size change, observerId:', observerId);

    if (!this.hasIntervalQueue('QDom:bindResizeObserver:checkSizeChange')) { // 启动定时器检查元素大小变化
      this.addIntervalQueue('QDom:bindResizeObserver:checkSizeChange', () => {
        let isRemoveInterval = true;

        for (const observerIdTmp in this._resizeObservers) {
          const {element: elementTmp, oldWHSize: oldWHSizeTmp, ins: insTmp, listener: listenerTmp} = this._resizeObservers[observerIdTmp];
          if (!elementTmp || insTmp || !oldWHSizeTmp || !listenerTmp) continue;
          isRemoveInterval = false;
          const nowEleWidthTmp = elementTmp.offsetWidth;
          const nowEleHeightTmp = elementTmp.offsetHeight;

          if (nowEleWidthTmp !== oldWHSizeTmp.width || nowEleHeightTmp !== oldWHSizeTmp.height) {
            // 大小有改变，触发 listener
            oldWHSizeTmp.width = nowEleWidthTmp;
            oldWHSizeTmp.height = nowEleHeightTmp;
            listenerTmp();
          }
        }

        isRemoveInterval && this.removeIntervalQueue('QDom:bindResizeObserver:checkSizeChange');
      }, 200);
    }

    const oldWHSize = {width: element.offsetWidth, height: element.offsetHeight};
    this._resizeObservers[observerId] = {element, oldWHSize: oldWHSize, listener: listenerDebounce, autoRemoveOnElementVanish};

    return observerId;
  }

  removeResizeObserver (observerId: string): void {
    if (!observerId) return;

    const observerInfo = this._resizeObservers[observerId];
    if (!observerInfo) return;

    if (observerInfo.ins) {
      observerInfo.ins.disconnect();
      delete observerInfo.ins;
    }

    delete observerInfo.listener;
    delete observerInfo.oldWHSize;
    delete this._resizeObservers[observerId];

    let isRemoveInterval = true;

    for (const observerIdTmp in this._resizeObservers) {
      const {element: elementTmp, oldWHSize: oldWHSizeTmp, ins: insTmp, listener: listenerTmp} = this._resizeObservers[observerIdTmp];
      if (!elementTmp || insTmp || !oldWHSizeTmp || !listenerTmp) continue;
      isRemoveInterval = false;
      break;
    }

    isRemoveInterval && this.removeIntervalQueue('QDom:bindResizeObserver:checkSizeChange');
    isRemoveInterval && this.removeIntervalQueue('QDom:bindResizeObserver:autoRemove');
  }

  removeResizeObserversByElement (element: HTMLElement): void {
    if (!element) return;
    for (const observerIdTmp in this._resizeObservers) {
      const {element: elementTmp} = this._resizeObservers[observerIdTmp];
      if (elementTmp === element) {
        this.removeResizeObserver(observerIdTmp);
      }
    }
  }
}

export default QDom;