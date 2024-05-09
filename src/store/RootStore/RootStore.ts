import { makeAutoObservable } from 'mobx';

import AuthStore from 'store/AuthStore';
import ChoresStore from 'store/ChoresStore';
import GroupStore from 'store/GroupStore';
import UIStore from 'store/UIStore';
import UserStore from 'store/UserStore';

class RootStore {
  readonly uiStore: UIStore;

  readonly authStore: AuthStore;
  readonly userStore: UserStore;
  readonly groupStore: GroupStore;
  readonly choresStore: ChoresStore;

  readonly isDev: boolean;

  constructor() {
    makeAutoObservable(this);

    this.isDev = import.meta.env.DEV;

    this.uiStore = new UIStore();

    this.authStore = new AuthStore(this);
    this.userStore = new UserStore(this);
    this.groupStore = new GroupStore(this);
    this.choresStore = new ChoresStore(this);
  }
}

export default RootStore;
