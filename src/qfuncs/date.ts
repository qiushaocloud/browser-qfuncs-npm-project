/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import QCompare from './compare';
import {IQDate} from './qfuncs.i';

class QDate extends QCompare implements IQDate {
  getCurrDateSec (date?: string | number | Date): number {
    return Math.floor((date === undefined ? Date.now() : this._generateDate(date).getTime()) / 1000);
  }

  toDateSec (dateMsec: number): number {
    return Math.floor(dateMsec / 1000);
  }

  /** 获取当前格式化的日期，格式为：YYYY-MM-DD */
  getCurrFormatDay (date?: string | number | Date): string {
    date = this._generateDate(date);
    const year = date.getFullYear();
    let month: string | number = date.getMonth() + 1;
    let day: string | number = date.getDate();
    if (month < 10)
      month = '0' + month;
    if (day < 10)
      day = '0' + day;

    return year + '-' + month + '-' + day;
  }

  /** 获取当前格式化的时间，格式为：YYYY-MM-DD HH:mm:ss.sss ｜ YYYY-MM-DD HH:mm:ss */
  getCurrFormatTime (date?: string | number | Date, isGetMs?: boolean | undefined): string {
    date = this._generateDate(date);
    const year = date.getFullYear();
    let month: string | number = date.getMonth() + 1;
    let day: string | number = date.getDate();
    let hours: string | number = date.getHours();
    let minutes: string | number = date.getMinutes();
    let seconds: string | number = date.getSeconds();

    if (month < 10)
      month = '0' + month;
    if (day < 10)
      day = '0' + day;
    if (hours < 10)
      hours = '0' + hours;
    if (minutes < 10)
      minutes = '0' + minutes;
    if (seconds < 10)
      seconds = '0' + seconds;
    if (isGetMs) {
      let milliseconds: string | number = date.getMilliseconds();

      if (milliseconds < 10)
        milliseconds = '00' + milliseconds;
      else if (milliseconds < 100)
        milliseconds = '0' + milliseconds;
      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
    }
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
  }

  private _generateDate (date?: string | number | Date): Date {
    try {
      if (!date || typeof date === 'number' || typeof date === 'string') {
        if (typeof date === 'number') {
          date = new Date(date);
        } else if (typeof date === 'string') {
          const tsNum = Number(date);
          if (this.isNumber(tsNum))
            date = new Date(date);
          else
            date = new Date(date);
        } else {
          date = new Date();
        }
      }

      return date;
    } catch (err) {
      return new Date();
    }
  }
}

export default QDate;