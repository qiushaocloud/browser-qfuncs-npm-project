/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import QObject from './object';
import {IQArray} from './qfuncs.i';

class QArray extends QObject implements IQArray {
  isArrayIncludes<T=any> (arr: T[], searchElement: T, fromIndex?: number, isSimpleCompare?: boolean): boolean {
    if (typeof searchElement === 'string' || typeof searchElement === 'number' || typeof searchElement === 'boolean') {
      return arr.includes(searchElement, fromIndex);
    }

    let isIncludes = false;
    let findStartIndex = 0;
    if (fromIndex !== undefined)
      findStartIndex = fromIndex >= 0 ? fromIndex : arr.length + fromIndex;

    for (let i = findStartIndex, len = arr.length; i < len; i++) {
      if (this.isEqualAnyValue(arr[i], searchElement, isSimpleCompare)) {
        isIncludes = true;
        break;
      }
    }

    return isIncludes;
  }

  arrayIndexOf<T=any> (arr: T[], searchElement: T, fromIndex?: number, isSimpleCompare?: boolean): number {
    if (typeof searchElement === 'string' || typeof searchElement === 'number' || typeof searchElement === 'boolean') {
      return arr.indexOf(searchElement, fromIndex);
    }

    let includesIndex = -1;
    let findStartIndex = 0;
    if (fromIndex !== undefined)
      findStartIndex = fromIndex >= 0 ? fromIndex : arr.length + fromIndex;

    for (let i = findStartIndex, len = arr.length; i < len; i++) {
      if (this.isEqualAnyValue(arr[i], searchElement, isSimpleCompare)) {
        includesIndex = i;
        break;
      }
    }

    return includesIndex;
  }

  removeArrayItem<T=any> (arr: T[], removeItem: T, count = 0, isSimpleCompare?: boolean): number[] {
    const removeItemIndexs = this._findArrayItemIndexs<T>(arr, removeItem, count, undefined, isSimpleCompare).sort((item1, item2)=>{
      return item1 > item2 ? -1 : 1;
    });

    for (const removeItemIndex of removeItemIndexs) {
      arr.splice(removeItemIndex, 1);
    }
    return removeItemIndexs;
  }

  removeArrayItems<T=any> (arr: T[], removeItems: T[] | T, count = 0, isSimpleCompare?: boolean): number[] {
    if (!Array.isArray(removeItems))
      return this.removeArrayItem(arr, removeItems, count, isSimpleCompare);

    if (!removeItems.length)
      return [];

    if (removeItems.length === 1)
      return this.removeArrayItem(arr, removeItems[0], count, isSimpleCompare);

    const removeItemIndexs = this._findArrayItemIndexs<T>(arr, removeItems, count, true, isSimpleCompare).sort((item1, item2)=>{
      return item1 > item2 ? -1 : 1;
    });

    for (const removeItemIndex of removeItemIndexs) {
      arr.splice(removeItemIndex, 1);
    }
    return removeItemIndexs;
  }

  removeArrayItemsByIndexs<T=any> (arr: T[], removeIndexs: number[] | number): void {
    if (this.isNullOrUndefined(removeIndexs)) return;

    if (!Array.isArray(removeIndexs)) {
      arr.splice(removeIndexs, 1);
      return;
    }

    if (!removeIndexs.length) return;

    const sortRemoveIndexs = removeIndexs.sort((item1, item2)=>{
      return item1 > item2 ? -1 : 1;
    });

    for (const removeItemIndex of sortRemoveIndexs) {
      arr.splice(removeItemIndex, 1);
    }
  }

  batchArrayPop<T=any> (arr: T[], count?: number): T[] {
    const result: T[] = [];
    if (!count) count = 1;
    for (let i = 0; i < count; i++) {
      if (arr.length === 0) break;
      result.push(arr.pop() as T);
    }
    return result;
  }

  batchArrayShift<T=any> (arr: T[], count?: number): T[] {
    const result: T[] = [];
    if (!count) count = 1;
    for (let i = 0; i < count; i++) {
      if (arr.length === 0) break;
      result.push(arr.shift() as T);
    }
    return result;
  }

