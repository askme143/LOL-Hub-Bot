import { Client } from 'discord.js';
import config from './config';

import * as api from './api';

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
    api.SummonerSearch.makeEmbedMessage()
      .then((embedMsg) => {
        msg.channel.send(embedMsg);
      })
      .catch(() => {
        msg.channel.send('error');
      });
  }
});

client.login(config.token).then(() => {
  console.log('Bot start');
});
