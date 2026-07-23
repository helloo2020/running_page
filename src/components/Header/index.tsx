import { Link } from 'react-router-dom';
import useSiteMetadata from '@/hooks/useSiteMetadata';

const Header = () => {
  const { logo, siteUrl, navLinks } = useSiteMetadata();

  return (
    <>
      <nav className="mt-4 flex w-full items-center justify-between px-4 lg:mt-12 lg:px-16">
        <div className="shrink-0">
          <Link to={siteUrl}>
            <picture>
              <img
                className="h-11 w-11 rounded-full lg:h-16 lg:w-16"
                alt="logo"
                src={logo}
              />
            </picture>
          </Link>
        </div>
        <div className="flex items-center gap-3 text-right lg:gap-4">
          {navLinks.map((n, i) => (
            <a
              key={i}
              href={n.url}
              className="min-h-[44px] content-center text-base lg:min-h-0"
            >
              {n.name}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Header;
