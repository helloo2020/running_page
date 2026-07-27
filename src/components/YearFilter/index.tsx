import useActivities from '@/hooks/useActivities';

interface IYearFilterProps {
  year: string;
  onChange: (_year: string) => void;
}

const YearFilter = ({ year, onChange }: IYearFilterProps) => {
  const { years } = useActivities();

  return (
    <div
      className="mb-8 flex items-center gap-2"
      aria-label="年份筛选"
    >
      <label className="sr-only" htmlFor="year-filter">
        选择年份
      </label>
      <select
        id="year-filter"
        value={year === 'Total' ? '' : year}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[44px] rounded-lg border border-[#e0ed5e]/35 bg-[#252525] px-3 text-base font-semibold text-[#f4f4f4] outline-none transition-colors focus:border-[#e0ed5e]"
      >
        <option value="" disabled>
          年份
        </option>
        {years.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <button
        type="button"
        aria-pressed={year === 'Total'}
        className={`min-h-[44px] rounded-lg border px-4 text-sm font-semibold transition-colors ${
          year === 'Total'
            ? 'border-[#e0ed5e] bg-[#e0ed5e] text-[#1a1a1a]'
            : 'border-[#e0ed5e]/35 bg-[#252525] text-[#f4f4f4] hover:border-[#e0ed5e]'
        }`}
        onClick={() => onChange('Total')}
      >
        Total
      </button>
    </div>
  );
};

export default YearFilter;
