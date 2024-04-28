import {IQTimer} from './qfuncs.i';
import QFunc from './func';

interface ISetIntervalTimerObjItem{
    queue: Set<string>;
    timer: number | void;
}

interface ISetIntervalCallbackItem{
    intervalTs: number;
    callback: QFnEmptyArgs | void;
}

class QTimer extends QFunc implements IQTimer {
    private _setIntervalTimerObj: QJsonNumberT<ISetIntervalTimerObjItem> = {};
    private _setIntervalCallback: QJsonT<ISetIntervalCallbackItem> = {};

    sleep (ts: number): Promise<void> {
      return new Promise((resolve)=>{
        setTimeout(()=>{
          resolve();
        }, ts);
      });
    }

    addIntervalQueue (queueId: string, callback: QFnEmptyArgs, intervalTs: number): void {
      if (this._setIntervalCallback[queueId] && this._setIntervalCallback[queueId].intervalTs !== intervalTs) {
        this.removeIntervalQueue(queueId);
      }
      if (!this._setIntervalCallback[queueId]) {
        this._setIntervalCallback[queueId] = {
          intervalTs,
          callback
        };
      }

      let _setIntervalTimerObjTmp = this._setIntervalTimerObj[intervalTs];
      if (!_setIntervalTimerObjTmp) {
        _setIntervalTimerObjTmp = {queue: new Set(), timer: undefined};
        this._setIntervalTimerObj[intervalTs] = _setIntervalTimerObjTmp;
      }

      if (!_setIntervalTimerObjTmp.queue.has(queueId))
        _setIntervalTimerObjTmp.queue.add(queueId);

      if (!_setIntervalTimerObjTmp.timer) {
        const timer = setInterval(()=>{
          const _setIntervalTimerObjTmp2 = this._setIntervalTimerObj[intervalTs];
          if (!_setIntervalTimerObjTmp2) {
            clearInterval(timer);
            return;
          }

          const queueTmp = _setIntervalTimerObjTmp2.queue;
          if (queueTmp && queueTmp.size) {
            queueTmp.forEach((item) => {
              const onCbItem = this._setIntervalCallback[item] ? this._setIntervalCallback[item].callback : undefined;
              onCbItem && onCbItem();
            });
          }
        }, intervalTs);
        _setIntervalTimerObjTmp.timer = timer;
      }
    }

    removeIntervalQueue (queueId: string): void {
      if (this._setIntervalCallback[queueId]) {
        const {intervalTs} = this._setIntervalCallback[queueId];

        const _setIntervalTimerObjTmp = this._setIntervalTimerObj[intervalTs];
        if (_setIntervalTimerObjTmp) {
          if (_setIntervalTimerObjTmp.queue.has(queueId)) {
            _setIntervalTimerObjTmp.queue.delete(queueId);
          }

          if (!_setIntervalTimerObjTmp.queue.size) {
            _setIntervalTimerObjTmp.timer && clearInterval(_setIntervalTimerObjTmp.timer);
            _setIntervalTimerObjTmp.timer = undefined;
            delete this._setIntervalTimerObj[intervalTs];
          }
        }
      }

      delete this._setIntervalCallback[queueId];
    }

    hasIntervalQueue (queueId: string): boolean {
      return !!this._setIntervalCallback[queueId];
    }

    getAllIntervalQueueIds (): string[] {
      return Object.keys(this._setIntervalCallback);
    }

}

export default QTimer;