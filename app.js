const Discord = require('discord.js');
const config = require('./TargetConfig');
const client = new Discord.Client();
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;


passport.use('login-kakao', new KakaoStrategy({
  clientID : config.kakao.client_id,
  callbackURL : config.kakao.callback_url_redirect // 카카오 개발자 사이트에서 지정한 리다이렉트 URL 
},
function(accessToken, refreshToken, profile, done) {
  console.log('오 성공?');
  return done(null, profile);
}
));

client.on('ready', () => {
  console.log('서비스 시작!');
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

  //kakao 접속
  if(message.content.startsWith(config.prefix + 'loginKatalk'))
  {
      passport.authenticate('login-kakao',{successRedirect:message.channel.send('katalk success'), failureRedirect: message.channel.send('katal fali')});

      message.channel.send('exppppp');
  }
});


client.login(config.token);