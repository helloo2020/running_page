import Stat from '@/components/Stat';
import useActivities from '@/hooks/useActivities';

// only support China for now
const LocationSummary = () => {
  const { years, countries, provinces, cities } = useActivities();
  return (
    <div className="mb-8 rounded-xl border border-[#e0ed5e]/20 bg-[#252525] p-4">
      <p className="mb-3 text-sm font-semibold text-[#cccccc]">我的统计</p>
      <section>
        {years ? (
          <Stat
            value={years.length}
            description=" 年里我跑过"
            citySize={4}
            valueClassName="text-[#e0ed5e]"
            descriptionClassName="text-sm text-[#cccccc]"
          />
        ) : null}
        {countries ? (
          <Stat
            value={countries.length}
            description=" 个国家"
            citySize={4}
            valueClassName="text-[#e0ed5e]"
            descriptionClassName="text-sm text-[#cccccc]"
          />
        ) : null}
        {provinces ? (
          <Stat
            value={provinces.length}
            description=" 个省份"
            citySize={4}
            valueClassName="text-[#e0ed5e]"
            descriptionClassName="text-sm text-[#cccccc]"
          />
        ) : null}
        {cities ? (
          <Stat
            value={Object.keys(cities).length}
            description=" 个城市"
            citySize={4}
            valueClassName="text-[#e0ed5e]"
            descriptionClassName="text-sm text-[#cccccc]"
          />
        ) : null}
      </section>
    </div>
  );
};

export default LocationSummary;
