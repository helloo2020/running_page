import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import LogMap from '@/components/LogMap';
import {
  filterLogEntries,
  distanceBands,
  matchesDistance,
  logYears,
  logPace,
  logDuration,
  logEntries,
  isRunning,
} from '@/utils/activityLog';

const PAGE_SIZE = 10;
const hasOtherActivities = logEntries.some(
  (entry) => !isRunning(entry.run.type)
);
const scrollTo = (element: HTMLElement | null) =>
  element?.scrollIntoView({
    block: 'start',
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth',
  });

export default function ActivityLog() {
  const [params, setParams] = useSearchParams();
  const mapSection = useRef<HTMLElement>(null);
  const listSection = useRef<HTMLElement>(null);
  const scopeParams = new URLSearchParams();
  ['year', 'type', 'city', 'title', 'date'].forEach((name) => {
    const value = params.get(name);
    if (value) scopeParams.set(name, value);
  });
  const key = scopeParams.toString();
  const year = params.get('year') || 'all';
  const distanceView = params.get('view') === 'distance';
  const routeView = params.get('map') !== 'places';
  const band = distanceView ? params.get('distance') || 'all' : 'all';
  const selectedBand = distanceBands.find((item) => item.id === band);
  const month = distanceView ? 'all' : params.get('month') || 'all';
  const place = params.get('place') || '';
  const scopeEntries = useMemo(
    () => filterLogEntries(new URLSearchParams(key)),
    [key]
  );
  const months = [
    ...new Set(scopeEntries.map((entry) => entry.date.slice(5, 7))),
  ].sort();
  const monthEntries = useMemo(
    () =>
      scopeEntries.filter(
        (entry) =>
          (month === 'all' || entry.date.slice(5, 7) === month) &&
          matchesDistance(entry.run.distance, band)
      ),
    [scopeEntries, month, band]
  );
  const entries = useMemo(
    () => monthEntries.filter((entry) => !place || entry.placeKey === place),
    [monthEntries, place]
  );
  const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));
  const page = Math.max(
    1,
    Math.min(totalPages, Math.floor(Number(params.get('page'))) || 1)
  );
  const visibleEntries = entries.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
  const selected = entries.find((entry) => entry.id === params.get('activity'));
  const unlocated = entries.filter((entry) => !entry.center).length;
  const routeCount = entries.filter((entry) => entry.hasRoute).length;
  const allTypes = params.get('type') === 'all';
  const period = `${year === 'all' ? '全部年份' : year + ' 年'}${month === 'all' ? '' : ' · ' + Number(month) + ' 月'}`;
  const distance = entries.reduce(
    (sum, entry) => sum + entry.run.distance / 1000,
    0
  );
  const extraFilters = ['date', 'city', 'title', 'place'].filter((name) =>
    params.has(name)
  );
  const update = (
    values: Record<string, string | null>,
    clear = ['page', 'activity']
  ) => {
    const next = new URLSearchParams(params);
    clear.forEach((name) => next.delete(name));
    Object.entries(values).forEach(([name, value]) =>
      value === null ? next.delete(name) : next.set(name, value)
    );
    setParams(next);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const changePage = (next: number) => {
    update({ page: String(next) }, ['activity']);
    listSection.current?.focus({ preventScroll: true });
    scrollTo(listSection.current);
  };
  return (
    <Layout contentClassName="log-page">
      <Helmet>
        <title>跑步日志 · Scond</title>
      </Helmet>
      <header className="log-heading">
        <div>
          <h1>跑步日志</h1>
          <p>回看每一次跑步。</p>
        </div>
        <label className="log-year">
          <span className="sr-only">日志年份</span>
          <select
            aria-label="日志年份"
            value={year}
            onChange={(event) =>
              update({ year: event.target.value }, [
                'page',
                'activity',
                'month',
                'date',
                'place',
              ])
            }
          >
            <option value="all">全部年份</option>
            {logYears.map((item) => (
              <option key={item} value={item}>
                {item} 年
              </option>
            ))}
          </select>
        </label>
      </header>
      <section
        className="log-map-section"
        ref={mapSection}
        tabIndex={-1}
        aria-label="日志地图"
      >
        <div className="log-map-heading">
          <h2>
            {selected
              ? `${selected.date} · ${selected.title}`
              : `${period} · ${routeView ? '跑步轨迹' : allTypes ? '活动地点' : '跑步地点'}`}
          </h2>
          {!selected && (
            <div
              className="log-type log-segment"
              role="group"
              aria-label="地图视图"
            >
              <button
                aria-pressed={!routeView}
                onClick={() => update({ map: 'places' }, [])}
              >
                地点
              </button>
              <button
                aria-pressed={routeView}
                onClick={() => update({ map: 'routes' }, [])}
              >
                轨迹
              </button>
            </div>
          )}
          {selected && (
            <button
              className="text-button"
              onClick={() => update({ activity: null }, [])}
            >
              返回{routeView ? '轨迹总览' : '地点概览'}
            </button>
          )}
        </div>
        <LogMap
          entries={entries}
          selected={selected}
          showRoutes={routeView}
          onPlace={(value) => update({ place: value })}
          onRoute={(id) =>
            update(
              {
                activity: id,
                page: String(
                  Math.floor(
                    entries.findIndex((entry) => entry.id === id) / PAGE_SIZE
                  ) + 1
                ),
              },
              []
            )
          }
        />
        <div className="log-map-caption">
          <span>
            {selected
              ? `${(selected.run.distance / 1000).toFixed(2)} 公里 · ${logPace(selected)} /公里 · ${logDuration(selected)}`
              : `${entries.length} 次${allTypes ? '活动' : '跑步'} · ${distance.toLocaleString('zh-CN', { maximumFractionDigits: 1 })} 公里${routeView ? ` · ${routeCount} 条轨迹` : unlocated ? ` · ${unlocated} 条暂无位置` : ''}`}
          </span>
          <button
            className="text-button log-clear"
            disabled={
              ![
                'view',
                'year',
                'month',
                'distance',
                'place',
                'city',
                'date',
                'title',
                'type',
                'activity',
                'page',
              ].some((name) => params.has(name) && params.get(name) !== 'all')
            }
            onClick={() => setParams(routeView ? {} : { map: 'places' })}
          >
            清除筛选
          </button>
        </div>
      </section>
      <section
        className="log-list-section"
        ref={listSection}
        tabIndex={-1}
        aria-label="日志清单"
      >
        <div className="log-list-heading">
          <h2>记录清单</h2>
          <div
            className="log-type log-segment"
            role="group"
            aria-label="记录浏览方式"
          >
            <button
              aria-pressed={!distanceView}
              onClick={() =>
                update({ view: null }, [
                  'page',
                  'activity',
                  'month',
                  'distance',
                ])
              }
            >
              时间
            </button>
            <button
              aria-pressed={distanceView}
              onClick={() =>
                update({ view: 'distance' }, [
                  'page',
                  'activity',
                  'month',
                  'distance',
                ])
              }
            >
              距离
            </button>
          </div>
          {hasOtherActivities && (
            <div className="log-type" role="group" aria-label="活动范围">
              <button
                aria-pressed={!allTypes}
                onClick={() =>
                  update({ type: null }, [
                    'page',
                    'activity',
                    'date',
                    'place',
                    'title',
                    'month',
                  ])
                }
              >
                跑步
              </button>
              <button
                aria-pressed={allTypes}
                onClick={() =>
                  update({ type: 'all' }, [
                    'page',
                    'activity',
                    'date',
                    'place',
                    'title',
                    'month',
                  ])
                }
              >
                全部活动
              </button>
            </div>
          )}
        </div>
        {distanceView ? (
          <div className="log-distance-filters">
            <div className="log-months" role="group" aria-label="距离分类">
              <button
                aria-pressed={band === 'all'}
                onClick={() => update({ distance: null })}
              >
                全部
              </button>
              {distanceBands.map((item) => (
                <button
                  key={item.id}
                  aria-pressed={band === item.id}
                  onClick={(event) => {
                    update({ distance: item.id });
                    event.currentTarget.scrollIntoView({
                      block: 'nearest',
                      inline: 'nearest',
                    });
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {selectedBand && (
              <p className="log-distance-note" aria-live="polite">
                {selectedBand.max === Infinity
                  ? `距离 ≥ ${selectedBand.min / 1000} km`
                  : selectedBand.min === 0
                    ? `距离 < ${selectedBand.max / 1000} km`
                    : `${selectedBand.min / 1000} km ≤ 距离 < ${selectedBand.max / 1000} km`}
              </p>
            )}
          </div>
        ) : (
          <div
            key={year}
            className="log-months"
            role="group"
            aria-label="日志月份"
          >
            <button
              aria-pressed={month === 'all'}
              onClick={() =>
                update({ month: null }, ['page', 'activity', 'place'])
              }
            >
              全部
            </button>
            {months.map((item) => (
              <button
                key={item}
                aria-pressed={month === item}
                onClick={(event) => {
                  update({ month: item }, ['page', 'activity', 'place']);
                  event.currentTarget.scrollIntoView({
                    block: 'nearest',
                    inline: 'nearest',
                  });
                }}
              >
                {Number(item)}月
              </button>
            ))}
          </div>
        )}
        {extraFilters.length > 0 && (
          <div className="log-extra-filters">
            <span>
              {extraFilters.map((name) => params.get(name)).join(' · ')}
            </span>
          </div>
        )}
        <p className="log-list-status" aria-live="polite">
          {period}
          {band !== 'all' &&
            ` · ${distanceBands.find((item) => item.id === band)?.label || '全部'}`}{' '}
          · 共 {entries.length} 条
          {entries.length > 0 && ` · 第 ${page} / ${totalPages} 页`}
        </p>
        <div
          className={`log-column-head ${year === 'all' ? 'log-all-years' : ''}`}
          aria-hidden="true"
        >
          <span>日期</span>
          <span>地点</span>
          <span>距离 km</span>
          <span>配速 /km</span>
          <span className="log-time">用时</span>
          <span />
        </div>
        <ul className={`log-list ${year === 'all' ? 'log-all-years' : ''}`}>
          {visibleEntries.map((entry) => (
            <li key={entry.id}>
              <button
                className="log-row"
                aria-expanded={selected?.id === entry.id}
                aria-controls={`log-detail-${entry.id}`}
                onClick={() =>
                  update(
                    { activity: selected?.id === entry.id ? null : entry.id },
                    []
                  )
                }
                aria-label={`${entry.date}，${entry.place}，${entry.title}，${(entry.run.distance / 1000).toFixed(2)} 公里，配速 ${logPace(entry)}，展开详情`}
              >
                <time dateTime={entry.date}>
                  {year === 'all'
                    ? entry.date.slice(2).replaceAll('-', '.')
                    : entry.date.slice(5).replace('-', '.')}
                </time>
                <span className="log-place" title={entry.placeKey}>
                  {entry.place}
                </span>
                <strong>{(entry.run.distance / 1000).toFixed(2)}</strong>
                <span>{logPace(entry)}</span>
                <span className="log-time">{logDuration(entry)}</span>
                <span className="log-row-chevron" aria-hidden="true">
                  {selected?.id === entry.id ? '−' : '+'}
                </span>
              </button>
              {selected?.id === entry.id && (
                <div className="log-detail" id={`log-detail-${entry.id}`}>
                  <span>
                    {entry.title} · {entry.placeKey} · 用时 {logDuration(entry)}
                  </span>
                  <button
                    className="text-button"
                    onClick={() => {
                      mapSection.current?.focus({ preventScroll: true });
                      scrollTo(mapSection.current);
                    }}
                  >
                    查看{entry.hasRoute ? '路线' : '位置'} ↑
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
        {!entries.length && (
          <div className="log-empty">
            <p>这段时间没有符合条件的记录。</p>
            <button className="text-button" onClick={() => setParams({})}>
              查看全部记录
            </button>
          </div>
        )}
        {entries.length > 0 && (
          <nav className="log-pagination" aria-label="日志分页">
            <button disabled={page === 1} onClick={() => changePage(page - 1)}>
              ← 上一页
            </button>
            <label>
              <span className="sr-only">日志页码</span>
              <select
                aria-label="日志页码"
                value={page}
                onChange={(event) => changePage(Number(event.target.value))}
              >
                {Array.from({ length: totalPages }, (_, index) => (
                  <option key={index} value={index + 1}>
                    第 {index + 1} 页
                  </option>
                ))}
              </select>
              <span> / {totalPages}</span>
            </label>
            <button
              disabled={page === totalPages}
              onClick={() => changePage(page + 1)}
            >
              下一页 →
            </button>
          </nav>
        )}
        <p className="log-list-note">每页 10 条 · 点击记录展开详情</p>
      </section>
    </Layout>
  );
}
