import {
  formatPace,
  titleForRun,
  formatRunTime,
  Activity,
  RunIds,
} from '@/utils/utils';
import { SHOW_ELEVATION_GAIN } from '@/utils/const';
import styles from './style.module.css';

interface IRunRowProperties {
  elementIndex: number;
  locateActivity: (_runIds: RunIds) => void;
  run: Activity;
  runIndex: number;
  setRunIndex: (_ndex: number) => void;
}

const RunRow = ({
  elementIndex,
  locateActivity,
  run,
  runIndex,
  setRunIndex,
}: IRunRowProperties) => {
  const distance = (run.distance / 1000.0).toFixed(2);
  const elevation_gain = run.elevation_gain?.toFixed(0);
  const paceParts = run.average_speed ? formatPace(run.average_speed) : null;
  const heartRate = run.average_heartrate;
  const runTime = formatRunTime(run.moving_time);
  const handleClick = () => {
    if (runIndex === elementIndex) {
      setRunIndex(-1);
      locateActivity([]);
      return;
    }
    setRunIndex(elementIndex);
    locateActivity([run.run_id]);
  };

  return (
    <tr
      className={`${styles.runRow} ${runIndex === elementIndex ? styles.selected : ''}`}
      key={run.start_date_local}
      onClick={handleClick}
      tabIndex={0}
      aria-label={`${titleForRun(run)}，${run.start_date_local.slice(0, 10)}，${distance} 公里，查看路线`}
      aria-selected={runIndex === elementIndex}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleClick();
        }
      }}
    >
      <td>{titleForRun(run)}</td>
      <td>
        {distance}
        <span className={styles.mobileLabel}> KM</span>
      </td>
      {SHOW_ELEVATION_GAIN && <td>{elevation_gain}</td>}
      <td>{paceParts || '—'}</td>
      <td>
        {heartRate && heartRate.toFixed(0)}
        {heartRate && <span className={styles.mobileLabel}> BPM</span>}
      </td>
      <td>{runTime}</td>
      <td className={styles.runDate}>{run.start_date_local.slice(0, 10)}</td>
    </tr>
  );
};

export default RunRow;
