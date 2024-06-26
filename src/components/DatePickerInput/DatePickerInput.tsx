import React, {
  InputHTMLAttributes,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';

import cn from 'classnames';
import {
  DateRange,
  DayPicker,
  DaySelectionMode,
  SelectRangeEventHandler,
  SelectSingleEventHandler,
} from 'react-day-picker';

import { Input } from 'components/Input';
import { useClickOutside } from 'hooks/useClickOutside';
import { PropsWithClassName } from 'typings/props';

import CalendarIcon from 'img/icons/calendar.svg?react';

import { Footer } from './Footer';

import s from './DatePickerInput.module.scss';

import 'react-day-picker/dist/style.css';

type InputProps = PropsWithClassName & {
  defaultRange?: DateRange;
  range?: DateRange | undefined;
  setRange?: SelectRangeEventHandler;
  selectedDate?: Date | undefined;
  defaultDate?: Date;
  setSelectedDate?: SelectSingleEventHandler;
  placeholder: string;
  disabled?: boolean;
  touched?: boolean;
  stretched?: boolean;
  label?: React.ReactNode;
  errorMessage?: string;
  mode?: DaySelectionMode;
  max?: number;
  fromToday?: boolean;
  onClearDate?: VoidFunction;
} & InputHTMLAttributes<HTMLInputElement>;

// todo: divide on two components
const DatePickerInput: React.FC<InputProps> = forwardRef<HTMLDivElement, InputProps>(
  (
    {
      defaultRange,
      range,
      setRange,
      defaultDate,
      selectedDate,
      setSelectedDate,
      placeholder,
      disabled = false,
      touched = false,
      stretched = false,
      label,
      errorMessage,
      mode = 'range',
      max,
      fromToday = true,
      onClearDate,
      className,
    },
    forwardedRef
  ) => {
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [formatedDate, setFormatedDate] = useState('');

    const currentMonth = new Date();

    const { ref } = useClickOutside(() => setDatePickerOpen(false));

    useEffect(() => {
      if (defaultRange) {
        const formated = `${defaultRange.from?.toLocaleDateString()} - ${defaultRange.to?.toLocaleDateString()}`;
        setFormatedDate(formated ?? '');
      }
    }, [defaultRange]);

    useEffect(() => {
      if (defaultDate) {
        setFormatedDate(defaultDate?.toLocaleDateString() ?? '');
      }
    }, [defaultDate]);

    const onRangeChange = useCallback(() => {
      const formated = `${range?.from?.toLocaleDateString()} - ${range?.to?.toLocaleDateString()}`;
      setFormatedDate(formated ?? '');
      setDatePickerOpen(false);
    }, [range]);

    const onDateChange = useCallback(() => {
      setFormatedDate(selectedDate?.toLocaleDateString() ?? '');
      setDatePickerOpen(false);
    }, [selectedDate]);

    const handleDatePicker = () => {
      setDatePickerOpen((v) => !v);
    };

    const onIconClick = (e: React.MouseEvent<SVGSVGElement>) => {
      e.stopPropagation();
      setDatePickerOpen((v) => !v);
    };

    const handleInputClear = () => {
      setFormatedDate('');
      onClearDate?.();
    };

    return (
      <div ref={forwardedRef} className={stretched ? s['ref-wrapper'] : undefined}>
        <div className={cn(s.wrapper, stretched && s.stretched, className)} ref={ref}>
          <Input
            value={formatedDate}
            disabled={disabled}
            placeholder={placeholder}
            icon={() => <CalendarIcon className={s.icon} onClick={onIconClick} />}
            readOnly
            onClick={handleDatePicker}
            label={label}
            errorMessage={errorMessage}
            touched={touched}
            clearSearch={handleInputClear}
          />
          {datePickerOpen && mode === 'range' && (
            <DayPicker
              mode="range"
              max={max}
              selected={range}
              defaultMonth={range?.from ?? currentMonth}
              onSelect={setRange}
              footer={<Footer range={range} onClick={onRangeChange} />}
              className={s.datePicker}
              weekStartsOn={1}
              showOutsideDays
              fromDate={fromToday ? new Date() : undefined}
              initialFocus
            />
          )}
          {datePickerOpen && mode === 'single' && (
            <DayPicker
              mode="single"
              selected={selectedDate}
              defaultMonth={selectedDate}
              onSelect={setSelectedDate}
              footer={<Footer selectedDate={selectedDate} onClick={onDateChange} />}
              className={s.datePicker}
              weekStartsOn={1}
              showOutsideDays
              fromDate={fromToday ? new Date() : undefined}
            />
          )}
        </div>
      </div>
    );
  }
);

DatePickerInput.displayName = 'DatePickerInput';

export default memo(DatePickerInput);
