import { makeAutoObservable } from 'mobx';

class MetaModel {
  loading: boolean = false;
  error: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  startLoading = () => {
    this.loading = true;
  };

  stopLoading = () => {
    this.loading = false;
  };

  setIsError = (error: boolean) => {
    this.error = error;
  };
}

export default MetaModel;
