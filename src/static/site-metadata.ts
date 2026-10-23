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
  siteTitle: '跑步记录 · Scond',
  siteUrl: 'https://run.scond.me/',
  logo: 'https://raw.githubusercontent.com/helloo2020/running_page/master/src/static/duola.png',
  description: '跑过的路，留下的足迹。Scond 的跑步记录。',
  navLinks: [
    {
      name: '统计',
      url: `${getBasePath()}/summary`,
    },
    {
      name: '文章',
      url: 'https://blog.scond.me/',
    },
    {
      name: '主页',
      url: 'https://scond.me/',
    },
  ],
};

export default data;
