import { AxiosAdapter } from 'axios';
import { load } from 'cheerio';

import { Filemoon, StreamTape, VizCloud } from '../../extractors';
import {
  AnimeParser,
  IAnimeEpisode,
  IAnimeInfo,
  IAnimeResult,
  IEpisodeServer,
  ISearch,
  ISource,
  MediaFormat,
  MediaStatus,
  ProxyConfig,
  StreamingServers,
  SubOrSub,
} from '../../models';
import { USER_AGENT, range } from '../../utils';

class AnimeSuge extends AnimeParser {
  override readonly name = 'AnimeSuge';
  private animeSugeResolver = '';
  private apiKey = '';
  protected override baseUrl = 'https://animesuge.to/';
  protected override classPath = 'ANIME.AnimeSuge';
  override readonly isWorking = false;

  constructor(
    animeSugeResolver?: string,
    proxyConfig?: ProxyConfig,
    apiKey?: string,
    adapter?: AxiosAdapter,
  ) {
    super(proxyConfig, adapter);
    this.animeSugeResolver = animeSugeResolver ?? this.animeSugeResolver;
    this.apiKey = apiKey ?? this.apiKey;
  }

  override async search(query: string, page: number = 1): Promise<ISearch<IAnimeResult>> {
    const searchResult: ISearch<IAnimeResult> = {
      currentPage: page,
      hasNextPage: false,
      results: [],
    };

    try {
      const res = await this.client.get(
        `${this.baseUrl}/filter?keyword=${encodeURIComponent(query).replace(/%20/g, '+')}&page=${page}`,
      );

      const $ = load(res.data);

      searchResult.hasNextPage =
        $(`ul.pagination`).length > 0
          ? $('ul.pagination > li').last().hasClass('disabled')
            ? false
            : true
          : false;

      $('div.anime > div.item').each((i, el) => {
        let type = undefined;
        switch ($(el).find('span.type').text()!.trim()) {
          case 'MOVIE':
            type = MediaFormat.MOVIE;
            break;
          case 'TV':
            type = MediaFormat.TV;
            break;
          case 'OVA':
            type = MediaFormat.OVA;
            break;
          case 'SPECIAL':
            type = MediaFormat.SPECIAL;
            break;
          case 'ONA':
            type = MediaFormat.ONA;
            break;
          case 'MUSIC':
            type = MediaFormat.MUSIC;
            break;
        }
        searchResult.results.push({
          id: $(el).find('div.name > a').attr('href')?.split('/')[2]!,
          title: $(el).find('div.name').text()!,
          url: `${this.baseUrl}${$(el).find('div.name > a').attr('href')}`,
          image: $(el).find('img.lazyload').attr('data-src'),
          type: type,
          hasSub: $(el).find('span.sub').length > 0,
          hasDub: $(el).find('span.dub').length > 0,
        });
      });

      return searchResult;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  override async fetchAnimeInfo(animeUrl: string): Promise<IAnimeInfo> {
    if (!animeUrl.startsWith(this.baseUrl)) animeUrl = `${this.baseUrl}/anime/${animeUrl}`;

    const animeInfo: IAnimeInfo = {
      id: '',
      title: '',
      url: animeUrl,
    };

    try {
      const res = await this.client.get(animeUrl);

      const $ = load(res.data);

      animeInfo.id = new URL(`${this.baseUrl}/animeUrl`).pathname.split('/')[2];
      animeInfo.title = $('h1.title').text();
      animeInfo.jpTitle = $('h1.title').attr('data-jp');
      animeInfo.genres = Array.from(
        $('div.meta:nth-child(1) > div:nth-child(5) > span > a').map((i, el) => $(el).text()),
      );
      animeInfo.image = $('.binfo > div.poster > span > img').attr('src');
      animeInfo.description = $('.content').text()?.trim();
      switch ($('div.meta:nth-child(1) > div:nth-child(1) > span:nth-child(1) > a').text()) {
        case 'MOVIE':
          animeInfo.type = MediaFormat.MOVIE;
          break;
        case 'TV':
          animeInfo.type = MediaFormat.TV;
          break;
        case 'OVA':
          animeInfo.type = MediaFormat.OVA;
          break;
        case 'SPECIAL':
          animeInfo.type = MediaFormat.SPECIAL;
          break;
        case 'ONA':
          animeInfo.type = MediaFormat.ONA;
          break;
        case 'MUSIC':
          animeInfo.type = MediaFormat.MUSIC;
          break;
      }
      animeInfo.studios = Array.from(
        $('div.meta:nth-child(1) > div:nth-child(2) > span:nth-child(1) > a').map(
          (i, el) => $(el).text()?.trim()!,
        ),
      );
      animeInfo.releaseDate = $('div.meta:nth-child(1) > div:nth-child(3) > span:nth-child(1)')
        .text()
        .trim()
        .split('to')[0]
        ?.trim();

      switch ($('div.meta:nth-child(1) > div:nth-child(4) > span:nth-child(1)').text()?.trim()) {
        case 'Releasing':
          animeInfo.status = MediaStatus.ONGOING;
          break;
        case 'Completed':
          animeInfo.status = MediaStatus.COMPLETED;
          break;
        case 'Cancelled':
          animeInfo.status = MediaStatus.CANCELLED;
          break;
        case 'Unknown':
          animeInfo.status = MediaStatus.UNKNOWN;
          break;
        default:
          animeInfo.status = MediaStatus.UNKNOWN;
          break;
      }

      animeInfo.score = parseFloat(
        $('.bmeta > div:nth-child(2) > div:nth-child(2) > span:nth-child(1)')?.text().split('by')[0],
      );
      animeInfo.premiered = $(
        '.bmeta > div:nth-child(2) > div:nth-child(3) > span:nth-child(1) > a:nth-child(1)',
      ).text();
      animeInfo.duration = $('.bmeta > div:nth-child(2) > div:nth-child(4) > span:nth-child(1)').text();
      animeInfo.views = parseInt(
        $('.bmeta > div:nth-child(2) > div:nth-child(5) > span:nth-child(1)')
          .text()
          .split('by')
          .join('')
          .split(',')
          .join('')
          .trim(),
      );
      animeInfo.otherNames = $('.names')
        .text()
        .split('; ')
        .map(name => name?.trim());
      animeInfo.hasSub = $('div#w-info > .binfo > .info > .meta .sub').length == 1;
      animeInfo.hasDub = $('div#w-info > .binfo > .info > .meta .dub').length == 1;

      const id = $('#watch-main').attr('data-id')!;

      const vrf = await this.ev(id);
      const {
        data: { result },
      } = await this.client.get(`${this.baseUrl}/ajax/anime/${id}`);
      const $$ = load(result);
      animeInfo.totalEpisodes = $$('div.episodes > ul > li > a').length;
      animeInfo.episodes = [];

      const episodes: IAnimeEpisode[] = [];
      $$('div.episodes > ul > li > a').map((i, el) => {
        $$(el)
          .map((i, el) => {
            const possibleIds = $$(el).attr('data-ids')?.split(',')!;
            const number = parseInt($$(el).attr('data-num')?.toString()!);
            const title = $$(el).find('span').text().length > 0 ? $$(el).find('span').text() : undefined;
            const isFiller = $$(el).hasClass('filler');

            episodes.push({
              id: possibleIds[0],
              dubId: possibleIds[1],
              number: number,
              title: title,
              isFiller: isFiller,
            });
          })
          .get();
      });
      animeInfo.episodes?.push(...episodes);

      return animeInfo;
    } catch (err) {
      console.log(err);
      throw new Error((err as Error).message);
    }
  }

  override async fetchEpisodeSources(
    episodeId: string,
    server: StreamingServers = StreamingServers.VizCloud,
  ): Promise<ISource> {
    if (episodeId.startsWith('http')) {
      const serverUrl = new URL(episodeId);
      switch (server) {
        case StreamingServers.StreamTape:
          return {
            headers: { Referer: serverUrl.href, 'User-Agent': USER_AGENT },
            sources: await new StreamTape().extract(serverUrl),
          };
        case StreamingServers.VizCloud:
        case StreamingServers.VidCloud:
          return {
            headers: { Referer: serverUrl.href, 'User-Agent': USER_AGENT },
            sources: await new VizCloud().extract(serverUrl, this.animeSugeResolver, this.apiKey),
          };
        case StreamingServers.MyCloud:
          return {
            headers: { Referer: serverUrl.href, 'User-Agent': USER_AGENT },
            sources: await new VizCloud().extract(serverUrl, this.animeSugeResolver, this.apiKey),
          };
        case StreamingServers.Filemoon:
          return {
            headers: { Referer: serverUrl.href, 'User-Agent': USER_AGENT },
            sources: await new Filemoon().extract(serverUrl),
          };
        default:
          throw new Error('Server not supported');
      }
    }
    try {
      const servers = await this.fetchEpisodeServers(episodeId);
      let s = servers.find(s => s.name === server);
      switch (server) {
        case StreamingServers.VizCloud:
          s = servers.find(s => s.name === 'vidstream')!;
          if (!s) throw new Error('Vidstream server found');
          break;
        case StreamingServers.StreamTape:
          s = servers.find(s => s.name === 'streamtape');
          if (!s) throw new Error('Streamtape server found');
          break;
        case StreamingServers.MyCloud:
          s = servers.find(s => s.name === 'mycloud');
          if (!s) throw new Error('Mycloud server found');
          break;
        case StreamingServers.Filemoon:
          s = servers.find(s => s.name === 'filemoon');
          if (!s) throw new Error('Filemoon server found');
          break;
        default:
          throw new Error('Server not found');
      }

      const serverVrf = (
        await this.client.get(
          `${this.animeSugeResolver}/vrf?query=${encodeURIComponent(s.url)}&apikey=${this.apiKey}`,
        )
      ).data.url;
      const serverSource = (
        await this.client.get(`${this.baseUrl}/ajax/server/${s.url}?vrf=${encodeURIComponent(serverVrf)}`)
      ).data;
      const embedURL = (
        await this.client.get(
          `${this.animeSugeResolver}/decrypt?query=${encodeURIComponent(serverSource.result.url)}&apikey=${
            this.apiKey
          }`,
        )
      ).data.url;

      if (embedURL.startsWith('http')) {
        const response: ISource = await this.fetchEpisodeSources(embedURL, server);
        response.embedURL = embedURL;
        response.intro = {
          start: serverSource?.result?.skip_data?.intro_begin ?? 0,
          end: serverSource?.result?.skip_data?.intro_end ?? 0,
        };

        return response;
      } else {
        throw new Error('Server did not respond correctly');
      }
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  override async fetchEpisodeServers(episodeId: string): Promise<IEpisodeServer[]> {
    if (!episodeId.startsWith(this.baseUrl))
      episodeId = `${this.baseUrl}/ajax/server/list/${episodeId}?vrf=${encodeURIComponent(
        await this.ev(episodeId),
      )}`;

    const {
      data: { result },
    } = await this.client.get(episodeId);

    const $ = load(result);

    const servers: IEpisodeServer[] = [];
    $('.type > ul > li').each((i, el) => {
      const serverId = $(el).attr('data-link-id')!;
      servers.push({
        name: $(el).text().toLocaleLowerCase(),
        url: `${serverId}`,
      });
    });

    return servers;
  }

  public async ev(query: string, raw = false): Promise<string> {
    const { data } = await this.client.get(
      `${this.animeSugeResolver}/vrf?query=${encodeURIComponent(query)}&apikey=${this.apiKey}`,
    );

    if (raw) {
      return data;
    } else {
      return data.url;
    }
  }

  public async searchVrf(query: string, raw = false): Promise<string> {
    const { data } = await this.client.get(
      `${this.animeSugeResolver}/9anime-search?query=${encodeURIComponent(query)}&apikey=${this.apiKey}`,
    );

    if (raw) {
      return data;
    } else {
      return data.url;
    }
  }

  public async decrypt(query: string, raw = false): Promise<string> {
    const { data } = await this.client.get(
      `${this.animeSugeResolver}/decrypt?query=${encodeURIComponent(query)}&apikey=${this.apiKey}`,
    );

    if (raw) {
      return data;
    } else {
      return data.url;
    }
  }

  public async vizcloud(query: string): Promise<string> {
    const { data } = await this.client.get(
      `${this.animeSugeResolver}/vizcloud?query=${encodeURIComponent(query)}&apikey=${this.apiKey}`,
    );
    return data;
  }

  public async customRequest(query: string, action: string): Promise<string> {
    const { data } = await this.client.get(
      `${this.animeSugeResolver}/${action}?query=${encodeURIComponent(query)}&apikey=${this.apiKey}`,
    );
    return data;
  }
}

// (async () => {
//   // const nineAnime = new NineAnime();
//   // const searchResults = await nineAnime.search('attack on titan');
//   // const animeInfo = await nineAnime.fetchAnimeInfo('shadowverse-flame.rljqn');
//   // @ts-ignore
//   // const episodeSources = await nineAnime.fetchEpisodeSources("ab68", "decrypt");
//   // console.log(await nineAnime.vizcloud("LNPEK8Q0QPXW"));
//   // console.log(await nineAnime.decrypt("ab6/", true));
//   // console.log(await nineAnime.customRequest("LNPEK8Q0QPXW", "9anime-search"));
// })();

export default AnimeSuge;