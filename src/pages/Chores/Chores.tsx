import { FC, ReactNode, useEffect, useMemo, useState } from 'react';

import { observer } from 'mobx-react-lite';

import { Button, Spacing, Tabs } from 'components';
import { ModalEnum } from 'components/modals';
import { tabs } from 'config/chores';
import { useScreenType } from 'store';
import {
  useChoreCategoriesStore,
  useChoresStore,
  useSchedulesStore,
  useUIStore,
} from 'store/RootStore/hooks';

import CalendarIcon from 'img/icons/calendar.svg?react';
import PlusIcon from 'img/icons/plus.svg?react';

import { ChoresTab, ScheduleTab } from './components';

import s from './Chores.module.scss';

const Chores: FC = () => {
  const { openModal: open } = useUIStore();

  const screen = useScreenType();
  const isDesktop = screen === 'desktop';

  const { getChoresInGroup } = useChoresStore();
  const { getCategories } = useChoreCategoriesStore();
  const { getGroupSchedules, getScheduledTasks } = useSchedulesStore();

  const [tabsLoading, setTabsLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      setTabsLoading(true);

      await getCategories();
      await getGroupSchedules();
      await getScheduledTasks();

      setTabsLoading(false);

      await getChoresInGroup();
    };

    init();
  }, []);

  const tabsContent: Array<{ value: string; content: ReactNode }> = useMemo(
    () => [
      { content: <ScheduleTab />, value: 'schedule' },
      { content: <ChoresTab />, value: 'chores' },
    ],
    []
  );

  const openModal = (modal: ModalEnum) => () => {
    open(modal);
  };

  return (
    <>
      <div className={s.buttons}>
        <Button
          icon={<CalendarIcon />}
          stretched
          onClick={openModal(ModalEnum.addSchedule)}
          opensModal
        >
          Запланировать задачу
        </Button>
        <Spacing size={isDesktop ? 1.6 : 0.8} horizontal={isDesktop} stretched />
        <Button icon={<PlusIcon />} stretched onClick={openModal(ModalEnum.addChore)} opensModal>
          Создать задачу
        </Button>
      </div>
      <Spacing size={2.4} />
      <div className={s.tabsWrapper}>
        <Tabs tabOptions={tabs} tabsContent={tabsContent} loading={tabsLoading} />
      </div>
    </>
  );
};

export default observer(Chores);
