import axios from 'axios';
import cheerio from 'cheerio';

export interface SummonerInfo {
  name: string;
  summonerID: string;
  season: string;
  soloTier: string;
  flexTier: string;
  soloLP: number;
  flexLP: number;
  soloWinRatio: number;
  flexWinRatio: number;
}

export interface MostChamp {
  champName: string;
  winRatio: number;
  totalGame: number;
  kda: number | string;
}

export interface RecentSolo {
  wins: number;
  losses: number;
  kda: number | string;
}

const requestHeader = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Whale/2.8.107.16 Safari/537.36',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
  'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
};

async function getSummonerInfo(nameInput: string) {
  const response = await axios.get(
    `https://www.op.gg/summoner/${encodeURI(nameInput)}`,
    { headers: requestHeader }
  );

  const data = cheerio.load(response.data);
  /* Non-existing summoner */
  /* Or other errors on op.gg */
  if (data('div.l-container > div.SummonerNotFoundLayout').length > 0)
    return null;
  else if (data('div.Profile > div.Information > span').length === 0)
    throw Error('op.gg failed');

  const name = data('div.Profile > div.Information > span').text();
  const summonerID = data('div.MostChampionContent > div').attr()[
    'data-summoner-id'
  ];
  const season = data('div.MostChampionContent > div').attr()['data-season'];
  const soloTier = data('div.TierRank').text().trim();
  const flexTier = data('div.sub-tier__rank-tier').text().trim();
  let soloLP = parseInt(
    data('span.LeaguePoints')
      .text()
      .replace(/[^(0-9)]/g, '')
  );
  let flexLP = parseInt(
    data('div.sub-tier__league-point')
      .text()
      .split('/')[0]
      .replace(/[^(0-9)]/g, '')
  );
  let soloWinRatio = parseInt(
    data('span.winratio')
      .text()
      .replace(/[^(0-9)]/g, '')
  );
  let flexWinRatio = parseInt(
    data('div.sub-tier__gray-text')
      .text()
      .replace(/[^(0-9)]/g, '')
  );

  if (Number.isNaN(soloLP)) soloLP = 0;
  if (Number.isNaN(flexLP)) flexLP = 0;
  if (Number.isNaN(soloWinRatio)) soloWinRatio = 0;
  if (Number.isNaN(flexWinRatio)) flexWinRatio = 0;

  return {
    name,
    summonerID,
    season,
    soloTier,
    flexTier,
    soloLP,
    flexLP,
    soloWinRatio,
    flexWinRatio,
  } as SummonerInfo;
}

function getTierMedalSrc(tier: string) {
  let url = 'https://opgg-static.akamaized.net/images/medals/';

  if (tier.toLowerCase().trim() === 'unranked') tier = 'default';

  url += tier.replace(' ', '_').toLowerCase();
  if (!url.includes('_')) url += '_1';
  url += '.png?image=q_auto&v=1';

  return url;
}

async function getMostChamps(summonerID: string, season: string) {
  const response = await axios.get(
    `https://www.op.gg/summoner/champions/ajax/champions.most/summonerId=${summonerID}&season=${season}`,
    { headers: requestHeader }
  );

  const data = cheerio.load(response.data);
  const mostChamps: MostChamp[] = [];

  for (let i = 1; i < 4; i++) {
    const champName = data(`div.ChampionBox:nth-child(${i}) div.Face`).attr(
      'title'
    );
    if (champName === undefined) break;

    const winRatio = parseInt(
      data(`div.ChampionBox:nth-child(${i}) div.WinRatio`)
        .text()
        .replace(/[^(0-9)]/g, '')
    );
    const totalGame = parseInt(
      data(`div.ChampionBox:nth-child(${i}) div.Title`)
        .text()
        .replace(/[^(0-9)]/g, '')
    );
    let kda: number | string = parseFloat(
      data(`div.ChampionBox:nth-child(${i}) span.KDA`).text().split(':')[0]
    );

    if (Number.isNaN(kda)) kda = 'Perfect 평점';

    mostChamps.push({ champName, winRatio, totalGame, kda });
  }

  return mostChamps;
}

async function getRecentSolo(summonerID: string) {
  const response = await axios(
    `https://www.op.gg/summoner/matches/ajax/averageAndList/startInfo=0&summonerId=${summonerID}&type=soloranked`,
    {
      validateStatus: function (status) {
        return status === 200 || status === 418;
      },
      headers: requestHeader,
    }
  );

  /* Doesn't have recent solo ranked game */
  if (response.status === 418)
    return { wins: 0, losses: 0, kda: 0 } as RecentSolo;

  const data = cheerio.load(response.data.html);

  const wins = parseInt(data('span.win').first().text());
  const losses = parseInt(data('span.lose').first().text());
  let kda: number | string = parseFloat(
    data('td.KDA  span.KDARatio').text().split(':')[0]
  );

  if (Number.isNaN(kda)) kda = 'Perfect 평점';

  return { wins, losses, kda } as RecentSolo;
}

export default {
  getSummonerInfo,
  getTierMedalSrc,
  getMostChamps,
  getRecentSolo,
};
