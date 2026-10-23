import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Layout from '@/components/Layout';
import CountriesStat from '@/components/LocationStat/CountriesStat';
import LocationSummary from '@/components/LocationStat/LocationSummary';
import PeriodStat from '@/components/LocationStat/PeriodStat';
import RunMap from '@/components/RunMap';
import RunTable from '@/components/RunTable';
import SVGStat from '@/components/SVGStat';
import YearFilter from '@/components/YearFilter';
import useActivities from '@/hooks/useActivities';
import { IS_CHINESE } from '@/utils/const';
import {
  Activity,
  IViewState,
  filterAndSortRuns,
  filterCityRuns,
  filterTitleRuns,
  filterYearRuns,
  geoJsonForRuns,
  getBoundsForGeoData,
  scrollToMap,
  sortDateFunc,
  titleForShow,
  RunIds,
} from '@/utils/utils';

const worldView = (): IViewState => {
  const viewport = typeof window === 'undefined' ? 1280 : window.innerWidth;
  const width =
    viewport >= 1024
      ? Math.min(1240, viewport) - 408
      : viewport - (viewport > 600 ? 48 : viewport <= 350 ? 32 : 40);
  return { longitude: 0, latitude: 24, zoom: Math.log2(width / 540) };
};

const Index = () => {
  const { activities, thisYear } = useActivities();
  const [year, setYear] = useState('Total');
  const [displayedYear, setDisplayedYear] = useState(thisYear);
  const [runIndex, setRunIndex] = useState(-1);
  const [runs, setActivity] = useState(
    filterAndSortRuns(activities, 'Total', filterYearRuns, sortDateFunc)
  );
  const [title, setTitle] = useState('');
  const [geoData, setGeoData] = useState(geoJsonForRuns(runs));
  const [isWorldOverview, setIsWorldOverview] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [hasDetailFilter, setHasDetailFilter] = useState(false);
  // for auto zoom
  const bounds = getBoundsForGeoData(geoData);
  const [intervalId, setIntervalId] = useState<number>();

  const [viewState, setViewState] = useState<IViewState>(worldView());

  const changeByItem = (
    item: string,
    name: string,
    func: (_run: Activity, _value: string) => boolean
  ) => {
    scrollToMap();
    setActivity(filterAndSortRuns(activities, item, func, sortDateFunc));
    setRunIndex(-1);
    setTitle(
      item === 'Total'
        ? ''
        : `${item}${name === 'Year' ? ' 年' : ''} · 活动记录`
    );
  };

  const changeYear = (y: string) => {
    // default year
    setYear(y);
    if (y !== 'Total') {
      setDisplayedYear(y);
    }
    setSelectedCity('');
    setHasDetailFilter(false);
    setIsWorldOverview(y === 'Total');

    if (y === 'Total') {
      setViewState({ ...worldView() });
    } else if ((viewState.zoom ?? 0) > 3 && bounds) {
      setViewState({
        ...bounds,
      });
    }

    changeByItem(y, 'Year', filterYearRuns);
    clearInterval(intervalId);
  };

  const changeCity = (city: string) => {
    setYear('Total');
    setSelectedCity(city);
    setHasDetailFilter(true);
    setIsWorldOverview(false);
    changeByItem(city, 'City', filterCityRuns);
  };

  const changeTitle = (runTitle: string) => {
    setYear('Total');
    setSelectedCity('');
    setHasDetailFilter(true);
    setIsWorldOverview(false);
    changeByItem(runTitle, 'Title', filterTitleRuns);
  };

  const locateActivity = (runIds: RunIds) => {
    const ids = new Set(runIds);

    const selectedRuns = !runIds.length
      ? runs
      : runs.filter((r: any) => ids.has(r.run_id));

    if (!selectedRuns.length) {
      return;
    }

    const lastRun = selectedRuns.sort(sortDateFunc)[0];

    if (!lastRun) {
      return;
    }
    setIsWorldOverview(false);
    setGeoData(geoJsonForRuns(selectedRuns));
    setTitle(titleForShow(lastRun));
    clearInterval(intervalId);
    scrollToMap();
  };

  useEffect(() => {
    setViewState({
      ...(isWorldOverview ? worldView() : bounds),
    });
  }, [geoData, isWorldOverview]);

  useEffect(() => {
    const runsNum = runs.length;
    // maybe change 20 ?
    const sliceNume = runsNum >= 20 ? runsNum / 20 : 1;
    let i = sliceNume;
    const id = setInterval(() => {
      if (i >= runsNum) {
        clearInterval(id);
      }

      const tempRuns = runs.slice(0, i);
      setGeoData(geoJsonForRuns(tempRuns));
      i += sliceNume;
    }, 100);
    setIntervalId(id);
  }, [runs]);

  useEffect(() => {
    if (year !== 'Total') {
      return;
    }

    let svgStat = document.getElementById('svgStat');
    if (!svgStat) {
      return;
    }

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'path') {
        // Use querySelector to get the <desc> element and the <title> element.
        const descEl = target.querySelector('desc');
        if (descEl) {
          // If the runId exists in the <desc> element, it means that a running route has been clicked.
          const runId = Number(descEl.innerHTML);
          if (!runId) {
            return;
          }
          locateActivity([runId]);
          return;
        }

        const titleEl = target.querySelector('title');
        if (titleEl) {
          // If the runDate exists in the <title> element, it means that a date square has been clicked.
          const [runDate] = titleEl.innerHTML.match(
            /\d{4}-\d{1,2}-\d{1,2}/
          ) || [`${+thisYear + 1}`];
          const runIDsOnDate = runs
            .filter((r) => r.start_date_local.slice(0, 10) === runDate)
            .map((r) => r.run_id);
          if (!runIDsOnDate.length) {
            return;
          }
          locateActivity(runIDsOnDate);
        }
      }
    };
    svgStat.addEventListener('click', handleClick);
    return () => {
      svgStat && svgStat.removeEventListener('click', handleClick);
    };
  }, [year]);

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
          <YearFilter
            year={year}
            displayedYear={displayedYear}
            onChange={changeYear}
          />
        </div>
        <RunMap
          title={title}
          viewState={viewState}
          geoData={geoData}
          setViewState={setViewState}
        />
        <div className="map-caption">
          <span>
            <i
              style={
                (viewState.zoom ?? 0) > 3
                  ? { background: '#a44922' }
                  : undefined
              }
            />{' '}
            {(viewState.zoom ?? 0) > 3 ? '活动路线' : '跑过的国家与省份'}
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
            <PeriodStat onClick={changeTitle} />
          </div>
          <div className="countries-section">
            <CountriesStat
              onCityClick={changeCity}
              selectedCity={selectedCity}
            />
          </div>
        </>
      )}
      <section className="history-section">
        {year === 'Total' && !hasDetailFilter ? (
          <SVGStat locateActivity={locateActivity} />
        ) : (
          <>
            <div className="section-toolbar">
              <h2>{title || '活动记录'}</h2>
              <button
                className="text-button"
                onClick={() => changeYear('Total')}
              >
                查看全部
              </button>
            </div>
            <RunTable
              runs={runs}
              locateActivity={locateActivity}
              setActivity={setActivity}
              runIndex={runIndex}
              setRunIndex={setRunIndex}
            />
          </>
        )}
      </section>
      {import.meta.env.VERCEL && <Analytics />}
    </Layout>
  );
};
export default Index;
