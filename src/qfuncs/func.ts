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

  throttle (func: QFnAnyArgs, delay: number): QFnAnyArgs {
    let lstCallTs = 0;

    return function (...args: unknown[]) {
      const now = Date.now();
      if (now - lstCallTs >= delay) {
        lstCallTs = now;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore 忽略 this
        // eslint-disable-next-line no-invalid-this
        func.apply(this, args);
      }
    };
  }
}

export default QFunc;
