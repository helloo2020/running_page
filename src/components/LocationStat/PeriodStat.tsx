import Stat from '@/components/Stat';
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
    <div className="rounded-xl border border-[#e0ed5e]/20 bg-[#252525] p-4">
      <p className="mb-3 text-sm font-semibold text-[#cccccc]">运动类型</p>
      <section>
        {periodArr.map(([period, times]) => (
          <Stat
            key={period}
            value={period}
            description={` ${times} Runs`}
            citySize={2}
            valueClassName="text-[#f4f4f4]"
            descriptionClassName="block text-xs font-medium text-[#cccccc]"
            className="w-full pb-1.5"
            onClick={() => onClick(period)}
          />
        ))}
      </section>
    </div>
  );
};

export default PeriodStat;
