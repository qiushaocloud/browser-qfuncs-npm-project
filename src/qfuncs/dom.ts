/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import QArray from './array';
import {IQDom} from './qfuncs.i';

class QDom extends QArray implements IQDom {
  stopPropagationWrapper (evtCallback: (event?: Event, ...args: unknown[]) => void): (event?: Event, ...args: unknown[]) => void {
    return function (event?: Event, ...args: unknown[]) {
      if (event && event instanceof Event) {
        // 阻止事件冒泡
        event.preventDefault && event.preventDefault();
        event.stopPropagation && event.stopPropagation();
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore 忽略 this
      // eslint-disable-next-line no-invalid-this
      evtCallback.call(this, event, ...args);
    };
  }
}

export default QDom;