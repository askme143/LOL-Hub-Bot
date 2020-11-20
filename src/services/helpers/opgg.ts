import axios from 'axios';
import cheerio from 'cheerio';

interface SummonerInfo {
  summonerID: string;
  season: string;
  soloTier: string;
  flexTier: string;
  soloLP: number;
  flexLP: number;
}

const requestHeader = {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Whale/2.8.107.16 Safari/537.36',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Riot-Token': 'RGAPI-46697628-d347-4089-9770-5745a92baf21',
  },
};

async function getSummonerInfo(name: string): Promise<SummonerInfo> {
  const response = await axios.get(
    `https://www.op.gg/summoner/${encodeURI(name)}`,
    requestHeader
  );

  const data = cheerio.load(response.data);

  return {
    summonerID: data('div.MostChampionContent > div').attr()[
      'data-summoner-id'
    ],
    season: data('div.MostChampionContent > div').attr()['data-season'],

    soloTier: data('div.TierRank').text().trim(),
    flexTier: data('div.sub-tier__rank-tier').text().trim(),

    soloLP: parseInt(data('span.LeaguePoints').text().split(' ')[0]),
    flexLP: parseInt(data('div.sub-tier__league-point').text().split('LP')[0]),
  };
}

export { getSummonerInfo };
