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
            ? 'border-[#e0ed5e]/35 bg-[#252525] text-[#f4f4f4] hover:border-[#e0ed5e]'
            : 'border-[#e0ed5e] bg-[#e0ed5e] text-[#1a1a1a]'
        }`}
        onClick={() => setIsOpen((open) => !open)}
      >
        {displayedYear} <span aria-hidden="true">⌄</span>
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full z-20 mt-2 min-w-[96px] overflow-hidden rounded-lg border border-[#e0ed5e]/35 bg-[#252525] py-1 shadow-lg">
          {years.map((item) => (
            <button
              key={item}
              type="button"
              className="block min-h-[40px] w-full px-3 text-left text-sm text-[#f4f4f4] transition-colors hover:bg-[#303030]"
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
            ? 'border-[#e0ed5e] bg-[#e0ed5e] text-[#1a1a1a]'
            : 'border-[#e0ed5e]/35 bg-[#252525] text-[#f4f4f4] hover:border-[#e0ed5e]'
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