  findArrayItem<T=any> (arr: T[], findItem: T, count = 0, isSimpleCompare?: boolean): number[] {
    const removeItemIndexs = this._findArrayItemIndexs<T>(arr, findItem, count, undefined, isSimpleCompare);
    return removeItemIndexs;
  }

  findArrayItems<T=any> (arr: T[], findItems: T[], count = 0, isSimpleCompare?: boolean): number[] {
    const removeItemIndexs = this._findArrayItemIndexs<T>(arr, findItems, count, true, isSimpleCompare);
    return removeItemIndexs;
  }

  findArrayItemsByConditions<T=any> (arr: T[], conditionsFn: (item:T) => boolean): {[itemIndex: number]: T} {
    const findItems: {[itemIndex: number]: T} = {};

    for (let i = 0, len = arr.length; i < len; i++) {
      const isFind = conditionsFn(arr[i]);
      isFind && (findItems[i] = arr[i]);
    }

    return findItems;
  }

  removeArrayItemsByConditions<T=any> (arr: T[], conditionsFn: (item:T) => boolean): {removeItemIndexs: number[], removeItems: T[]} {
    const removeItemIndexs: number[] = [];
    const removeItems: T[] = [];

    for (let i = arr.length - 1; i >= 0; i--) {
      const isRemove = conditionsFn(arr[i]);
      if (isRemove) {
        removeItemIndexs.push(i);
        removeItems.push(...arr.splice(i, 1));
      }
    }

    removeItemIndexs.reverse();
    removeItems.reverse();

    return {removeItemIndexs, removeItems};
  }

  isArrayIncludesByConditions<T=any> (arr: T[], conditionsFn: (item:T) => boolean): boolean {
    for (const item of arr) {
      if (conditionsFn(item))
        return true;
    }
    return false;
  }

  uniqueArray<T=any> (arr: T[], isSimpleCompare?: boolean): void {
    for (let i = 0; i < arr.length; i++) {
      for (let j = arr.length - 1; j > i; j--) {
        if (this.isEqualAnyValue(arr[i], arr[j], isSimpleCompare)) {
          arr.splice(j, 1);
        }
      }
    }
  }

  uniqueNewArray<T=any> (arr: T[], isSimpleCompare?: boolean): T[] {
    if (isSimpleCompare)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return [...new Set<T>(arr)];

    const newArr: T[] = [...arr];
    for (let i = 0; i < newArr.length; i++) {
      for (let j = newArr.length - 1; j > i; j--) {
        if (this.isEqualAnyValue(newArr[i], newArr[j])) {
          newArr.splice(j, 1);
        }
      }
    }
    return newArr;
  }

  uniqueArrayByRule<T=any> (arr: T[], rule = 1, isSimpleCompare?: boolean): number[] {
    const removeItemIndexs: number[] = [];

    if (rule === 1) {
      for (let i = 0, len = arr.length; i < len; i++) {
        for (let j = arr.length - 1; j > i; j--) {
          if (this.isEqualAnyValue(arr[i], arr[j], isSimpleCompare)) {
            !removeItemIndexs.includes(j) && removeItemIndexs.push(j);
          }
        }
      }
    } else {
      for (let i = arr.length - 1; i >= 0; i--) {
        for (let j = i - 1; j >= 0; j--) {
          if (this.isEqualAnyValue(arr[i], arr[j], isSimpleCompare)) {
            !removeItemIndexs.includes(j) && removeItemIndexs.push(j);
          }
        }
      }
    }

    removeItemIndexs.sort((item1, item2)=>{
      return item1 > item2 ? -1 : 1;
    });

    for (const removeItemIndex of removeItemIndexs)
      arr.splice(removeItemIndex, 1);

    return removeItemIndexs;
  }

  convertSet2Arr<T=any> (set: Set<T>): T[] {
    return Array.from(set);
  }

