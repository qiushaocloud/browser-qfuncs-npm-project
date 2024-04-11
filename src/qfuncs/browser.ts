/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import QArray from './array';
import {IQBrowser} from './qfuncs.i';

class QBrowser extends QArray implements IQBrowser {
  stopPropagationWrapper (evtCallback: (event: Event) => void): (event: Event) => void {
    return function (event?: Event) {
      if (event && event instanceof Event) {
        // 阻止事件冒泡
        event.preventDefault && event.preventDefault();
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
        // 阻止事件冒泡
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
  */
  addEvent (element: HTMLElement | Window | Document, eType: string, listener: QFnAnyArgs, optionsOrUseCapture?: QJson | boolean): void  {
    if (!element || !eType || !listener)
      return;

    let isSave = true;
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
  }

  /** 事件解绑
   * @param element 事件元素
   * @param eType 事件类型
   * @param listener 需要从目标事件移除的事件监听器函数，不传则移除该事件类型中所有绑定的 listener 【注：所有调用 addEvent 进行绑定类型的 listener 】
   * @param optionsOrUseCapture 参考浏览器 removeEventListener API 的 removeEventListener(type, listener, options) 和 removeEventListener(type, listener, useCapture)
   */
  removeEvent (element: HTMLElement | Window | Document, eType: string, listener?: QFnAnyArgs, optionsOrUseCapture?: QJson | boolean): void {
    if (!element || !eType || !listener)
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
    this.addEvent(document, 'fullscreenchange', listener);
    this.addEvent(document, 'mozfullscreenchange', listener); // Firefox
    this.addEvent(document, 'webkitfullscreenchange', listener); // Chrome, Safari and Opera
    this.addEvent(document, 'MSFullscreenChange', listener); // Internet Explorer and Edge
  }

  /** 移除全屏改变监听器，如果 listener 不传，则移除所有 listener【注：所有调用 addFullScreenChangeListener 和 addEvent(fullscreenchange、mozfullscreenchange、webkitfullscreenchange、MSFullscreenChange) 的 listener 】 */
  removeFullScreenChangeListener (listener?: QFnEmptyArgs): void {
    this.removeEvent(document, 'fullscreenchange', listener);
    this.removeEvent(document, 'mozfullscreenchange', listener); // Firefox
    this.removeEvent(document, 'webkitfullscreenchange', listener); // Chrome, Safari and Opera
    this.removeEvent(document, 'MSFullscreenChange', listener); // Internet Explorer and Edge
  }
}

export default QBrowser;