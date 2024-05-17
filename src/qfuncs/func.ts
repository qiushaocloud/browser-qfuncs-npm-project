import QArray from './array';
import {IQFunc} from './qfuncs.i';

class QFunc extends QArray implements IQFunc {
  debounce (func: QFnAnyArgs, delay: number, immediate?: boolean): QFnAnyArgs {
    let timer: number | null = null;
    let isInvoke = false; // 是否激活了立即执行
    let oldImmediateTs = 0;

    const _debounce = function (...args: unknown[]) {
      if (oldImmediateTs && (Date.now() - oldImmediateTs) > delay) // 距离上次立即执行已经超过了 delay，则将其置为 false，允许其能够立即执行
        isInvoke = false;

      if (immediate && !isInvoke) {
        timer && window.clearTimeout(timer);
        timer = null;
        isInvoke = true;  // 已经立即执行, 阻止下次触发的立即执行
        oldImmediateTs = Date.now();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore 忽略 this
        // eslint-disable-next-line no-invalid-this
        func.apply(this, args);
        return;
      }

      oldImmediateTs = 0;
      timer && window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        timer && window.clearTimeout(timer);
        timer = null;
        isInvoke = false; // 将 isInvoke 设置回 false，让其能继续立即执行
        oldImmediateTs = 0;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore 忽略 this
        // eslint-disable-next-line no-invalid-this
        func.apply(this, args);
      }, delay);
    };

    /** 取消功能 */
    _debounce.cancel = function () {
      timer && window.clearTimeout(timer);
      timer = null;
      isInvoke = false;
      oldImmediateTs = 0;
    };

    return _debounce;
  }

  throttle (func: QFnAnyArgs, delay: number, trailing?: boolean): QFnAnyArgs {
    let timer: number | null = null;
    let lastCallTs = 0;

    const _throttle = function (...args: unknown[]) {
      const now = Date.now();
      const remaining = delay - (now - lastCallTs); // 计算剩余时间
      if (remaining <= 0 || remaining > delay) { // 如果剩余时间小于等于 0 或者大于延迟时间，则立即执行函数【remaining > delay 是为了处理一些特殊情况，比如系统时间发生了变化或用户手动更改了系统时间，导致时间计算出现异常。】
        timer && window.clearTimeout(timer); // 清除定时器
        timer = null;
        lastCallTs = now; // 更新上次调用时间戳
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore 忽略 this
        // eslint-disable-next-line no-invalid-this
        func.apply(this, args);
      } else if (!timer && trailing) { // 如果没有定时器且 trailing 为 true，则设置定时器
        timer = window.setTimeout(() => {
          timer = null; // 重置定时器
          lastCallTs = Date.now();
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore 忽略 this
          // eslint-disable-next-line no-invalid-this
          func.apply(this, args);
        }, remaining);
      }
    };

    /** 取消功能 */
    _throttle.cancel = function () {
      timer && window.clearTimeout(timer);
      timer = null;
      lastCallTs = 0;
    };

    return _throttle;
  }
}

export default QFunc;
