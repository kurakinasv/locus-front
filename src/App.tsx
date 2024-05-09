import { useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { Router } from 'pages';
import RootStoreProvider from 'store/RootStore/context';
import { useAuthStore } from 'store/RootStore/hooks';

import 'swiper/css';

import 'styles/global.scss';

const App = () => {
  const { checkAuth, isAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [isAuth]);

  return (
    <RootStoreProvider>
      <Router />
    </RootStoreProvider>
  );
};

export default observer(App);
