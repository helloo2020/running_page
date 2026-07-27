import { locationForRun, titleForRun } from '@/utils/utils';
import activities from '@/static/activities.json';

const useActivities = () => {
  const cities: Record<string, number> = {};
  const countryCities: Record<string, Record<string, number>> = {};
  const countryDistances: Record<string, number> = {};
  const runPeriod: Record<string, number> = {};
  const provinces: Set<string> = new Set();
  const countries: Set<string> = new Set();
  let years: Set<string> = new Set();
  let thisYear = '';

  activities.forEach((run) => {
    const location = locationForRun(run);

    const periodName = titleForRun(run);
    if (periodName) {
      runPeriod[periodName] = runPeriod[periodName]
        ? runPeriod[periodName] + 1
        : 1;
    }

    const { city, province, country } = location;
    const countryName = country || (province || city ? '中国' : '');
    if (countryName) {
      countries.add(countryName);
      countryCities[countryName] ||= {};
      countryDistances[countryName] =
        (countryDistances[countryName] || 0) + run.distance;
    }

    // drop only one char city
    if (city.length > 1) {
      cities[city] = cities[city] ? cities[city] + run.distance : run.distance;
      if (countryName) {
        countryCities[countryName][city] = countryCities[countryName][city]
          ? countryCities[countryName][city] + run.distance
          : run.distance;
      }
    }
    if (province) provinces.add(province);
    const year = run.start_date_local.slice(0, 4);
    years.add(year);
  });

  let yearsArray = [...years].sort().reverse();
  if (years) [thisYear] = yearsArray; // set current year as first one of years array

  return {
    activities,
    years: yearsArray,
    countries: [...countries],
    provinces: [...provinces],
    cities,
    countryCities,
    countryDistances,
    runPeriod,
    thisYear,
  };
};

export default useActivities;
