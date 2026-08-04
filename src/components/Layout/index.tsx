import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import useSiteMetadata from '@/hooks/useSiteMetadata';
import styles from './style.module.css';

interface ILayoutProps extends React.PropsWithChildren {
  headerActions?: React.ReactNode;
  contentClassName?: string;
}

const Layout = ({
  children,
  headerActions,
  contentClassName = '',
}: ILayoutProps) => {
  const { siteTitle, description } = useSiteMetadata();

  return (
    <>
      <Helmet bodyAttributes={{ class: styles.body }}>
        <html lang="en" />
        <title>{siteTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="running" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Helmet>
      <Header actions={headerActions} />
      <div className={`mb-16 p-4 lg:p-16 ${contentClassName}`}>
        {children}
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  contentClassName: PropTypes.string,
  headerActions: PropTypes.node,
};

export default Layout;
