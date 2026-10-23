import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Layout from '@/components/Layout';
import CountriesStat from '@/components/LocationStat/CountriesStat';
import LocationSummary from '@/components/LocationStat/LocationSummary';
import PeriodStat from '@/components/LocationStat/PeriodStat';
import RunMap from '@/components/RunMap';
import SVGStat from '@/components/SVGStat';
import useActivities from '@/hooks/useActivities';
import { IS_CHINESE } from '@/utils/const';
import { IViewState, RunIds, geoJsonForRuns } from '@/utils/utils';

const emptyRoutes = geoJsonForRuns([]);
const worldView = (): IViewState => {
  const viewport = typeof window === 'undefined' ? 1280 : window.innerWidth;
  const width =
    viewport >= 1024 ? Math.min(1240, viewport) - 408 : viewport - 40;
  return { longitude: 0, latitude: 24, zoom: Math.log2(width / 540) };
};

const Index = () => {
  const navigate = useNavigate();
  const { activities } = useActivities();
  const [viewState, setViewState] = useState<IViewState>(worldView);
  const locateActivity = (ids: RunIds) => {
    const run = activities.find((item) =>
      new Set<number>(ids).has(item.run_id)
    );
    if (!run) return;
    const params = new URLSearchParams({
      year: run.start_date_local.slice(0, 4),
      date: run.start_date_local.slice(0, 10),
      type: 'all',
    });
    if (ids.length === 1) params.set('activity', String(run.run_id));
    navigate(`/log?${params}`);
  };
  useEffect(() => {
    const root = document.getElementById('svgStat');
    const onClick = (event: Event) => {
      const path = (event.target as Element).closest('path');
      const id = Number(path?.querySelector('desc')?.textContent);
      if (id) locateActivity([id]);
    };
    root?.addEventListener('click', onClick);
    return () => root?.removeEventListener('click', onClick);
  }, [activities]);
  return (
    <Layout contentClassName="running-layout">
      <section className="running-intro">
        <h1>跑步记录</h1>
        <p>
          希望随着时间推移，地图点亮的地方越来越多。不要停下来，不要停下奔跑的脚步。
        </p>
      </section>
      <section className="map-section" aria-label="跑步足迹">
        <div className="section-toolbar">
          <h2>跑过的地方</h2>
          <Link className="text-button" to="/log">
            跑步日志 ↗
          </Link>
        </div>
        <RunMap
          title=""
          viewState={viewState}
          geoData={emptyRoutes}
          setViewState={setViewState}
        />
        <div className="map-caption">
          <span>
            <i /> 历年跑过的国家与省份
          </span>
          <span>可拖动、缩放地图</span>
        </div>
      </section>
      {IS_CHINESE && (
        <>
          <div className="overview-section">
            <LocationSummary />
          </div>
          <div className="period-section">
            <PeriodStat
              onClick={(title) =>
                navigate(
                  `/log?${new URLSearchParams({ year: 'all', type: 'all', title })}`
                )
              }
            />
          </div>
          <div className="countries-section">
            <CountriesStat
              onCityClick={(city) =>
                navigate(
                  `/log?${new URLSearchParams({ year: 'all', type: 'all', city })}`
                )
              }
            />
          </div>
        </>
      )}
      <section className="history-section">
        <SVGStat locateActivity={locateActivity} />
      </section>
      {import.meta.env.VERCEL && <Analytics />}
    </Layout>
  );
};
export default Index;
