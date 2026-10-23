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
  return (
    <div
      className={`year-filter ${className}`}
      role="group"
      aria-label="地图年份筛选"
    >
      <button
        type="button"
        aria-pressed={year === 'Total'}
        onClick={() => onChange('Total')}
      >
        全部
      </button>
      <label
        className={year !== 'Total' ? 'year-select is-selected' : 'year-select'}
      >
        <span className="sr-only">选择地图年份</span>
        <select
          value={year === 'Total' ? '' : displayedYear}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="" disabled>
            按年份
          </option>
          {years.map((item) => (
            <option key={item} value={item}>
              {item} 年
            </option>
          ))}
        </select>
        <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="m4 6 4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </label>
    </div>
  );
};
export default YearFilter;
