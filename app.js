const  Discord = require('discord.js');
const {RichEmbed} = require('discord.js');
const config = require('./TargetConfig');
const client = new Discord.Client();
var passport = require('passport');
var KakaoStrategy = require('passport-kakao').Strategy;

client.on('ready', () => {
  console.log(`${client.user.tag}가 서비스 시작!`);
});

client.on('message', message => {
  if (message.channel.type == 'dm') return //direct message
  if (!message.content.startsWith(config.prefix)) return

  //기본 핑퐁+응답시간
  if (message.content.startsWith(config.prefix + 'ping')) {
    message.reply('pong! `' + Math.floor(client.ping) + 'ms`');
  }

  // 채널에 메세지 보내기
  if (message.content.startsWith(config.prefix + 'echo')) {
    message.channel.send('echo');
  }

  // 멘션으로 대답(reply와 동일)
  if (message.content.startsWith(config.prefix + 'ya')) {
    message.channel.send(`${message.author}` + 'why?');
  }

  // 지정채널에 멘션 메세지 보내기
  if (message.content.startsWith(config.prefix + 'dantok')) {
    message.guild.channels.find(x => x.id === '615911822536736769').send(`${message.author}` + 'Im here');
  }

  // 임베드 메세지 - 형식 메세지
  if (message.content.startsWith(config.prefix + 'embed')) {
    const embed = new RichEmbed()
      .setTitle('너찌 : 연두색이 좋아')
      .setColor(0xff000)
      /*.setDescription('연두색이 좋아')*/
    message.channel.send(embed);
  }


});
client.login(config.token);