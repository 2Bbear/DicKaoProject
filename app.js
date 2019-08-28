const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('서비스 시작!');
});
 
client.on('message', message => {
    if (message.content === 'ping') {
      message.reply('pong');
    }
  });
 
client.login('NjE2MDc3ODIxOTY1NjMxNDk3.XWX8GQ.281R8NEenhLctEfXkhXGmfrUdpw');