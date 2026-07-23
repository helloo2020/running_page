import { lazy, Suspense } from 'react';
import Stat from '@/components/Stat';
import useActivities from '@/hooks/useActivities';
import { formatPace, intComma } from '@/utils/utils';
import useHover from '@/hooks/useHover';
import { yearStats } from '@assets/index';
import { loadSvgComponent } from '@/utils/svgUtils';
import { SHOW_ELEVATION_GAIN } from '@/utils/const';

interface IYearStatProps {
  year: string;
  onClick?: (_year: string) => void;
  compact?: boolean;
}

const YearStat = ({ year, onClick, compact = false }: IYearStatProps) => {
  let { activities: runs, years } = useActivities();
  // for hover
  const [hovered, eventHandlers] = useHover();
  // lazy Component
  const YearSVG = lazy(() => loadSvgComponent(yearStats, `./year_${year}.svg`));

  if (years.includes(year)) {
    runs = runs.filter((run) => run.start_date_local.slice(0, 4) === year);
  }
  let sumDistance = 0;
  let streak = 0;
  let sumElevationGain = 0;
  let pace = 0; // eslint-disable-line no-unused-vars
  let paceNullCount = 0; // eslint-disable-line no-unused-vars
  let heartRate = 0;
  let heartRateNullCount = 0;
  let totalMetersAvail = 0;
  let totalSecondsAvail = 0;
  runs.forEach((run) => {
    sumDistance += run.distance || 0;
    sumElevationGain += run.elevation_gain || 0;
    if (run.average_speed) {
      pace += run.average_speed;
      totalMetersAvail += run.distance || 0;
      totalSecondsAvail += (run.distance || 0) / run.average_speed;
    } else {
      paceNullCount++;
    }
    if (run.average_heartrate) {
      heartRate += run.average_heartrate;
    } else {
      heartRateNullCount++;
    }
    if (run.streak) {
      streak = Math.max(streak, run.streak);
    }
  });
  sumDistance = parseFloat((sumDistance / 1000.0).toFixed(1));
  sumElevationGain = (sumElevationGain).toFixed(0);
  const avgPace = formatPace(totalMetersAvail / totalSecondsAvail);
  const hasHeartRate = !(heartRate === 0);
  const avgHeartRate = (heartRate / (runs.length - heartRateNullCount)).toFixed(
    0
  );
  const compactMetrics = [
    { label: 'Runs', value: runs.length },
    { label: 'KM', value: sumDistance },
    { label: 'Avg Pace', value: avgPace },
    { label: 'Streak', value: `${streak} day` },
    ...(hasHeartRate ? [{ label: 'Avg Heart Rate', value: avgHeartRate }] : []),
  ];

  if (compact) {
    return (
      <section
        className="grid grid-cols-2 gap-x-5 gap-y-5 border border-[#e0ed5e]/20 bg-white/[0.02] p-5"
        aria-label={`${year} running summary`}
      >
        <div className="col-span-2 border-b border-[#e0ed5e]/15 pb-4">
          <span className="text-4xl font-bold italic">{year}</span>
          <span className="ml-2 text-base font-semibold italic text-[#cccccc]">
            Journey
          </span>
        </div>
        {compactMetrics.map((metric) => (
          <div key={metric.label}>
            <div className="text-2xl font-bold italic tabular-nums">
              {intComma(metric.value.toString())}
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#cccccc]">
              {metric.label}
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <div
      className={onClick ? 'cursor-pointer' : ''}
      onClick={onClick ? () => onClick(year) : undefined}
      {...eventHandlers}
    >
      <section>
        <Stat value={year} description=" Journey" />
        <Stat value={runs.length} description=" Runs" />
        <Stat value={sumDistance} description=" KM" />
        {SHOW_ELEVATION_GAIN && <Stat value={sumElevationGain} description=" Elevation Gain" />}
        <Stat value={avgPace} description=" Avg Pace" />
        <Stat value={`${streak} day`} description=" Streak" />
        {hasHeartRate && (
          <Stat value={avgHeartRate} description=" Avg Heart Rate" />
        )}
      </section>
      {year !== 'Total' && hovered && (
        <Suspense fallback="loading...">
          <YearSVG className="my-4 h-4/6 w-4/6 border-0 p-0" />
        </Suspense>
      )}
      <hr color="red" />
    </div>
  );
};

export default YearStat;
