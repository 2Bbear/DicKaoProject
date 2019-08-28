const Discord = require('discord.js');
const config = require('./config');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('서비스 시작!');
});
 
client.on('message', message => {
    if(message.channel.type == 'dm') return //direct message
    if(!message.content.startsWith(config.prefix)) return


    if (message.content.startsWith(config.prefix+'ping')) {
      message.reply('pong');
    }

    var d = new Date();
    if (message.content.startsWith(config.prefix+'time')) {
      message.reply((d.getHours()-12)+'시 '+d.getMinutes()+'분');
    }
  });
 
  

client.login(config.token);