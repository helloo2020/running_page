interface ISiteMetadataResult {
  siteTitle: string;
  siteUrl: string;
  description: string;
  logo: string;
  navLinks: {
    name: string;
    url: string;
  }[];
}

const getBasePath = () => {
  const baseUrl = import.meta.env.BASE_URL;
  return baseUrl === '/' ? '' : baseUrl;
};

const data: ISiteMetadataResult = {
  siteTitle: 'Running Page',
  siteUrl: 'https://helloo2020.github.io/',
  logo: 'https://raw.githubusercontent.com/helloo2020/running_page/master/src/static/duola.png',
  description: 'My running page',
  navLinks: [
    {
      name: 'Summary',
      url: `${getBasePath()}/summary`,
    },
    {
      name: 'Blog',
      url: 'https://helloo2020.github.io/',
    },
    {
      name: 'About',
      url: 'https://helloo2020.github.io/about/',
    },
  ],
};

export default data;
