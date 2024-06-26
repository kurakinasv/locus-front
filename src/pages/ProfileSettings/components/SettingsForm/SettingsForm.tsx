import * as React from 'react';

import { Field, FieldInputProps, Form, Formik, FormikHelpers, FormikState } from 'formik';

import { Input, Button, Spacing, PhotoUpload } from 'components';
import { FieldValues, fieldsConfig, initialValues, validationSchema } from 'entities/profile';
import { useScreenType } from 'store';
import { useUserStore } from 'store/RootStore/hooks';

import s from './SettingsForm.module.scss';

type FormikRenderProps<T, Values> = {
  field: FieldInputProps<T>;
  form: FormikHelpers<Values> & FormikState<Values>;
};

type UserRequestType = {
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
};

const SettingsForm: React.FC = () => {
  const screen = useScreenType();
  const { user } = useUserStore();

  const submitHandler = async (data: UserRequestType) => {
    try {
      console.log('login', data);
      // await login(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('submit error', error.message);
        // handlePopup(error.message);
      }
    }
  };

  if (!user) {
    return null;
  }

  const updatedInitialValues: FieldValues = {
    ...initialValues,
    name: user.name || initialValues.name,
    surname: user.surname || initialValues.surname,
    username: user.username,
    email: user.email,
    photo: null,
  };

  return (
    <Formik
      initialValues={updatedInitialValues}
      onSubmit={submitHandler}
      validationSchema={validationSchema}
    >
      {({ errors, touched, getFieldProps, isSubmitting, dirty }) => (
        <Form className={s.form}>
          <Field name="photo">
            {({ field, form }: FormikRenderProps<File, FieldValues>) => (
              <PhotoUpload
                image="https://placebear.com/200/300"
                name={field.name}
                setValue={(file: File) => form.setValues({ ...form.values, photo: file })}
              />
            )}
          </Field>
          <Spacing size={3} />
          {fieldsConfig.map(({ name, ...rest }) => (
            <React.Fragment key={name}>
              <Field name={name}>
                {({ field }: FormikRenderProps<string, FieldValues>) => (
                  <Input
                    {...field}
                    {...rest}
                    touched={touched[name]}
                    errorMessage={errors[name]}
                    {...getFieldProps(name)}
                  />
                )}
              </Field>
              <Spacing size={1.5} />
            </React.Fragment>
          ))}
          <Spacing size={3} />
          <Button
            type="submit"
            disabled={isSubmitting || !dirty}
            loading={isSubmitting}
            stretched={screen === 'mobile'}
          >
            Сохранить изменения
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default SettingsForm;
