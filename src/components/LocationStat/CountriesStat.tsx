import { useState } from 'react';
import useActivities from '@/hooks/useActivities';

interface ICountriesStatProps {
  onCityClick: (_city: string) => void;
  selectedCity?: string;
}

const CountriesStat = ({ onCityClick, selectedCity }: ICountriesStatProps) => {
  const { countryCities, countryDistances } = useActivities();
  const [expandedCountry, setExpandedCountry] = useState<string>();
  const countries = Object.entries(countryCities).sort(
    ([countryA], [countryB]) =>
      countryDistances[countryB] - countryDistances[countryA]
  );

  return (
    <section className="country-list">
      <p className="mb-3 text-sm font-semibold text-[var(--muted)]">
        跑过的国家
      </p>
      <div className="flex flex-wrap gap-2 lg:grid lg:grid-cols-1">
        {countries.map(([country, cities]) => {
          const cityEntries = Object.entries(cities).sort(
            ([, distanceA], [, distanceB]) => distanceB - distanceA
          );
          const distance = countryDistances[country];
          const hasCities = cityEntries.length > 0;
          const expanded = expandedCountry === country;
          const km = (distance / 1000).toFixed(0);
          const mobileLabel = hasCities
            ? expanded
              ? '收起'
              : `${cityEntries.length}城，${km} km`
            : `${km} km`;
          const desktopLabel = hasCities
            ? `${expanded ? '收起' : '点击查看'} ${cityEntries.length} 城市 · ${km} km`
            : `${km} km`;
          const cardClassName =
            'flex w-auto items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--page)] px-3 py-2 text-left lg:min-h-[40px] lg:w-full lg:justify-between lg:gap-2 lg:rounded-md';

          return (
            <div key={country} className="contents lg:block">
              {hasCities ? (
                <button
                  type="button"
                  aria-expanded={expanded}
                  className={`${cardClassName} transition-colors hover:border-[rgb(var(--accent-rgb))]/60`}
                  onClick={() =>
                    setExpandedCountry(expanded ? undefined : country)
                  }
                >
                  <span className="text-sm font-medium lg:text-base">
                    {country}
                  </span>
                  <span className="text-xs text-[var(--muted)] lg:hidden">
                    {mobileLabel}
                  </span>
                  <span className="hidden text-xs text-[var(--muted)] lg:inline">
                    {desktopLabel}
                  </span>
                </button>
              ) : (
                <div className={cardClassName}>
                  <span className="text-sm font-medium lg:text-base">
                    {country}
                  </span>
                  <span className="text-xs text-[var(--muted)] lg:hidden">
                    {mobileLabel}
                  </span>
                  <span className="hidden text-xs text-[var(--muted)] lg:inline">
                    {desktopLabel}
                  </span>
                </div>
              )}
              {hasCities && expanded && (
                <div className="mt-2 grid w-full grid-cols-1 gap-2 pl-3 sm:grid-cols-2">
                  {cityEntries.map(([city, cityDistance]) => {
                    const selected = city === selectedCity;
                    return (
                      <button
                        key={city}
                        type="button"
                        className={`flex min-h-[44px] items-center justify-between rounded-lg px-3 text-left text-sm transition-colors ${
                          selected
                            ? 'bg-[rgb(var(--accent-rgb))] font-semibold text-[var(--on-accent)]'
                            : 'bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface)]'
                        }`}
                        onClick={() => onCityClick(city)}
                      >
                        <span>{city}</span>
                        <span>{(cityDistance / 1000).toFixed(0)} km</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CountriesStat;
