/* eslint-disable @typescript-eslint/no-unsafe-assignment */


/** 自定义事件类接口 */
export interface ICustomEventManager{
  on(eventType:string, listener: IQFnAnyArgs, markid?: string | number): void;
  off(eventType:string, listener?: IQFnAnyArgs): void;
  offAll(eventType: string): void;
  offByMarkId(eventType: string, markid: string | number): void;
  offAllByMarkId(markid: string | number): void;
  hasListener(eventType:string): boolean;
  hasListenerByMarkId(eventType:string, markid: string | number): boolean;
  trigger(eventType: string, ...args: any[]): void;
  clearAllEvent(): void;
  getAllEventTypes(): string[];
}

/** 自定义事件类
* @module CustomEventManager
* @description  提供事件驱动
* @author 邱少羽梦
* @date 2023-12-20
*/
class CustomEventManager implements ICustomEventManager {
  private _eventListeners:IQJson = {}; // 事件列表
  private _markListerners:IQJson = {}; // 事件mark列表

  /** 进行事件绑定
   * @method on
   * @param  {string} eventType 要绑定的事件名称
   * @param  {function} listener 要绑定的事件监听器
   * @param  {string|number} markid [可选]要绑定的事件标识id，用于根据标识id来移除事件
   * @returns {void} undefined
  */
  on (eventType:string, listener: IQFnAnyArgs, markid?: string | number): void {
    if (!this._eventListeners[eventType])
      this._eventListeners[eventType] = [];
    this._eventListeners[eventType].push({listener, markid});
    if (markid) {
      if (!this._markListerners[markid])
        this._markListerners[markid] = [];
      this._markListerners[markid].push({eventType, listener});
    }
  }

  /** 取消事件绑定
   * @method off
   * @param  {string} eventType 要移除的事件名称
   * @param  {function} listener [可选]要移除的事件监听器，不传listener则会移除eventType下所有的监听器。
   * @returns {void} undefined
  */
  off (eventType:string, listener?: IQFnAnyArgs): void {
    const evtarr = this._eventListeners[eventType];
    if (evtarr && evtarr.length) {
      for (let index = evtarr.length - 1; index >= 0; index--) {
        const evtItem = evtarr[index];
        if (!listener || evtItem.listener === listener) {
          if (evtItem.markid) {
            const markevtarr = this._markListerners[evtItem.markid];
            if (markevtarr) {
              for (let index2 = markevtarr.length - 1; index2 >= 0; index2--) {
                if (markevtarr[index2].listener === evtItem.listener) {
                  markevtarr.splice(index2, 1);
                }
              }
              if (!this._markListerners[evtItem.markid].length) {
                delete this._markListerners[evtItem.markid];
              }
            }
          }
          evtarr.splice(index, 1);
        }
      }
      if (!this._eventListeners[eventType].length)
        delete this._eventListeners[eventType];
    }
  }

  /** 解绑指定事件下的所有监听器
   * @method offAll
   * @param  {string} eventType 要移除的事件名称
   * @returns {void} undefined
  */
  offAll (eventType: string): void {
    const evtarr = this._eventListeners[eventType];
    if (evtarr && evtarr.length) {
      for (let index = evtarr.length - 1; index >= 0; index--) {
        const evtItem = evtarr[index];
        if (evtItem.markid) {
          const markevtarr = this._markListerners[evtItem.markid];
          if (markevtarr) {
            for (let index2 = markevtarr.length - 1; index2 >= 0; index2--) {
              if (markevtarr[index2].listener === evtItem.listener) {
                markevtarr.splice(index2, 1);
              }
            }
            if (!this._markListerners[evtItem.markid].length) {
              delete this._markListerners[evtItem.markid];
            }
          }
        }
        evtarr.splice(index, 1);
      }
      if (!this._eventListeners[eventType].length)
        delete this._eventListeners[eventType];
    }
  }

