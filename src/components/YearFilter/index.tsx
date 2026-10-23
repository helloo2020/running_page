import { useState } from 'react';
import useActivities from '@/hooks/useActivities';

interface IYearFilterProps {
  year: string;
  displayedYear: string;
  onChange: (_year: string) => void;
  className?: string;
}

const YearFilter = ({
  year,
  displayedYear,
  onChange,
  className = '',
}: IYearFilterProps) => {
  const { years } = useActivities();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative flex items-center gap-2 ${className}`} aria-label="年份筛选">
      <button
        type="button"
        aria-expanded={isOpen}
        className={`min-h-[44px] rounded-lg border px-3 text-base font-semibold transition-colors ${
          year === 'Total'
            ? 'border-[rgb(var(--accent-rgb))]/35 bg-[var(--surface)] text-[var(--ink)] hover:border-[rgb(var(--accent-rgb))]'
            : 'border-[rgb(var(--accent-rgb))] bg-[rgb(var(--accent-rgb))] text-[var(--on-accent)]'
        }`}
        onClick={() => setIsOpen((open) => !open)}
      >
        {displayedYear} <span aria-hidden="true">⌄</span>
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full z-20 mt-2 min-w-[96px] overflow-hidden rounded-lg border border-[rgb(var(--accent-rgb))]/35 bg-[var(--surface)] py-1 shadow-lg">
          {years.map((item) => (
            <button
              key={item}
              type="button"
              className="block min-h-[40px] w-full px-3 text-left text-sm text-[var(--ink)] transition-colors hover:bg-[var(--surface)]"
              onClick={() => {
                onChange(item);
                setIsOpen(false);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        aria-pressed={year === 'Total'}
        className={`min-h-[44px] rounded-lg border px-4 text-sm font-semibold transition-colors ${
          year === 'Total'
            ? 'border-[rgb(var(--accent-rgb))] bg-[rgb(var(--accent-rgb))] text-[var(--on-accent)]'
            : 'border-[rgb(var(--accent-rgb))]/35 bg-[var(--surface)] text-[var(--ink)] hover:border-[rgb(var(--accent-rgb))]'
        }`}
        onClick={() => {
          onChange('Total');
          setIsOpen(false);
        }}
      >
        Total
      </button>
    </div>
  );
};

export default YearFilter;
