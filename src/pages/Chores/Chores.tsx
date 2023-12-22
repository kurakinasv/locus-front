import { FC, ReactNode, useMemo } from 'react';

import { tabs } from 'config/chores';
import { Button, Spacing, Tabs } from 'components';
import { noop } from 'utils';

import Icon from 'img/icons/logo-icon-alt.svg?react';
import { ChoresTab, Schedule } from './components';

import s from './Chores.module.scss';

const Chores: FC = () => {
  const tabsContent: Array<{ value: string; content: ReactNode }> = useMemo(
    () => [
      { content: <Schedule />, value: 'schedule' },
      { content: <ChoresTab />, value: 'chores' },
    ],
    []
  );

  return (
    <div>
      <Spacing size={50} />
      <div className={s.buttons}>
        <Button icon={<Icon />} stretched onClick={noop}>
          Запланировать задачу
        </Button>
        <Spacing size={16} horizontal />
        <Button icon={<Icon />} stretched onClick={noop}>
          Создать задачу
        </Button>
      </div>
      <Spacing size={50} />
      <div className={s.tabsWrapper}>
        <Tabs tabOptions={tabs} tabsContent={tabsContent} />
      </div>
    </div>
  );
};

export default Chores;
