import * as React from 'react';

import { observer } from 'mobx-react-lite';
import { useForm, Controller } from 'react-hook-form';

import { Button } from 'components/Button';
import { DatePickerInput } from 'components/DatePickerInput';
import { Dropdown } from 'components/Dropdown';
import { ErrorMessageLabel } from 'components/ErrorMessageLabel';
import { Spacing } from 'components/Spacing';
import { Title } from 'components/Title';
import { UsersSlider } from 'components/UsersSlider';
import { ScheduleFrequency, scheduleFrequencyOptions } from 'config/chores';
import { VALIDATION_MESSAGES } from 'config/form';
import { SnackbarType } from 'config/snackbar';
import { FormFields, createScheduleMap, dateLabel, rangeDateLabel } from 'entities/schedule/form';
import { ScheduleCreateParams } from 'entities/schedule/params';
import { User } from 'entities/user';
import {
  UsersSelectListType,
  chooseMultipleUsers,
  chooseSingleUser,
  initializeUsers,
} from 'entities/user/service';
import {
  useChoresStore,
  useGroupStore,
  useSchedulesStore,
  useUIStore,
} from 'store/RootStore/hooks';

import s from './AddSchedule.module.scss';

const AddSchedule: React.FC = () => {
  const { closeModal, snackbar } = useUIStore();

  const { group } = useGroupStore();
  const { choresOptions } = useChoresStore();
  const { createSchedule } = useSchedulesStore();

  const { handleSubmit, control, formState, watch } = useForm<FormFields>();

  const frequency: ScheduleFrequency | undefined = watch('frequency');
  const noRepeat = frequency === 'never';

  const [users, setUsers] = React.useState<UsersSelectListType>(() =>
    group?.users ? initializeUsers(group.users) : []
  );

  const onUserClick = React.useCallback(
    (id: User['id']) => () => {
      setUsers((prev) => (noRepeat ? chooseSingleUser(prev, id) : chooseMultipleUsers(prev, id)));
    },
    [noRepeat]
  );

  const onSubmit = React.useCallback(
    async (data: FormFields) => {
      if (!users.some((user) => user.selected)) {
        snackbar.open(SnackbarType.chooseOneUser);
        return;
      }

      const createParams: ScheduleCreateParams = {
        choreId: Number(data.choreId),
        frequency: data.frequency,
        dateFrom: data.frequency === 'never' ? data.date : data.range.from,
        dateTo: data.frequency === 'never' ? data.date : data.range.to,
        users: users.filter((user) => user.selected).map((user) => user.id),
      };

      const created = await createSchedule(createParams);

      if (!created) {
        return;
      }

      closeModal();
    },
    [users]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
      <div className={s.form__fields}>
        <Controller
          control={control}
          name={createScheduleMap.choreId.name}
          rules={{ required: true }}
          render={({ field }) => {
            return (
              <>
                <Dropdown
                  {...field}
                  options={choresOptions}
                  selectedOption={field.value}
                  onChange={field.onChange}
                  placeholder={
                    choresOptions.length
                      ? createScheduleMap.choreId.placeholder
                      : 'Доступных для выбора задач нет'
                  }
                  stretched
                  disabled={!choresOptions.length}
                />
                <ErrorMessageLabel
                  errors={formState.errors}
                  name={createScheduleMap.choreId.name}
                  message={VALIDATION_MESSAGES.required}
                />
              </>
            );
          }}
        />
        <Spacing size={1.4} />
        <Controller
          control={control}
          name={createScheduleMap.frequency.name}
          rules={{ required: true }}
          render={({ field }) => (
            <>
              <Dropdown
                {...field}
                options={scheduleFrequencyOptions}
                selectedOption={field.value}
                onChange={field.onChange}
                placeholder={createScheduleMap.frequency.placeholder}
                stretched
              />
              <ErrorMessageLabel
                errors={formState.errors}
                name={createScheduleMap.frequency.name}
                message={VALIDATION_MESSAGES.required}
              />
            </>
          )}
        />
        {frequency && !noRepeat && (
          <>
            <Spacing size={1.4} />
            <Controller<FormFields>
              control={control}
              name={createScheduleMap.range.name}
              rules={{ required: true }}
              render={({ field }) => (
                <DatePickerInput
                  {...field}
                  {...createScheduleMap.range}
                  mode="range"
                  range={field.value}
                  setRange={field.onChange}
                  stretched
                  label={rangeDateLabel}
                  touched
                  errorMessage={
                    formState.errors[createScheduleMap.range.name]?.type === 'required'
                      ? VALIDATION_MESSAGES.required
                      : undefined
                  }
                />
              )}
            />
          </>
        )}
        {frequency && noRepeat && (
          <>
            <Spacing size={1.4} />
            <Controller<FormFields>
              control={control}
              name={createScheduleMap.date.name}
              rules={{ required: true }}
              render={({ field }) => (
                <DatePickerInput
                  {...field}
                  {...createScheduleMap.date}
                  mode="single"
                  selectedDate={field.value}
                  setSelectedDate={field.onChange}
                  stretched
                  label={dateLabel}
                  touched
                  errorMessage={
                    formState.errors[createScheduleMap.date.name]?.type === 'required'
                      ? VALIDATION_MESSAGES.required
                      : undefined
                  }
                />
              )}
            />
          </>
        )}
        <Spacing size={1.4} />
        <div>
          <Title size="h2">Исполнители</Title>
          <Spacing size={1.4} />
          <UsersSlider users={users} onUserClick={onUserClick} />
        </div>
        <Spacing size={3} />
      </div>

      <Button
        type="submit"
        stretched
        disabled={
          !formState.isDirty || !Object.keys(formState.dirtyFields).length || formState.isSubmitting
        }
        loading={formState.isSubmitting}
      >
        Создать
      </Button>
    </form>
  );
};

export default observer(AddSchedule);
