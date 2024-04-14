import React, { FC, useState } from 'react';

import cn from 'classnames';

import { Input, Dropdown, Spacing } from 'components';
import { mockOptions } from 'config/mock/options';
import { MOCK_SCHEDULE_LIST } from 'entities/mock/schedule';
import { useScreenType } from 'store';

import { ScheduleItem } from '..';

import s from './ChoresTab.module.scss';

const ChoresTab: FC = () => {
  const screen = useScreenType();
  const isMobile = screen === 'mobile';

  const [search, setSearch] = useState('');

  return (
    <div>
      <div className={cn(s.controls, isMobile && s.controls_mobile)}>
        <Input
          placeholder="Поиск по названию"
          value={search}
          onChange={(v) => setSearch(v.currentTarget.value)}
        />
        <Spacing size={1.6} horizontal={!isMobile} className={s.spacing} />
        <Dropdown options={mockOptions} placeholder="Категория" stretched={isMobile} />
      </div>

      <Spacing size={2.6} />
      {MOCK_SCHEDULE_LIST.map((schedule) => (
        <React.Fragment key={schedule.id}>
          <ScheduleItem
            key={schedule.id}
            hideCheckbox
            name={schedule.chore.name}
            category={schedule.chore.category.name}
          />
          <Spacing size={1} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default ChoresTab;
