import { FC, memo, useState } from 'react';

import cn from 'classnames';

import { Checkbox } from 'components/Checkbox';
import { ModalEnum } from 'components/modals';
import { Spacing } from 'components/Spacing';
import { Chore, ChoreCategory, choreCategoryIconsMap } from 'entities/chore';
import { ScheduleItem as ScheduleItemClient } from 'entities/schedule';
import { ScheduledTask } from 'entities/scheduledTask';
import { useScreenType } from 'store';
import { useSchedulesStore, useUIStore } from 'store/RootStore/hooks';
import { DefaultId } from 'typings/api';

import PencilIcon from 'img/icons/pencil.svg?react';
import TrashIcon from 'img/icons/trash.svg?react';

import s from './ScheduleItem.module.scss';

type ScheduleItemProps = {
  id: Chore['id'] | ScheduledTask['id'];
  scheduleId?: ScheduleItemClient['id'];
  name: Chore['name'];
  icon?: ChoreCategory['icon'];
  points?: number;
  category?: string;
  completed?: boolean;
  choreItem?: boolean;
};

const ScheduleItem: FC<ScheduleItemProps> = ({
  id,
  scheduleId,
  name,
  icon,
  points,
  category,
  completed = false,
  choreItem = false,
}) => {
  const { openModal } = useUIStore();

  const { editScheduledTask } = useSchedulesStore();

  const screen = useScreenType();
  const isMobile = screen === 'mobile';

  const [checked, setChecked] = useState(completed);

  const onItemClick = async () => {
    if (choreItem) {
      openModal<{ choreId: DefaultId }>(ModalEnum.editChore, { choreId: id });
      return;
    }

    setChecked((prev) => !prev);
    await editScheduledTask({ taskId: id, completed: !checked });
  };

  const onChoreArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal(ModalEnum.archiveChore, { choreId: id });
  };

  const onScheduleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal(ModalEnum.deleteSchedule, { scheduleId });
  };

  const onScheduleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal(ModalEnum.editSchedule, { scheduleId });
  };

  const ChoreCategoryIcon = icon ? choreCategoryIconsMap[icon] : null;

  return (
    <div className={cn(s.wrapper, checked && s.wrapper_completed)} onClick={onItemClick}>
      <div className={s.left}>
        {!choreItem && (
          <>
            <Checkbox checked={checked} onCheckedChange={onItemClick} />
            <Spacing size={1} horizontal />
          </>
        )}
        <div>
          <div className={s.name}>{name}</div>
          {choreItem && <div className={s.category}>{category}</div>}
        </div>
      </div>
      <div className={s.right}>
        <div className={s['additional-info']}>
          {choreItem && !!points && (
            <>
              <div className={s.badge}>
                {points}
                {isMobile ? '' : ' баллов'}
              </div>
              <Spacing size={isMobile ? 0.6 : 1.6} horizontal />
            </>
          )}
          {ChoreCategoryIcon && (
            <div className={s['additional-info__icon']}>
              <ChoreCategoryIcon />
            </div>
          )}
        </div>
        <Spacing size={isMobile ? 1 : 3} horizontal />
        <div className={s['common-icons']}>
          <button
            className={s['common-icons__icon']}
            type="button"
            title="Редактировать"
            onClick={!choreItem ? onScheduleEdit : undefined}
          >
            <PencilIcon />
          </button>
          <Spacing size={isMobile ? 0.6 : 2} horizontal />
          <button
            className={s['common-icons__icon']}
            type="button"
            title="Удалить"
            onClick={choreItem ? onChoreArchive : onScheduleDelete}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ScheduleItem);
