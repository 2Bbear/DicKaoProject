const Discord = require('discord.js');
const config = require('./TargetConfig');
//const POEAPI = require('./source/PathOfExileAPI');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('서비스 시작!');
});

currentMyState='수면중'
client.on('message', message => {
  if (message.channel.type == 'dm') return //direct message
  if (message.content.startsWith(config.prefix))
  {
    
  } 
  else
  {
    test = message.toString();
    //특정 멘션으로 요청할때 반응하기
    if(message.content.includes('<@!343732615074807809'))
    {
      message.channel.send('TwoBbearX_X님은 현재 '+currentMyState+' 입니다');
    }
    return
  }
  

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


  // poe API 호출
  if (message.content.startsWith(config.prefix + 'getPOEAPI')){
    message.guild.channels.find('');
  }
});
client.login(config.token);
