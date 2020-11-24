import { AxiosError } from 'axios';
import { Client } from 'discord.js';
import config from './config';

import * as SummonerSearch from './services/summoner-search';

const client = new Client();

client.on('ready', () => {
  if (client.user) {
    client.user.setAvatar('./public/profile.PNG').catch();
  }
});

client.on('message', (msg) => {
  /* Message prefix */
  if (msg.content[0] !== 'q') return;

  /* Message Request */
  const request = msg.content.substr(1).split(' ')[0];

  /* Routing */
  if (request === 'ping' && client.ws.ping) {
    msg.channel.send(`Pong! ${Math.floor(client.ws.ping)}ms`);
  }
  if (request === 'uptime' && client.uptime) {
    let t = client.uptime;

    const ms = t % 1000;
    t = (t - ms) / 1000;
    const secs = t % 60;
    t = (t - secs) / 60;
    const mins = t % 60;
    const hrs = (t - mins) / 60;

    msg.channel.send(`${hrs}시간 ${mins}분  ${secs}.${ms}초`);
  }
  if (request === 'q') {
    const arg = msg.content.substr(3).trim();

    SummonerSearch.makeEmbedMessage(arg)
      .then((embedMsg) => {
        msg.channel.send(embedMsg);
      })
      .catch((error) => {
        if ((error as AxiosError).isAxiosError) {
          const axiosError: AxiosError = error;
          console.log(axiosError.request);
        }
        console.log(error.message);
        msg.channel.send('error');
      });
  }
});

client.login(config.token).then(() => {
  console.log('Bot start');
});
