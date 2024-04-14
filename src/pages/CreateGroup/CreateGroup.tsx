import * as React from 'react';

import { useNavigate } from 'react-router-dom';

import { Button, ButtonTheme, Input, Spacing, Title } from 'components';
import { useUserStore } from 'store/RootStore/hooks';

import ArrowSVG from 'img/icons/arrow-left.svg?react';

import s from './CreateGroup.module.scss';

const CreateGroup: React.FC = () => {
  const { enterGroup } = useUserStore();
  const nav = useNavigate();

  const goBack = () => {
    nav(-1);
  };

  const [value, setValue] = React.useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  return (
    <div className={s.wrapper}>
      <Title size="h1">Создать Группу</Title>
      <Spacing size={4} />
      <Input placeholder="Название" value={value} onChange={onChange} />
      <Spacing size={5.2} />
      <div className={s.buttons}>
        <Button theme={ButtonTheme.outlined} onClick={goBack} icon={<ArrowSVG />}>
          Назад
        </Button>
        <Spacing size={1} horizontal />
        <Button onClick={enterGroup} disabled={!value}>
          Создать
        </Button>
      </div>
    </div>
  );
};

export default CreateGroup;