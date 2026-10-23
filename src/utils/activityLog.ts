import activities from '@/static/activities.json';
import {
  Activity,
  Coordinate,
  locationForRun,
  pathForRun,
  titleForRun,
} from './utils';

// Reuse only the site's existing public dataset. Overview markers are approximate.
export const logEntries = (activities as Activity[])
  .map((run) => {
    const location = locationForRun(run);
    const place =
      location.city || location.province || location.country || '未标注地点';
    const placeKey =
      [location.country, location.province, location.city]
        .filter(Boolean)
        .join(' · ') || '未标注地点';
    const points = pathForRun(run).filter(
      ([lng, lat]) =>
        Number.isFinite(lng) &&
        Number.isFinite(lat) &&
        Math.abs(lng) <= 180 &&
        Math.abs(lat) <= 85
    );
    const hasRoute =
      points.length > 1 &&
      points.some(
        (point) => point[0] !== points[0][0] || point[1] !== points[0][1]
      );
    const center: Coordinate | null = points.length
      ? [
          Math.round(
            (points.reduce((sum, point) => sum + point[0], 0) / points.length) *
              10
          ) / 10,
          Math.round(
            (points.reduce((sum, point) => sum + point[1], 0) / points.length) *
              10
          ) / 10,
        ]
      : null;
    return {
      run,
      id: String(run.run_id),
      date: run.start_date_local.slice(0, 10),
      place,
      placeKey,
      points,
      center,
      hasRoute,
      title: titleForRun(run),
    };
  })
  .sort((a, b) => b.run.start_date_local.localeCompare(a.run.start_date_local));

export type LogEntry = (typeof logEntries)[number];
export const logYears = [
  ...new Set(logEntries.map((entry) => entry.date.slice(0, 4))),
]
  .sort()
  .reverse();
export const isRunning = (type: string) =>
  ['run', 'virtualrun'].includes(type.toLowerCase());
export const latestRunYear =
  logEntries.find((entry) => isRunning(entry.run.type))?.date.slice(0, 4) ||
  logYears[0];
export const logPace = (entry: LogEntry) => {
  if (!(entry.run.average_speed > 0)) return '—';
  const seconds = Math.round(1000 / entry.run.average_speed);
  return `${Math.floor(seconds / 60)}′${String(seconds % 60).padStart(2, '0')}″`;
};
export const logDuration = (entry: LogEntry) => {
  const parts = entry.run.moving_time.split(', ');
  const time = parts[parts.length - 1];
  return parts.length > 1 ? entry.run.moving_time : time;
};
export const filterLogEntries = (params: URLSearchParams) => {
  const year = params.get('year') || 'all';
  const allTypes = params.get('type') === 'all';
  const city = params.get('city');
  const title = params.get('title');
  const date = params.get('date');
  return logEntries.filter(
    (entry) =>
      (allTypes || isRunning(entry.run.type)) &&
      (year === 'all' || entry.date.startsWith(year)) &&
      (!city || entry.run.location_country?.includes(city)) &&
      (!title || entry.title === title) &&
      (!date || entry.date === date)
  );
};

// Disjoint ranges in meters; each measured distance belongs to exactly one band.
export const distanceBands = [
  { id: 'under5', label: '<5 km', min: 0, max: 5000 },
  { id: '5to10', label: '5 km+', min: 5000, max: 10000 },
  { id: '10tohalf', label: '10 km+', min: 10000, max: 21097.5 },
  { id: 'halftofull', label: '半马+', min: 21097.5, max: 42195 },
  { id: 'fullplus', label: '全马+', min: 42195, max: Infinity },
];
export const matchesDistance = (meters: number, band: string) => {
  const range = distanceBands.find((item) => item.id === band);
  return !range || (meters >= range.min && meters < range.max);
};
