/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import QArray from './array';
import {IQDom} from './qfuncs.i';

class QDom extends QArray implements IQDom {
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
}

export default QDom;