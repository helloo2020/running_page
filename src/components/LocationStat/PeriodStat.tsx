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
      return (
        (priorityA === -1 ? priorities.length : priorityA) -
        (priorityB === -1 ? priorities.length : priorityB)
      );
    }
    return countB - countA;
  });
  return (
    <div className="stat-section">
      <p className="mb-3 text-sm font-semibold text-[var(--muted)]">运动类型</p>
      <section>
        {periodArr.map(([period, times]) => (
          <button
            key={period}
            type="button"
            className="flex w-full items-baseline justify-between py-2 text-left"
            onClick={() => onClick(period)}
          >
            <span className="text-sm font-medium text-[var(--ink)]">
              {period}
            </span>
            <span className="text-xs font-medium text-[rgb(var(--accent-rgb))]">
              {times} 次
            </span>
          </button>
        ))}
      </section>
    </div>
  );
};

export default PeriodStat;
