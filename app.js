const Discord = require('discord.js');
const config = require('./config');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('서비스 시작!');
});
 
client.on('message', message => {
    if(message.channel.type == 'dm') return
    if(!message.content.startsWith(config.prefix)) return
    if (message.content.startsWith(config.prefix+'ping')) {
      message.reply('pong');
    }
  });
 
client.login(config.token);