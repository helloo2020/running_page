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

const data: ISiteMetadataResult = {
  siteTitle: 'Running Page',
  siteUrl: 'https://helloo2020.github.io/running-Tim/',
  logo: 'duola.png',
  description: 'My running page',
  navLinks: [
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
