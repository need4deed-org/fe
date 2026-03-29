import { format, isValid, parse } from "date-fns";
import { type Locale } from "date-fns/locale";
import { useEffect, useRef, useState, useEffectEvent } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

const MIN_YEAR = 2025;

import {
  DateInput,
  DateInputContainer,
  DateInputIcon,
  DatePickerPopover,
  DatePickerWrapper,
  FloatingLabel,
} from "./styles";

type Props = {
  date: Date | undefined;
  onSelect: (d: Date | undefined) => void;
  locale?: Locale;
  allowFuture?: boolean;
  minDate?: Date;
  label?: string;
  showTodayIndicator?: boolean;
  todayText?: string;
};

export function DatePickerWithLabel({
  date,
  onSelect,
  locale,
  allowFuture = false,
  minDate,
  label,
  showTodayIndicator = false,
  todayText = "today",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [month, setMonth] = useState<Date>(date || new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateInputValue = useEffectEvent(() => {
    if (document.activeElement === inputRef.current) return;

    if (date) {
      const formatted = format(date, "dd.MM.yyyy");
      if (showTodayIndicator) {
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        setInputValue(isToday ? `${formatted} (${todayText})` : formatted);
      } else {
        setInputValue(formatted);
      }
    } else {
      setInputValue("");
    }
  });

  useEffect(() => {
    updateInputValue();
  }, [date, showTodayIndicator, todayText]);

  const updateMonth = useEffectEvent(() => {
    if (isOpen && date && isValid(date)) {
      setMonth(date);
    }
  });

  useEffect(() => {
    updateMonth();
  }, [isOpen, date]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const dateRegex = /^\d{1,2}\.\d{1,2}\.\d{4}$/;

    if (!dateRegex.test(value)) {
      return;
    }

    const parsedDate = parse(value, "dd.MM.yyyy", new Date());

    const isAfterMinDate = !minDate || parsedDate >= minDate;
    if (isValid(parsedDate) && parsedDate.getFullYear() >= MIN_YEAR && isAfterMinDate) {
      onSelect(parsedDate);
    }
  };

  const handleInputBlur = () => {
    if (date) {
      const formatted = format(date, "dd.MM.yyyy");
      if (showTodayIndicator) {
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        setInputValue(isToday ? `${formatted} (${todayText})` : formatted);
      } else {
        setInputValue(formatted);
      }
    }
  };

  const handleIconClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <DatePickerWrapper ref={containerRef} data-testid="date-picker-wrapper">
      <DateInputContainer $hasLabel={!!label}>
        {label && <FloatingLabel>{label}</FloatingLabel>}
        <DateInputIcon size={24} weight="regular" onClick={handleIconClick} />
        <DateInput
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          data-testid="date-picker-input"
          placeholder="dd.mm.yyyy"
        />
      </DateInputContainer>
      <DatePickerPopover $isOpen={isOpen}>
        <DayPicker
          mode="single"
          selected={date}
          onSelect={(d) => {
            onSelect(d);
            setIsOpen(false);
          }}
          month={month}
          onMonthChange={setMonth}
          locale={locale}
          captionLayout="dropdown"
          startMonth={new Date(MIN_YEAR, 0)}
          endMonth={new Date(new Date().getFullYear() + 10, 11)}
          disabled={allowFuture ? { before: minDate ?? new Date() } : { after: new Date() }}
        />
      </DatePickerPopover>
    </DatePickerWrapper>
  );
}
