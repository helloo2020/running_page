import { intComma } from '@/utils/utils';

interface IStatProperties {
  value: string | number;
  description: string;
  className?: string;
  citySize?: number;
  valueClassName?: string;
  descriptionClassName?: string;
  onClick?: () => void;
}

const Stat = ({
  value,
  description,
  className = 'pb-2 w-full',
  citySize,
  valueClassName = '',
  descriptionClassName = '',
  onClick,
}: IStatProperties) => (
  <div className={`${className}`} onClick={onClick}>
    <span
      className={`text-${citySize || 5}xl font-bold italic ${valueClassName}`}
    >
      {intComma(value.toString())}
    </span>
    <span className={`text-lg font-semibold italic ${descriptionClassName}`}>
      {description}
    </span>
  </div>
);

export default Stat;
