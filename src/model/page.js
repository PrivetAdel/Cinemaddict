import Observer from '../utils/observer';
import {PageMode} from '../const';

export default class Page extends Observer {
  constructor() {
    super();
    this._activePageMode = PageMode.FILMS;
  }

  setMode(updateType, pageMode) {
    this._activePageMode = pageMode;
    this._notify(updateType, pageMode);
  }

  getMode() {
    return this._activePageMode;
  }
}
