import {
  CHINESE_LOCATION_INFO_MESSAGE_FIRST,
  CHINESE_LOCATION_INFO_MESSAGE_SECOND,
} from '@/utils/const';
import CountriesStat from './CountriesStat';
import LocationSummary from './LocationSummary';
import PeriodStat from './PeriodStat';

interface ILocationStatProps {
  changeCity: (_city: string) => void;
  changeTitle: (_title: string) => void;
  selectedCity?: string;
}

const LocationStat = ({
  changeCity,
  changeTitle,
  selectedCity,
}: ILocationStatProps) => (
  <div className="w-full pb-16 lg:w-full lg:pr-16">
    <section className="pb-0">
      <p className="leading-relaxed">
        {CHINESE_LOCATION_INFO_MESSAGE_FIRST}
        .
        <br />
        {CHINESE_LOCATION_INFO_MESSAGE_SECOND}
        .
        <br />
        <br />
        Yesterday you said tomorrow.
      </p>
    </section>
    <hr color="red" />
    <LocationSummary />
    <CountriesStat onCityClick={changeCity} selectedCity={selectedCity} />
    <PeriodStat onClick={changeTitle} />
  </div>
);

export default LocationStat;
