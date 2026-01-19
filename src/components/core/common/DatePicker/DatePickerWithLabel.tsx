import { CaretDown } from "@phosphor-icons/react";
import { format, isValid, parse } from "date-fns";
import { type Locale } from "date-fns/locale";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

const MIN_YEAR = 2025;

import {
  DateInput,
  DateInputContainer,
  DateInputIcon,
  DatePickerPopover,
  DatePickerWrapper,
  DropdownIcon,
  FloatingLabel,
} from "./styles";

type Props = {
  date: Date | undefined;
  onSelect: (d: Date | undefined) => void;
  locale?: Locale;
  allowFuture?: boolean;
  label?: string;
  showTodayIndicator?: boolean;
  todayText?: string;
  showDropdownIcon?: boolean;
};

export function DatePickerWithLabel({
  date,
  onSelect,
  locale,
  allowFuture = false,
  label,
  showTodayIndicator = false,
  todayText = "today",
  showDropdownIcon = true,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [month, setMonth] = useState<Date>(date || new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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
  }, [date, showTodayIndicator, todayText]);

  useEffect(() => {
    if (isOpen && date && isValid(date)) {
      setMonth(date);
    }
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

    if (isValid(parsedDate) && parsedDate.getFullYear() >= MIN_YEAR) {
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
          $hasDropdownIcon={showDropdownIcon}
        />
        {showDropdownIcon && (
          <DropdownIcon>
            <CaretDown size={20} weight="regular" />
          </DropdownIcon>
        )}
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
          disabled={allowFuture ? undefined : { after: new Date() }}
        />
      </DatePickerPopover>
    </DatePickerWrapper>
  );
}
