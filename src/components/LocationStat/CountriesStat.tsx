import { useState } from 'react';
import useActivities from '@/hooks/useActivities';

interface ICountriesStatProps {
  onCityClick: (_city: string) => void;
  selectedCity?: string;
}

const CountriesStat = ({ onCityClick, selectedCity }: ICountriesStatProps) => {
  const { countryCities, countryDistances } = useActivities();
  const [expandedCountry, setExpandedCountry] = useState<string | undefined>(
    '中国'
  );
  const countries = Object.entries(countryCities).sort(
    ([countryA], [countryB]) =>
      countryDistances[countryB] - countryDistances[countryA]
  );

  return (
    <section className="border-b border-[rgb(var(--accent-rgb))]/30 py-3 lg:pb-2 lg:pl-4">
      <p className="mb-3 text-sm font-semibold text-[var(--muted)]">跑过的国家</p>
      <div className="flex flex-wrap gap-2">
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
              : `${cityEntries.length}城，${km}KM`
            : `${km}KM`;
          const cardClassName =
            'flex w-auto items-center gap-1.5 rounded-full border border-[rgb(var(--accent-rgb))]/25 bg-[var(--surface)] px-3 py-1 text-left';

          return (
            <div key={country} className="contents">
              {hasCities ? (
                <button
                  type="button"
                  aria-expanded={expanded}
                  className={`${cardClassName} transition-colors hover:border-[rgb(var(--accent-rgb))]/60`}
                  onClick={() =>
                    setExpandedCountry(expanded ? undefined : country)
                  }
                >
                  <span className="text-sm font-bold italic">
                    {country}
                  </span>
                  <span className="text-xs text-[var(--muted)]">{mobileLabel}</span>
                </button>
              ) : (
                <div className={cardClassName}>
                  <span className="text-sm font-bold italic">
                    {country}
                  </span>
                  <span className="text-xs text-[var(--muted)]">{mobileLabel}</span>
                </div>
              )}
              {hasCities && expanded && (
                <div className="mt-2 flex w-full flex-wrap gap-2 pl-3">
                  {cityEntries.map(([city, cityDistance]) => {
                    const selected = city === selectedCity;
                    return (
                      <button
                        key={city}
                        type="button"
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-left text-sm transition-colors ${
                          selected
                            ? 'border-[rgb(var(--accent-rgb))] bg-[rgb(var(--accent-rgb))] font-semibold text-[var(--on-accent)]'
                            : 'border-[rgb(var(--accent-rgb))]/25 bg-[var(--surface)] text-[var(--ink)] hover:border-[rgb(var(--accent-rgb))]/60 hover:bg-[var(--surface)]'
                        }`}
                        onClick={() => onCityClick(city)}
                      >
                        <span>{city}</span>
                        <span
                          className={`text-xs ${
                            selected ? 'text-[var(--on-accent)]' : 'text-[var(--muted)]'
                          }`}
                        >
                          {(cityDistance / 1000).toFixed(0)} KM
                        </span>
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
