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
import useSiteMetadata from '@/hooks/useSiteMetadata';
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
  if (typeof window === 'undefined') {
    return { longitude: 105, latitude: 45, zoom: 0.8 };
  }
  if (window.innerWidth < 1024) {
    return { longitude: 105, latitude: 45, zoom: 0 };
  }
  const containerWidth = Math.max(500, (window.innerWidth - 128) * (2 / 3));
  const zoom = Math.min(1.3, Math.max(0.5, Math.log2(containerWidth / 512)));
  return { longitude: 105, latitude: 45, zoom };
};

const Index = () => {
  const { siteTitle } = useSiteMetadata();
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
    setTitle(`${item} ${name} Running Heatmap`);
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
    <Layout
      headerActions={
        <YearFilter
          year={year}
          displayedYear={displayedYear}
          onChange={changeYear}
          className="hidden lg:flex"
        />
      }
      contentClassName="flex flex-wrap lg:grid lg:grid-cols-[1fr_2fr] lg:[grid-template-areas:'title_map''info_map''countries_svg''periods_svg']"
    >
      <div className="w-full lg:[grid-area:title]">
        <h1 className="my-8 hidden text-4xl font-extrabold italic lg:my-12 lg:block lg:text-5xl">
          <a href="/">{siteTitle}</a>
        </h1>
      </div>
      <div className="w-full lg:[grid-area:map]">
        <RunMap
          title={title}
          viewState={viewState}
          geoData={geoData}
          setViewState={setViewState}
          year={year}
          displayedYear={displayedYear}
          changeYear={changeYear}
        />
        <p className="mb-8 mt-6 text-sm leading-relaxed text-[#f4f4f4] lg:hidden">
          希望随着时间推移，地图点亮的地方越来越多。不要停下来，不要停下奔跑的脚步。
        </p>
      </div>
      {IS_CHINESE && (
        <>
          <div className="w-1/2 pr-2 lg:w-auto lg:pr-16 lg:[grid-area:info]">
            <section className="mb-10 hidden lg:block">
              <p className="leading-relaxed">
                希望随着时间推移，地图点亮的地方越来越多。不要停下来，不要停下奔跑的脚步。
                <br />
                Yesterday you said tomorrow.
              </p>
            </section>
            <LocationSummary />
          </div>
          <div className="w-1/2 pl-2 lg:w-auto lg:pl-0 lg:pr-16 lg:[grid-area:periods]">
            <PeriodStat onClick={changeTitle} />
          </div>
          <div className="w-full lg:pr-16 lg:[grid-area:countries]">
            <CountriesStat
              onCityClick={changeCity}
              selectedCity={selectedCity}
            />
          </div>
        </>
      )}
      <div
        className={`w-full lg:[grid-area:svg] ${
          year === 'Total' && !hasDetailFilter
            ? 'lg:max-h-[1120px] lg:overflow-y-auto'
            : ''
        }`}
      >
        {year === 'Total' && !hasDetailFilter ? (
          <SVGStat />
        ) : (
          <RunTable
            runs={runs}
            locateActivity={locateActivity}
            setActivity={setActivity}
            runIndex={runIndex}
            setRunIndex={setRunIndex}
          />
        )}
      </div>
      {/* Enable Audiences in Vercel Analytics: https://vercel.com/docs/concepts/analytics/audiences/quickstart */}
      {import.meta.env.VERCEL && <Analytics /> }
    </Layout>
  );
};

export default Index;
