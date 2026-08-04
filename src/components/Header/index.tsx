import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
import useSiteMetadata from '@/hooks/useSiteMetadata';

const Header = ({ actions }: { actions?: ReactNode }) => {
  const { logo, siteUrl, navLinks } = useSiteMetadata();

  return (
    <>
      <nav className="mt-4 flex w-full items-center justify-between px-4 lg:mt-12 lg:px-16">
        <div className="shrink-0">
          <Link to={siteUrl} className="flex items-center gap-2 lg:gap-3">
            <picture>
              <img
                className="h-11 w-11 rounded-full lg:h-16 lg:w-16"
                alt="logo"
                src={logo}
              />
            </picture>
            <span className="text-xl font-bold italic text-[#f4f4f4] lg:text-2xl">
              Scond
            </span>
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 text-right lg:gap-4">
          {actions}
          <div className="flex items-center gap-3 lg:gap-4">
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
        </div>
      </nav>
    </>
  );
};

export default Header;
