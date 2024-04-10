/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {IQMethods} from './qfuncs.i';
import QArray from './array';

class QMethods extends QArray implements IQMethods {
  sleep (ts: number): Promise<void> {
    return new Promise((resolve)=>{
      setTimeout(()=>{
        resolve();
      }, ts);
    });
  }

  randomRangeValues (start: number, end: number, count = 1): number[] {
    const arr: number[] = [];
    const result: number[] = [];
    if (!count) result;

    for (let i = start; i <= end; i++) {
      arr.push(i);
    }

    if (count >= arr.length) return arr;

    for (let i = 0; i < count; i++) {
      if (!arr.length) break;
      const randomArrIndex = Math.floor(Math.random() * 100000) % arr.length;
      const randomItem = arr[randomArrIndex];
      arr.splice(randomArrIndex, 1);
      result.push(randomItem);
    }

    return result;
  }

  generateUuid (): string {
    const s: any[] = [];
    const hexDigits = '0123456789abcdef';

    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = '-';
    s[13] = '-';
    s[18] = '-';
    s[23] = '-';

    return s.join('');
  }

  generateRandomNumberId (): number {
    return Math.floor(100000000000000000 + Math.random() * 900000000000000000);
  }

  generateRandomId (isUseNumAndDate?: boolean): string {
    if (isUseNumAndDate)
      return Math.floor(100000000000000000 + Math.random() * 900000000000000000) + '_' + Date.now();

    return this.generateUuid().replace(/-/g, '');
  }

  formatError (error: string | (Error & QJson)): QJson {
    try {
      if (typeof error === 'string') return {message: error};

      const errResData: QJson = {};

      error.name !== undefined && (errResData.name = error.name);
      error.message !== undefined && (errResData.message = error.message);
      error.code !== undefined && (errResData.code = error.code);
      error.errno !== undefined && (errResData.errno = error.errno);
      error.error !== undefined && (errResData.error = error.error);
      error.description !== undefined && (errResData.description = error.description);

      if (error && error.response && error.response.status !== 404) {
        const responseData = error.response.data;

        Object.assign(errResData, {
          responseData: responseData,
          responseStatus: error.response.status,
          statusText: error.response.statusText,
          responseHeaders: error.response.responseHeaders
        });
      }
      return errResData;
    } catch (catCherr) {
      return {catcherr: catCherr, error: error};
    }
  }

  debounce (func: QFnAnyArgs, delay: number, immediate?: boolean): QFnAnyArgs {
    let timer: number | null = null;
    let isInvoke = false; // 是否激活了立即执行
    let oldImmediateTs = 0;

    const _debounce = function (...args: unknown[]) {
      if (oldImmediateTs && (Date.now() - oldImmediateTs) > delay) // 距离上次立即执行已经超过了 delay，则将其置为 false，允许其能够立即执行
        isInvoke = false;

      if (immediate && !isInvoke) {
        timer && clearTimeout(timer);
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
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        timer && clearTimeout(timer);
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
      timer && clearTimeout(timer);
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

export {QMethods};

window.qFuncs = new QMethods();
export default window.qFuncs;