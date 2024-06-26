import * as React from 'react';

import { Avatar, Button, Spacing } from 'components';
import { SizeEnum } from 'typings/ui';

import s from './PhotoUpload.module.scss';

type Props = {
  image?: string;
  stub?: React.ReactNode;
  name?: string;
  setValue?: (value: File) => void;
};

const PhotoUpload: React.FC<Props> = ({ image, stub, name, setValue }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const uploadPhoto = () => {
    inputRef.current?.click();
  };

  // todo: check image size and formats
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      return;
    }
    setValue?.(files[0]);
  };

  return (
    <div className={s.photo}>
      <Avatar image={image} stub={stub} />
      <Spacing size={1.2} />
      <Button size={SizeEnum.s} type="button" onClick={uploadPhoto}>
        Загрузить фото
      </Button>
      <input type="file" name={name} hidden ref={inputRef} onChange={onFileChange} />
    </div>
  );
};

export default PhotoUpload;
