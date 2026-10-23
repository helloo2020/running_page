import { lazy, Suspense, useMemo, useState } from 'react';
import { totalStat } from '@assets/index';
import { loadSvgComponent } from '@/utils/svgUtils';
import useActivities from '@/hooks/useActivities';
import { RunIds } from '@/utils/utils';

const GridSvg = lazy(() => loadSvgComponent(totalStat, './grid.svg'));
const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const SVGStat = ({
  locateActivity,
}: {
  locateActivity: (_ids: RunIds) => void;
}) => {
  const { activities, years, thisYear } = useActivities();
  const [year, setYear] = useState(thisYear);
  const [showRoutes, setShowRoutes] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const daily = useMemo(() => {
    const result: Record<string, { distance: number; ids: number[] }> = {};
    activities.forEach((activity) => {
      const date = activity.start_date_local.slice(0, 10);
      result[date] ||= { distance: 0, ids: [] };
      result[date].distance += activity.distance / 1000;
      result[date].ids.push(activity.run_id);
    });
    return result;
  }, [activities]);
  const yearRuns = activities.filter((activity) =>
    activity.start_date_local.startsWith(year)
  );
  const distance =
    yearRuns.reduce((sum, activity) => sum + activity.distance, 0) / 1000;
  const start = new Date(Number(year), 0, 1, 12);
  const offset = (start.getDay() + 6) % 7;
  const dayCount = Math.round(
    (new Date(Number(year) + 1, 0, 1, 12).getTime() - start.getTime()) /
      86400000
  );
  const total = Math.ceil((dayCount + offset) / 7) * 7;
  const cells = Array.from({ length: total }, (_, index) => {
    const date = new Date(Number(year), 0, index - offset + 1, 12);
    if (date.getFullYear() !== Number(year)) return null;
    const key = dateKey(date);
    const entry = daily[key];
    return {
      key,
      entry,
      level: !entry
        ? 0
        : entry.distance < 5
          ? 1
          : entry.distance < 10
            ? 2
            : entry.distance < 20
              ? 3
              : 4,
    };
  });
  const weeks = total / 7;
  const selected = daily[selectedDay];
  return (
    <div id="svgStat">
      <div className="section-toolbar">
        <h2>活动日历</h2>
        <label className="calendar-year">
          <span className="sr-only">选择日历年份</span>
          <select
            value={year}
            onChange={(event) => {
              setYear(event.target.value);
              setSelectedDay('');
            }}
          >
            {years.map((item) => (
              <option key={item} value={item}>
                {item} 年
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="calendar-total">
        累计 {activities.length.toLocaleString('zh-CN')} 次活动 ·{' '}
        {(
          activities.reduce((sum, activity) => sum + activity.distance, 0) /
          1000
        ).toLocaleString('zh-CN', { maximumFractionDigits: 1 })}{' '}
        公里
      </p>
      <div className="calendar-metrics">
        <span>
          <strong>
            {distance.toLocaleString('zh-CN', { maximumFractionDigits: 1 })}
          </strong>{' '}
          公里
        </span>
        <span>
          <strong>{yearRuns.length}</strong> 次活动
        </span>
        <span>
          <strong>
            {Object.keys(daily).filter((key) => key.startsWith(year)).length}
          </strong>{' '}
          天有记录
        </span>
      </div>
      <div
        className="calendar-scroll"
        role="region"
        aria-label={`${year} 年活动日历，可左右滚动`}
        tabIndex={0}
      >
        <div className="calendar-chart">
          <div
            className="calendar-months"
            style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}
          >
            {Array.from({ length: 12 }, (_, month) => {
              const day = Math.round(
                (new Date(Number(year), month, 1, 12).getTime() -
                  start.getTime()) /
                  86400000
              );
              return (
                <span
                  key={month}
                  style={{
                    gridColumnStart: Math.floor((day + offset) / 7) + 1,
                  }}
                >
                  {month + 1}月
                </span>
              );
            })}
          </div>
          <div className="calendar-body">
            <div className="calendar-weekdays">
              <span>一</span>
              <span>三</span>
              <span>五</span>
              <span>日</span>
            </div>
            <div
              className="calendar-grid"
              style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}
            >
              {cells.map((cell, index) =>
                cell ? (
                  <button
                    key={cell.key}
                    type="button"
                    className={`calendar-cell level-${cell.level}`}
                    disabled={!cell.entry}
                    aria-pressed={selectedDay === cell.key}
                    aria-label={`${cell.key}，${cell.entry ? `${cell.entry.ids.length} 次活动，${cell.entry.distance.toFixed(1)} 公里` : '无记录'}`}
                    title={`${cell.key} · ${cell.entry ? cell.entry.distance.toFixed(1) + ' 公里' : '无记录'}`}
                    onClick={() => setSelectedDay(cell.key)}
                  />
                ) : (
                  <span key={`empty-${index}`} />
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="calendar-footer">
        <span className="calendar-hint">点击有颜色的日期查看记录</span>
        <span
          className="calendar-legend"
          aria-label="每日距离：无记录、小于5公里、5至10公里、10至20公里、20公里及以上"
        >
          <span>少</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <i key={level} className={`level-${level}`} />
          ))}
          <span>多</span>
        </span>
      </div>
      <div className="calendar-selection" aria-live="polite">
        {selected && (
          <>
            <span>
              {selectedDay} · {selected.ids.length} 次活动 ·{' '}
              {selected.distance.toFixed(1)} 公里
            </span>
            <button
              type="button"
              className="text-button"
              onClick={() => locateActivity(selected.ids)}
            >
              查看路线 ↗
            </button>
          </>
        )}
      </div>
      <details
        className="route-gallery"
        onToggle={(event) => setShowRoutes(event.currentTarget.open)}
      >
        <summary>
          长距离路线<span>10 公里以上的记录</span>
        </summary>
        {showRoutes && (
          <Suspense fallback={<p className="loading-note">正在加载路线图…</p>}>
            <GridSvg className="route-mosaic" />
          </Suspense>
        )}
      </details>
    </div>
  );
};
export default SVGStat;
