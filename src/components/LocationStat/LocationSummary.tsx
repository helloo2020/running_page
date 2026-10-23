import Stat from '@/components/Stat';
import useActivities from '@/hooks/useActivities';

// only support China for now
const LocationSummary = () => {
  const { years, countries, provinces, cities } = useActivities();
  return (
    <div className="stat-section">
      <p className="mb-3 text-sm font-semibold text-[var(--muted)]">我的统计</p>
      <section>
        {years ? (
          <Stat
            value={years.length}
            description=" 年里我跑过"
            citySize={4}
            valueClassName="text-[var(--ink)]"
            descriptionClassName="text-sm text-[var(--muted)]"
          />
        ) : null}
        {countries ? (
          <Stat
            value={countries.length}
            description=" 个国家"
            citySize={4}
            valueClassName="text-[var(--ink)]"
            descriptionClassName="text-sm text-[var(--muted)]"
          />
        ) : null}
        {provinces ? (
          <Stat
            value={provinces.length}
            description=" 个省份"
            citySize={4}
            valueClassName="text-[var(--ink)]"
            descriptionClassName="text-sm text-[var(--muted)]"
          />
        ) : null}
        {cities ? (
          <Stat
            value={Object.keys(cities).length}
            description=" 个城市"
            citySize={4}
            valueClassName="text-[var(--ink)]"
            descriptionClassName="text-sm text-[var(--muted)]"
          />
        ) : null}
      </section>
    </div>
  );
};

export default LocationSummary;