  /** 根据markid解绑拥有这个标识id的指定事件
   * @method offByMarkId
   * @param  {string} eventType 要移除的事件名称
   * @param  {string|number} markid 要解绑的事件标识id
   * @returns {void} undefined
  */
  offByMarkId (eventType: string, markid: string | number): void {
    const evtarr = this._eventListeners[eventType];
    if (evtarr) {
      for (let index = evtarr.length - 1; index >= 0; index--) {
        const evtItem = evtarr[index];
        if (evtItem.markid && evtItem.markid === markid) {
          const markevtarr = this._markListerners[evtItem.markid];
          if (markevtarr) {
            for (let index2 = markevtarr.length - 1; index2 >= 0; index2--) {
              if (markevtarr[index2].listener === evtItem.listener) {
                markevtarr.splice(index2, 1);
              }
            }
            if (!this._markListerners[evtItem.markid].length) {
              delete this._markListerners[evtItem.markid];
            }
          }
          evtarr.splice(index, 1);
        }
      }
      if (!evtarr.length)
        delete this._eventListeners[eventType];
    }
  }

  /** 根据markid解绑拥有这个标识id的所有事件
   * @method offAllByMarkId
   * @param  {string|number} markid 要解绑的事件标识id
   * @returns {void} undefined
  */
  offAllByMarkId (markid: string | number): void {
    const markevtarr = this._markListerners[markid];
    if (markevtarr) {
      for (let index2 = 0, len2 = markevtarr.length; index2 < len2; index2++) {
        const eventType = markevtarr[index2].eventType;
        const listener = markevtarr[index2].listener;
        const evtarr = this._eventListeners[eventType];
        if (evtarr) {
          for (let index3 = evtarr.length - 1; index3 >= 0; index3--) {
            if (evtarr[index3].listener === listener) {
              evtarr.splice(index3, 1);
            }
          }

          if (!this._eventListeners[eventType].length)
            delete this._eventListeners[eventType];
        }
      }
      this._markListerners[markid].length = 0;
      delete this._markListerners[markid];
    }
  }

  /** 是否有事件监听者
   * @method trigger
   * @param  {string} eventType 事件名称
   * @returns {boolean} true：有事件监听者 false：没有事件监听者
   */
  hasListener (eventType: string): boolean {
    return !!(this._eventListeners[eventType] && this._eventListeners[eventType].length);
  }

  /** 根据markid判定是否有事件监听者
   * @method trigger
   * @param  {string} eventType 事件名称
   * @returns {boolean} true：有事件监听者 false：没有事件监听者
   */
  hasListenerByMarkId (eventType: string, markid: string | number): boolean {
    const evtarr = this._eventListeners[eventType];
    const markevtarr = this._markListerners[markid];
    let _hasListener = false;
    if (evtarr && evtarr.length && markevtarr) {
      for (let index = evtarr.length - 1; index >= 0; index--) {
        const evtItem = evtarr[index];
        if (evtItem.markid && evtItem.markid === markid) {
          _hasListener = true;
          break;
        }
      }
    }

    return _hasListener;
  }

  /** 触发事件
   * @method trigger
   * @param  {string} eventType 要触发的事件名称
   * @param  {any[]} args [可选]触发事件携带的回调参数。
   * @returns {void} undefined
  */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  trigger (eventType: string, ...args: any[]): void {
    const evtarr = this._eventListeners[eventType];
    if (evtarr) {
      for (const evt of [...evtarr]) {
        if (evt && evt.listener)
          evt.listener(...args);
      }
    }
  }

  /** 清除所有事件绑定 */
  clearAllEvent (): void {
    this._eventListeners = {}; // 事件列表
    this._markListerners = {}; // 事件mark列表
  }

  /** 获取所有的事件类型 */
  getAllEventTypes (): string[] {
    const _allEventTypes: string[] = [];
    for (const _eventType in this._eventListeners)
      _allEventTypes.push(_eventType);
    return _allEventTypes;
  }
}

export const moduleEventInstance = new CustomEventManager(); // 模块间的事件通信实例

export default CustomEventManager;