  diffUniqueArrayItems (arr1: any[], arr2: any[], isSimpleCompare?: boolean): {more: any[], less: any[]} {
    const uniqueArr1 = this.uniqueNewArray(arr1, isSimpleCompare);
    const uniqueArr2 = this.uniqueNewArray(arr2, isSimpleCompare);

    const more: any[] = [];
    const less: any[] = [];

    for (let i = uniqueArr1.length - 1; i >= 0; i--) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const item1 = uniqueArr1[i];
      const item2Index = this.arrayIndexOf<any>(uniqueArr2, item1, undefined, isSimpleCompare);

      if (item2Index !== -1) { // arr1 和 arr2 都有
        uniqueArr2.splice(item2Index, 1);
        uniqueArr1.splice(i, 1);
        continue;
      }

      // arr1 有但是 arr2 没有
      less.push(item1);
    }

    // uniqueArr2 已经删除了 arr1 中有的
    more.push(...uniqueArr2);

    return {more, less};
  }

  private _findArrayItemIndexs<T=any> (
    arr: T[],
    findItem: T | T[],
    count = 0,
    isItems?: boolean,
    isSimpleCompare?: boolean
  ): number[] {
    const arrItemIndexs: number[] = [];
    let findCount = 0;
    const findCountObj: Record<number, number> = {};
    let findCountObjSum = 0;

    if (isItems && Array.isArray(findItem) && findItem.length <= 0) {
      return arrItemIndexs;
    }

    const countAbs = Math.abs(count);

    if (count < 0) {
      for (let i = arr.length - 1; i >= 0; i--) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const itemTmp = arr[i];

        if (isItems && Array.isArray(findItem)) {
          if (findItem.length === 1) {
            if (this.isEqualAnyValue(itemTmp, findItem[0], isSimpleCompare)) {
              arrItemIndexs.push(i);
              findCount++;
              if (countAbs > 0 && findCount >= countAbs)
                break;
            }
          } else {
            const includesIndex = this.arrayIndexOf(findItem, itemTmp, undefined, isSimpleCompare);
            if (includesIndex !== -1) {
              if (countAbs > 0) {
                findCountObj[includesIndex] === undefined && (findCountObj[includesIndex] = 0);
                if (findCountObj[includesIndex] >= countAbs)
                  continue;

                arrItemIndexs.push(i);
                findCountObj[includesIndex]++;
                findCountObjSum++;
                if (findCountObjSum >= (countAbs * findItem.length))
                  break;

                continue;
              }

              arrItemIndexs.push(i);
            }
          }
        } else if (this.isEqualAnyValue(itemTmp, findItem, isSimpleCompare)) {
          arrItemIndexs.push(i);
          findCount++;
          if (countAbs > 0 && findCount >= countAbs)
            break;
        }
      }

      return arrItemIndexs;
    }

    for (let i = 0, len = arr.length; i < len; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const itemTmp = arr[i];

      if (isItems && Array.isArray(findItem)) {
        if (findItem.length === 1) {
          if (this.isEqualAnyValue(itemTmp, findItem[0], isSimpleCompare)) {
            arrItemIndexs.push(i);
            findCount++;
            if (countAbs > 0 && findCount >= countAbs)
              break;
          }
        } else {
          const includesIndex = this.arrayIndexOf(findItem, itemTmp, undefined, isSimpleCompare);
          if (includesIndex !== -1) {
            if (countAbs > 0) {
              findCountObj[includesIndex] === undefined && (findCountObj[includesIndex] = 0);
              if (findCountObj[includesIndex] >= countAbs)
                continue;

              arrItemIndexs.push(i);
              findCountObj[includesIndex]++;
              findCountObjSum++;
              if (findCountObjSum >= (countAbs * findItem.length))
                break;

              continue;
            }

            arrItemIndexs.push(i);
          }
        }
      } else if (this.isEqualAnyValue(itemTmp, findItem, isSimpleCompare)) {
        arrItemIndexs.push(i);
        findCount++;
        if (countAbs > 0 && findCount >= countAbs)
          break;
      }
    }

    return arrItemIndexs;
  }
}

export default QArray;