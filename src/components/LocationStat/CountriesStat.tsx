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
    <section className="border-b border-[#e0ed5e]/30 py-5">
      <p className="mb-3 text-sm font-semibold text-[#cccccc]">跑过的国家</p>
      <div className="space-y-2">
        {countries.map(([country, cities]) => {
          const cityEntries = Object.entries(cities).sort(
            ([, distanceA], [, distanceB]) => distanceB - distanceA
          );
          const distance = countryDistances[country];
          const expanded = expandedCountry === country;

          return (
            <div key={country}>
              <button
                type="button"
                aria-expanded={expanded}
                className="flex min-h-[48px] w-full items-center justify-between rounded-lg border border-[#e0ed5e]/25 bg-[#252525] px-4 text-left transition-colors hover:border-[#e0ed5e]/60"
                onClick={() =>
                  setExpandedCountry(expanded ? undefined : country)
                }
              >
                <span className="text-xl font-bold italic">{country}</span>
                <span className="text-sm text-[#cccccc]">
                  {cityEntries.length
                    ? `${cityEntries.length} 城市`
                    : '暂无城市记录'}{' '}
                  · {(distance / 1000).toFixed(0)} KM{' '}
                  <span aria-hidden="true">{expanded ? '−' : '+'}</span>
                </span>
              </button>
              {expanded && (
                <div className="mt-2 grid grid-cols-1 gap-2 pl-3 sm:grid-cols-2">
                  {cityEntries.length ? (
                    cityEntries.map(([city, cityDistance]) => {
                      const selected = city === selectedCity;
                      return (
                        <button
                          key={city}
                          type="button"
                          className={`flex min-h-[44px] items-center justify-between rounded-lg px-3 text-left text-sm transition-colors ${
                            selected
                              ? 'bg-[#e0ed5e] font-semibold text-[#1a1a1a]'
                              : 'bg-[#252525] text-[#f4f4f4] hover:bg-[#303030]'
                          }`}
                          onClick={() => onCityClick(city)}
                        >
                          <span>{city}</span>
                          <span>{(cityDistance / 1000).toFixed(0)} KM</span>
                        </button>
                      );
                    })
                  ) : (
                    <p className="py-2 text-sm text-[#8f8f8f]">
                      这部分活动仅记录到国家，暂无可展示的城市资料。
                    </p>
                  )}
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
