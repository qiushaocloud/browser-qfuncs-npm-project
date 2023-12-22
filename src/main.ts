// eslint-disable-next-line spaced-comment, @typescript-eslint/triple-slash-reference

import {IQMethods} from '@src/qfuncs/qfuncs.i';
import qFuncs, {QMethods} from '@src/qfuncs/index';
import CustomEventManager, {moduleEventInstance, ICustomEventManager} from '@common/custom-event-manager';
import {VERSIONS, VERSIONSTIME} from '@enum/version';

export {
  ICustomEventManager,
  IQMethods
};

export {
  moduleEventInstance,
  CustomEventManager,
  QMethods,
  qFuncs,
  VERSIONS,
  VERSIONSTIME
};

export default qFuncs;