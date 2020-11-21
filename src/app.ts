import { Client } from 'discord.js';
import config from './config';

import * as SummonerSearch from './services/summoner-search';

const client = new Client();

client.on('message', (msg) => {
  /* Message prefix */
  if (msg.content[0] !== 'q') return;

  /* Message Request */
  const request = msg.content.substr(1).split(' ')[0];

  /* Routing */
  if (request === 'ping' && client.ws.ping) {
    msg.channel.send(`Pong! ${Math.floor(client.ws.ping)}ms`);
  }
  if (request === 'q') {
    const arg = msg.content.substr(3).trim();

    SummonerSearch.makeEmbedMessage(arg)
      .then((embedMsg) => {
        msg.channel.send(embedMsg);
      })
      .catch((error) => {
        console.log(error);
        msg.channel.send('error');
      });
  }
});

client.login(config.token).then(() => {
  console.log('Bot start');
});
