import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import useSiteMetadata from '@/hooks/useSiteMetadata';
import styles from './style.module.css';

interface ILayoutProps extends React.PropsWithChildren {
  contentClassName?: string;
}

const Layout = ({ children, contentClassName = '' }: ILayoutProps) => {
  const { siteTitle, description } = useSiteMetadata();

  return (
    <>
      <Helmet bodyAttributes={{ class: styles.body }}>
        <html lang="zh-CN" />
        <title>{siteTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="running" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Helmet>
      <Header />
      <main className={`site-main ${contentClassName}`}>{children}</main>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  contentClassName: PropTypes.string,
};

export default Layout;
