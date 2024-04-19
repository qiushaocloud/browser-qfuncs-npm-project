/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import QDom from './dom';
import {IBrowserInfo, IQBrowser} from './qfuncs.i';

class QBrowser extends QDom implements IQBrowser {
  getLocalStorageItem (key: string): string | null {
    return window.localStorage.getItem(key);
  }
  setLocalStorageItem (key: string, value: string): void {
    window.localStorage.setItem(key, value);
  }
  removeLocalStorageItem (key: string): void {
    window.localStorage.removeItem(key);
  }
  clearLocalStorage (): void {
    window.localStorage.clear();
  }

  getSessionStorageItem (key: string): string | null {
    return window.sessionStorage.getItem(key);
  }
  setSessionStorageItem (key: string, value: string): void {
    window.sessionStorage.setItem(key, value);
  }
  removeSessionStorageItem (key: string): void {
    window.sessionStorage.removeItem(key);
  }
  clearSessionStorage (): void {
    window.sessionStorage.clear();
  }

  getLocationParams (): QJsonT<string> {
    const url = window.location.href;
    const params = new URLSearchParams(url);
    const result: QJsonT<string> = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  getLocationParam (key: string): string | null {
    const url = window.location.href;
    const params = new URLSearchParams(url);
    return params.get(key) || null;
  }
  getLocationParamNumber (key: string): number | null {
    const value = this.getLocationParam(key);
    if (value === null) {
      return null;
    }
    return isNaN(value as any) ? null : Number(value);
  }
  getLocationParamBoolean (key: string): boolean | null {
    const value = this.getLocationParam(key);
    if (value === null) {
      return null;
    }
    return value.toLowerCase() === 'true' || value.toLowerCase() === '1';
  }
  getLocationParamJson (key: string): QJson | null {
    const value = this.getLocationParam(key);
    if (value === null) {
      return null;
    }
    try {
      return JSON.parse(value) as QJson;
    } catch (e) {
      return null;
    }
  }
  getLocationParamArray<T=any> (key: string): T[] | null {
    const value = this.getLocationParam(key);
    if (value === null) {
      return null;
    }

    if (/^\[\]$/.test(value)) {
      try {
        const arr = JSON.parse(value) as T[];
        return Array.isArray(arr) ? arr : null;
      } catch (e) {
        return null;
      }
    }

    return value.split(',') as T[];
  }

  getBrowserInfo (): IBrowserInfo {
    throw new Error('Method not implemented.');
  }
  getDetectOS (): string {
    throw new Error('Method not implemented.');
  }
  getDeviceModel (): string {
    throw new Error('Method not implemented.');
  }
  getBrowserName (): string {
    throw new Error('Method not implemented.');
  }
  getBrowserVersion (): string {
    throw new Error('Method not implemented.');
  }
  isMobile (): boolean {
    throw new Error('Method not implemented.');
  }
  isWechatBrowser (): boolean {
    throw new Error('Method not implemented.');
  }
  getBrowserKernelName (): string {
    throw new Error('Method not implemented.');
  }
  getBrowserKernelVersion (): string {
    throw new Error('Method not implemented.');
  }
}

export default QBrowser;