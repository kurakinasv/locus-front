import axios from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';

import { ENDPOINTS } from 'config/api';
import { SnackbarType } from 'config/snackbar';
import { User } from 'entities/user';
import { UserServer } from 'entities/user/server';
import { UserModel } from 'store/models/UserModel';
import RootStore from 'store/RootStore';
import { getErrorMsg } from 'utils/getErrorMsg';
import { responseIsOk } from 'utils/responseIsOk';

class UserStore {
  private readonly _rootStore: RootStore;

  user: UserModel | null = null;
  inGroup = false;
  userDebtInGroup: number | null = null;

  constructor(rootStore: RootStore) {
    this._rootStore = rootStore;

    makeAutoObservable(this);
  }

  get userDebt() {
    // todo: add logic
    return this.userDebtInGroup;
  }

  setUser(user: User | null) {
    this.user = user ? new UserModel(user) : null;
  }

  setInGroup = (inGroup: boolean) => {
    this.inGroup = inGroup;
  };

  getUser = async () => {
    try {
      const response = await axios.get<UserServer>(ENDPOINTS.getUser.url, {
        withCredentials: true,
      });

      if (responseIsOk(response)) {
        this.setUser(response.data);

        await this.getUserDebtInGroup();

        return;
      }

      this._rootStore.uiStore.snackbar.open(SnackbarType.error);
    } catch (error) {
      this._rootStore.uiStore.snackbar.openError(getErrorMsg(error));
    }
  };

  getUserDebtInGroup = async () => {
    try {
      const usersDebts = await this._rootStore.groupMemberStore.getGroupUserExpenses();

      if (!usersDebts) {
        return;
      }

      if (!usersDebts.length) {
        runInAction(() => {
          this.userDebtInGroup = 0;
        });
        return;
      }

      const userExpensesDebts = Object.entries(usersDebts).find(
        ([userId]) => userId === this.user?.id
      );

      if (!userExpensesDebts) {
        runInAction(() => {
          this.userDebtInGroup = 0;
        });
        return;
      }

      const debt = Object.values(userExpensesDebts[1]).reduce((debt, amount) => debt + amount, 0);

      runInAction(() => {
        this.userDebtInGroup = debt;
      });
    } catch (error) {
      this._rootStore.uiStore.snackbar.openError(getErrorMsg(error));
    }
  };

  deleteAccount = async () => {
    try {
      const response = await axios.post(ENDPOINTS.deleteAccount.url, {}, { withCredentials: true });

      if (responseIsOk(response)) {
        this._rootStore.authStore.setAuth(false);
        this._rootStore.userStore.setInGroup(false);
        this.setUser(null);

        return;
      }

      this._rootStore.uiStore.snackbar.open(SnackbarType.error);
    } catch (error) {
      this._rootStore.uiStore.snackbar.openError(getErrorMsg(error));
    }
  };
}

export default UserStore;
