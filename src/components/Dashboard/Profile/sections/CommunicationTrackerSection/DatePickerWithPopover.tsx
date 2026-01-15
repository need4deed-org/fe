import { format, isValid, parse } from "date-fns";
import { type Locale } from "date-fns/locale";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { DateInput, DateInputContainer, DateInputIcon, DatePickerPopover, DatePickerWrapper } from "./styles";

type Props = {
  date: Date | undefined;
  onSelect: (d: Date | undefined) => void;
  locale?: Locale;
};

export function DatePickerWithPopover({ date, onSelect, locale }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [month, setMonth] = useState<Date>(date || new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Do not update input value while user is typing (input is focused)
    if (document.activeElement === inputRef.current) return;

    if (date) {
      setInputValue(format(date, "dd.MM.yyyy"));
    } else {
      setInputValue("");
    }
  }, [date]);

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

    // Strict regex for d.m.yyyy or dd.mm.yyyy
    const dateRegex = /^\d{1,2}\.\d{1,2}\.\d{4}$/;

    if (!dateRegex.test(value)) {
      onSelect(undefined);
      return;
    }

    const parsedDate = parse(value, "dd.MM.yyyy", new Date());

    if (isValid(parsedDate) && parsedDate.getFullYear() >= 2025) {
      onSelect(parsedDate);
    } else {
      onSelect(undefined);
    }
  };

  const handleInputBlur = () => {
    if (date) {
      setInputValue(format(date, "dd.MM.yyyy"));
    }
  };

  return (
    <DatePickerWrapper ref={containerRef}>
      <DateInputContainer>
        <DateInputIcon size={24} weight="regular" onClick={() => setIsOpen(!isOpen)} />
        <DateInput
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          data-testid="date-picker-input"
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
          startMonth={new Date(2025, 0)}
          endMonth={new Date(new Date().getFullYear() + 10, 11)}
          disabled={{ after: new Date() }}
        />
      </DatePickerPopover>
    </DatePickerWrapper>
  );
}
