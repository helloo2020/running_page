import React, { lazy, useState, Suspense, useMemo, useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import Layout from '@/components/Layout';
import activities from '@/static/activities.json';
import styles from './style.module.css';
import { ACTIVITY_TOTAL } from '@/utils/const';
import { convertMovingTime2Sec } from '@/utils/utils';
import { totalStat } from '@assets/index';
import { loadSvgComponent } from '@/utils/svgUtils';

const MonthofLifeSvg = lazy(() => loadSvgComponent(totalStat, './mol.svg'));

// Define interfaces for our data structures
interface Activity {
  start_date_local: string;
  distance: number;
  moving_time: string;
  type: string;
  location_country?: string;
}

interface ActivitySummary {
  totalDistance: number;
  totalTime: number;
  count: number;
  dailyDistances: number[];
  maxDistance: number;
  maxSpeed: number;
  location: string;
}

interface DisplaySummary {
  totalDistance: number;
  averageSpeed: number;
  totalTime: number;
  count: number;
  maxDistance: number;
  maxSpeed: number;
  location: string;
}

interface ChartData {
  day: number;
  distance: number;
}

interface ActivityCardProps {
  period: string;
  summary: DisplaySummary;
  dailyDistances: number[];
  interval: string;
}

interface ActivityGroups {
  [key: string]: ActivitySummary;
}

type IntervalType = 'year' | 'month' | 'week' | 'day' | 'life';

const ActivityCard: React.FC<ActivityCardProps> = ({
  period,
  summary,
  dailyDistances,
  interval,
}) => {
  const generateLabels = (): number[] => {
    if (interval === 'month') {
      const [year, month] = period.split('-').map(Number);
      const daysInMonth = new Date(year, month, 0).getDate(); // Get the number of days in the month
      return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    } else if (interval === 'week') {
      return Array.from({ length: 7 }, (_, i) => i + 1);
    } else if (interval === 'year') {
      return Array.from({ length: 12 }, (_, i) => i + 1); // Generate months 1 to 12
    }
    return [];
  };

  const data: ChartData[] = generateLabels().map((day) => ({
    day,
    distance: Number((dailyDistances[day - 1] || 0).toFixed(2)), // Keep two decimal places
  }));

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}小时 ${m}分 ${s}秒`;
  };

  const formatPace = (speed: number): string => {
    if (speed === 0) return '—';
    const pace = 60 / speed; // min/km
    const totalSeconds = Math.round(pace * 60); // Total seconds per km
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} /公里`;
  };

  const periodLabel =
    interval === 'year'
      ? `${period} 年`
      : interval === 'month'
        ? period.replace('-', ' 年 ') + ' 月'
        : interval === 'week'
          ? period.replace('-W', ' 年 · 第 ') + ' 周'
          : period;
  const tooltipLabel = (value: number) =>
    interval === 'year'
      ? `${value} 月`
      : interval === 'week'
        ? ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][value - 1]
        : `${period} · ${value} 日`;

  return (
    <div className={styles.activityCard}>
      <h2 className={styles.activityName}>{periodLabel}</h2>
      <div className={styles.activityDetails}>
        <p>
          <strong>{ACTIVITY_TOTAL.TOTAL_DISTANCE_TITLE}:</strong>{' '}
          {summary.totalDistance.toFixed(2)} km
        </p>
        <p>
          <strong>{ACTIVITY_TOTAL.AVERAGE_SPEED_TITLE}:</strong>{' '}
          {formatPace(summary.averageSpeed)}
        </p>
        <p>
          <strong>{ACTIVITY_TOTAL.TOTAL_TIME_TITLE}:</strong>{' '}
          {formatTime(summary.totalTime)}
        </p>
        {interval !== 'day' && (
          <>
            <p>
              <strong>{ACTIVITY_TOTAL.ACTIVITY_COUNT_TITLE}:</strong>{' '}
              {summary.count}
            </p>
            <p>
              <strong>{ACTIVITY_TOTAL.MAX_DISTANCE_TITLE}:</strong>{' '}
              {summary.maxDistance.toFixed(2)} km
            </p>
            <p>
              <strong>{ACTIVITY_TOTAL.MAX_SPEED_TITLE}:</strong>{' '}
              {formatPace(summary.maxSpeed)}
            </p>
          </>
        )}
        {['month', 'week', 'year'].includes(interval) && (
          <div
            className={styles.chart}
            style={{ height: '200px', width: '100%' }}
          >
            <ResponsiveContainer>
              <BarChart
                data={data}
                margin={{ top: 12, right: 6, left: -18, bottom: 0 }}
                accessibilityLayer
              >
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="2 4"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  minTickGap={18}
                  tickMargin={10}
                  tick={{ fill: 'var(--muted)', fontSize: 10 }}
                  tickFormatter={(value) =>
                    interval === 'year'
                      ? `${value}月`
                      : interval === 'week'
                        ? ['一', '二', '三', '四', '五', '六', '日'][value - 1]
                        : String(value)
                  }
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickCount={4}
                  tick={{ fill: 'var(--muted)', fontSize: 10 }}
                  width={48}
                />
                <Tooltip
                  cursor={{ fill: 'var(--surface)' }}
                  formatter={(value) => [`${value} 公里`, '距离']}
                  labelFormatter={tooltipLabel}
                  contentStyle={{
                    backgroundColor: 'var(--page)',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    fontSize: 12,
                    color: 'var(--ink)',
                  }}
                  labelStyle={{ color: 'var(--muted)', marginBottom: 4 }}
                />
                <Bar
                  dataKey="distance"
                  fill="var(--accent)"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={20}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

const ActivityList: React.FC = () => {
  const [interval, setInterval] = useState<IntervalType>('month');
  const [page, setPage] = useState(1);
  const listStart = useRef<HTMLDivElement>(null);
  const pageSize = 6;

  const toggleInterval = (newInterval: IntervalType): void => {
    setInterval(newInterval);
    setPage(1);
  };

  const filterActivities = (activity: Activity): boolean => {
    return activity.type.toLowerCase() === 'run';
  };

  const groupActivities = (interval: IntervalType): ActivityGroups => {
    return (activities as Activity[])
      .filter(filterActivities)
      .reduce((acc: ActivityGroups, activity) => {
        const date = new Date(activity.start_date_local);
        let key: string;
        let index: number;
        switch (interval) {
          case 'year':
            key = date.getFullYear().toString();
            index = date.getMonth(); // Return current month (0-11)
            break;
          case 'month':
            key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; // Zero padding
            index = date.getDate() - 1; // Return current day (0-30)
            break;
          case 'week': {
            const currentDate = new Date(date.valueOf());
            currentDate.setDate(
              currentDate.getDate() + 4 - (currentDate.getDay() || 7)
            ); // Set to nearest Thursday (ISO weeks defined by Thursday)
            const yearStart = new Date(currentDate.getFullYear(), 0, 1);
            const weekNum = Math.ceil(
              ((currentDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
            );
            key = `${currentDate.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
            index = (date.getDay() + 6) % 7; // Return current day (0-6, Monday-Sunday)
            break;
          }
          case 'day':
            key = date.toLocaleDateString('zh').replaceAll('/', '-'); // Format date as YYYY-MM-DD
            index = 0; // Return 0
            break;
          default:
            key = date.getFullYear().toString();
            index = 0; // Default return 0
        }

        if (!acc[key])
          acc[key] = {
            totalDistance: 0,
            totalTime: 0,
            count: 0,
            dailyDistances: [],
            maxDistance: 0,
            maxSpeed: 0,
            location: '',
          };

        const distanceKm = activity.distance / 1000; // Convert to kilometers
        const timeInSeconds = convertMovingTime2Sec(activity.moving_time);
        const speedKmh =
          timeInSeconds > 0 ? distanceKm / (timeInSeconds / 3600) : 0;

        acc[key].totalDistance += distanceKm;
        acc[key].totalTime += timeInSeconds;
        acc[key].count += 1;

        // Accumulate daily distances
        acc[key].dailyDistances[index] =
          (acc[key].dailyDistances[index] || 0) + distanceKm;

        if (distanceKm > acc[key].maxDistance)
          acc[key].maxDistance = distanceKm;
        if (speedKmh > acc[key].maxSpeed) acc[key].maxSpeed = speedKmh;

        if (interval === 'day')
          acc[key].location = activity.location_country || '';

        return acc;
      }, {});
  };

  const activitiesByInterval = useMemo(
    () => groupActivities(interval),
    [interval]
  );

  const sortedPeriods = useMemo(
    () =>
      Object.entries(activitiesByInterval).sort(([a], [b]) => {
        if (interval === 'day') {
          return new Date(b).getTime() - new Date(a).getTime(); // Sort by date
        } else if (interval === 'week') {
          const [yearA, weekA] = a.split('-W').map(Number);
          const [yearB, weekB] = b.split('-W').map(Number);
          return yearB - yearA || weekB - weekA; // Sort by year and week number
        } else {
          const [yearA, monthA = 0] = a.split('-').map(Number);
          const [yearB, monthB = 0] = b.split('-').map(Number);
          return yearB - yearA || monthB - monthA; // Sort by year and month
        }
      }),
    [activitiesByInterval, interval]
  );
  const totalPages = Math.max(1, Math.ceil(sortedPeriods.length / pageSize));
  const visiblePeriods = sortedPeriods.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const changePage = (next: number) => {
    setPage(Math.max(1, Math.min(totalPages, next)));
    listStart.current?.focus({ preventScroll: true });
    listStart.current?.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
  };
  const periods: [IntervalType, string][] = [
    ['year', '年'],
    ['month', '月'],
    ['week', '周'],
    ['day', '日'],
    ['life', '月度足迹'],
  ];

  return (
    <Layout contentClassName={styles.activityList}>
      <div className={styles.pageHeading}>
        <div>
          <h1>跑步统计</h1>
          <p>按时间回看，每一段跑过的路。</p>
        </div>
        <div
          className={styles.filterContainer}
          role="group"
          aria-label="统计周期"
        >
          {periods.map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={interval === value}
              onClick={() => toggleInterval(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {interval === 'life' && (
        <div className={styles.lifeContainer}>
          <Suspense fallback={<div>正在加载足迹图…</div>}>
            <MonthofLifeSvg />
          </Suspense>
        </div>
      )}

      {interval !== 'life' && (
        <div className={styles.listStart} ref={listStart} tabIndex={-1}>
          <span aria-live="polite">
            共 {sortedPeriods.length} 组记录 · 第 {page} / {totalPages} 页
          </span>
          <span>每页 {pageSize} 组</span>
        </div>
      )}
      {interval !== 'life' && (
        <div className={styles.summaryContainer}>
          {visiblePeriods.map(([period, summary]) => (
            <ActivityCard
              key={period}
              period={period}
              summary={{
                totalDistance: summary.totalDistance,
                averageSpeed: summary.totalTime
                  ? summary.totalDistance / (summary.totalTime / 3600)
                  : 0,
                totalTime: summary.totalTime,
                count: summary.count,
                maxDistance: summary.maxDistance,
                maxSpeed: summary.maxSpeed,
                location: summary.location,
              }}
              dailyDistances={summary.dailyDistances}
              interval={interval}
            />
          ))}
        </div>
      )}
      {interval !== 'life' && totalPages > 1 && (
        <nav className={styles.pagination} aria-label="统计分页">
          <button
            type="button"
            onClick={() => changePage(page - 1)}
            disabled={page === 1}
          >
            ← 上一页
          </button>
          <label className={styles.pageSelect}>
            <span className="sr-only">跳转到页</span>
            <select
              value={page}
              onChange={(event) => changePage(Number(event.target.value))}
            >
              {Array.from({ length: totalPages }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  第 {index + 1} 页
                </option>
              ))}
            </select>
            <span>/ {totalPages}</span>
          </label>
          <button
            type="button"
            onClick={() => changePage(page + 1)}
            disabled={page === totalPages}
          >
            下一页 →
          </button>
        </nav>
      )}
    </Layout>
  );
};

export default ActivityList;
