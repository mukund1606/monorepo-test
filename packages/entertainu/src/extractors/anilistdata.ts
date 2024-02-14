import { CheerioAPI, load } from 'cheerio';
import Proxy from '../models/proxy';

class AnilistData extends Proxy {
  protected readonly url1 = 'https://anilist.co/sitemap/anime-0.xml';
  protected readonly url2 = 'https://anilist.co/sitemap/anime-1.xml';
  private readonly anilistGraphqlUrl = 'https://graphql.anilist.co';

  extract = async (): Promise<string[]> => {
    const res = await Promise.all([this.client.get(this.url1), this.client.get(this.url2)]);
    const $ = load(res[0].data);
    const $1 = load(res[1].data);
    const ids: string[] = [];
    $('loc').each((_, el) => {
      ids.push($(el).text().split('/')[4]);
    });
    $1('loc').each((_, el) => {
      ids.push($1(el).text().split('/')[4]);
    });
    return ids;
  };

  getTags = async (): Promise<string[]> => {
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      query: `
      query{MediaTagCollection{name}}
        `,
    };
    const res = await this.client.post(this.anilistGraphqlUrl, options);
    return res.data.data.MediaTagCollection.map((tag: { name: string }) => tag.name);
  };
}

export default AnilistData;
