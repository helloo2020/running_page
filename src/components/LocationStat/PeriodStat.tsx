import useActivities from '@/hooks/useActivities';
import { RUN_TITLES } from '@/utils/const';

const PeriodStat = ({ onClick }: { onClick: (_period: string) => void }) => {
  const { runPeriod } = useActivities();

  const periodArr = Object.entries(runPeriod);
  const priorities = [
    RUN_TITLES.FULL_MARATHON_RUN_TITLE,
    RUN_TITLES.HALF_MARATHON_RUN_TITLE,
  ];
  periodArr.sort(([periodA, countA], [periodB, countB]) => {
    const priorityA = priorities.indexOf(periodA);
    const priorityB = priorities.indexOf(periodB);

    if (priorityA !== priorityB) {
      return (priorityA === -1 ? priorities.length : priorityA) -
        (priorityB === -1 ? priorities.length : priorityB);
    }
    return countB - countA;
  });
  return (
    <div className="h-full rounded-xl border border-[#e0ed5e]/20 bg-[#252525] p-4">
      <p className="mb-3 text-sm font-semibold text-[#cccccc]">运动类型</p>
      <section>
        {periodArr.map(([period, times]) => (
          <button
            key={period}
            type="button"
            className="flex w-full items-baseline justify-between py-1 text-left"
            onClick={() => onClick(period)}
          >
            <span className="text-sm font-semibold italic text-[#f4f4f4]">
              {period}
            </span>
            <span className="text-xs font-medium text-[#e0ed5e]">
              {times} Runs
            </span>
          </button>
        ))}
      </section>
    </div>
  );
};

export default PeriodStat;
