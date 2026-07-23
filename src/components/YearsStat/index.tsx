import YearStat from '@/components/YearStat';
import useActivities from '@/hooks/useActivities';
import { INFO_MESSAGE } from '@/utils/const';

interface IYearsStatProps {
  year: string;
  onClick: (_year: string) => void;
  compact?: boolean;
}

const YearsStat = ({ year, onClick, compact = false }: IYearsStatProps) => {
  const { years } = useActivities();
  // make sure the year click on front
  let yearsArrayUpdate = years.slice();
  yearsArrayUpdate.push('Total');
  yearsArrayUpdate = yearsArrayUpdate.filter((x) => x !== year);
  yearsArrayUpdate.unshift(year);

  const yearsWithTotal = [...years, 'Total'];

  if (compact) {
    return (
      <div className="w-full pb-8">
        <section className="pb-6">
          <p className="leading-relaxed">{INFO_MESSAGE(years.length, year)}</p>
        </section>
        <div
          className="yearTabs -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2"
          role="tablist"
          aria-label="Running year"
        >
          {yearsWithTotal.map((item) => {
            const selected = item === year;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`min-h-[44px] shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${
                  selected
                    ? 'border-[#e0ed5e] bg-[#e0ed5e] text-[#1a1a1a]'
                    : 'border-[#e0ed5e]/30 text-[#cccccc]'
                }`}
                onClick={() => onClick(item)}
              >
                {item}
              </button>
            );
          })}
        </div>
        <YearStat year={year} compact />
      </div>
    );
  }

  // for short solution need to refactor
  return (
    <div className="w-full lg:w-full pb-16 pr-16 lg:pr-16">
      <section className="pb-0">
        <p className="leading-relaxed">
          {INFO_MESSAGE(years.length, year)}
          <br />
        </p>
      </section>
      <hr color="red" />
      {yearsArrayUpdate.map((year) => (
        <YearStat key={year} year={year} onClick={onClick} />
      ))}
      {// eslint-disable-next-line no-prototype-builtins
        yearsArrayUpdate.hasOwnProperty('Total') ? (
          <YearStat key="Total" year="Total" onClick={onClick} />
        ) : (
          <div />
        )}
    </div>
  );
};

export default YearsStat;
