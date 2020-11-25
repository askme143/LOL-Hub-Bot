import { MessageEmbed, EmbedFieldData, Message } from 'discord.js';
import opgg, { SummonerInfo, MostChamp, RecentSolo } from './helpers/opgg';

const emptyField = { name: '\u200B', value: '\u200B' };

function makeTierFields(summonerInfo: SummonerInfo) {
  const {
    soloTier,
    soloLP,
    soloWinRatio,
    flexTier,
    flexLP,
    flexWinRatio,
  } = summonerInfo;

  const soloField: EmbedFieldData = {
    name: '솔랭',
    value: `${soloTier}: ${soloLP} LP\n승률: ${soloWinRatio}%`,
    inline: true,
  };
  const flexField: EmbedFieldData = {
    name: '자랭',
    value: `${flexTier}: ${flexLP} LP\n승률: ${flexWinRatio}%`,
    inline: true,
  };

  return [soloField, flexField];
}

function makeMostChampFields(mostChamps: MostChamp[]) {
  const mostChampFields: EmbedFieldData[] = [];

  for (let i = 0; i < mostChamps.length; i++) {
    const { champName, winRatio, totalGame, kda } = mostChamps[i];

    mostChampFields.push({
      name: '\u200b',
      value:
        `<${champName}>` +
        `\n${winRatio}% (${totalGame} 게임)` +
        `\n${typeof kda === 'number' ? kda.toFixed(2) + ' : 1' : kda}`,
      inline: true,
    });
  }

  if (mostChampFields.length > 0) mostChampFields[0].name = '시즌 모스트 3';

  return mostChampFields;
}

function makeRecentSoloFields(recentSolo: RecentSolo) {
  const { wins, losses, kda } = recentSolo;
  const total = wins + losses;
  let winRatio = Math.round((100 * wins) / total);

  if (Number.isNaN(winRatio)) winRatio = 0;

  return [
    {
      name: '\u200b\n최근 솔랭 전적',
      value:
        `${total}전 ${wins}승 ${losses}패 (${winRatio}%)` +
        `\n${typeof kda === 'number' ? kda.toFixed(2) + ' : 1' : kda}`,
    },
  ];
}

async function makeEmbedMessage(name: string) {
  /* Default format */
  let embedMsg = new MessageEmbed()
    .setColor('#0099ff')
    .setURL(`https://www.op.gg/summoner/userName=${encodeURI(name)}`)
    .setAuthor('OP.GG 기준 데이터', '', 'https://www.op.gg');
  const red = '#FF0000';
  const blue = '#0099ff';

  /* Get information from op.gg */
  const summonerInfo = await opgg.getSummonerInfo(name);
  if (summonerInfo === null) {
    /* handle non-existing summoner */
    return embedMsg.setTitle('존재하지 않는 소환사').setColor(red);
  }

  const [mostChamps, recentSolo] = await Promise.all([
    opgg.getMostChamps(summonerInfo.summonerID, summonerInfo.season),
    opgg.getRecentSolo(summonerInfo.summonerID),
  ]);

  let tierMedalSrc: string;
  if (summonerInfo.soloTier.toLowerCase() !== 'unranked') {
    tierMedalSrc = opgg.getTierMedalSrc(summonerInfo.soloTier);
  } else {
    tierMedalSrc = opgg.getTierMedalSrc(summonerInfo.flexTier);
  }

  /* Make a new embed message*/
  embedMsg = embedMsg
    .setColor(blue)
    .setTitle(summonerInfo.name)
    .setThumbnail(tierMedalSrc)
    .addFields(makeTierFields(summonerInfo))
    .addFields(emptyField)
    .addFields(makeMostChampFields(mostChamps))
    .addFields(makeRecentSoloFields(recentSolo));

  return embedMsg;
}

export { makeEmbedMessage };
