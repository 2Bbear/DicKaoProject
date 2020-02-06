const Discord = require('discord.js');
const config = require('./TargetConfig');
//const POEAPI = require('./source/PathOfExileAPI');
const client = new Discord.Client();




//파일 시스템 모듈 사용
var curStateDatas= new Array();
var curStateDataIndex;


var Initializing = function()
{
  curStateDatas.push("공부중","작업중","수면중","게임중");
  curStateDataIndex=2;
}


client.on('ready', () => {
  console.log('서비스 시작!');
  //초기화
  Initializing();
  
});

function is_number(v) {
  var reg = /^(\s|\d)+$/;
  return reg.test(v);
}


//주 컨텐츠 영역 ======================================================================================================
client.on('message', message => {
  if (message.channel.type == 'dm') return //direct message
  if (message.content.startsWith(config.prefix))
  {
    var messageText = message.toString();
    //상태값 추가 커맨드
    if(message.content.startsWith(config.prefix + 'addst'))
    {
      message.channel.send('상태값 추가 커맨드');
      var strArr = messageText.split(config.prefix +'addst');
    
      var stateName =  strArr[1];
      curStateDatas.push(stateName);
      message.channel.send(stateName+'을 추가하였습니다');
    }
    //상태값 지정 커맨드
    if(message.content.startsWith(config.prefix + 'cst'))
    {
      message.channel.send('상태값 지정 커맨드');
      var strArr = messageText.split(config.prefix +'cst');

      var number =  Number(strArr[1]);
      //만약 숫자 값이 아닌경우
      if(is_number(number)==false)
      {
        message.channel.send('숫자를 입력해주세요');
        return;
      }
      //해당 숫자가 상태 리스트 값 안에 존재하지 않을 경우
      if(0>number ||curStateDatas.length<=number)
      {
        message.channel.send('리스트에서 벗어난 값입니다.');
        return;
      }
      //현재 상태 값을 변경
      curStateDataIndex = number;
      message.channel.send(curStateDatas[curStateDataIndex]+'로 현재상태를 변경하였습니다.');
    }
    //상태값 삭제 커맨드
    if(message.content.startsWith(config.prefix + 'delst'))
    {
      message.channel.send('상태값 삭제 커맨드');
      var strArr = messageText.split(config.prefix +'delst');

      var number =  Number(strArr[1]);
      //만약 숫자 값이 아닌경우
      if(is_number(number)==false)
      {
        message.channel.send('숫자를 입력해주세요');
        return;
      }
      //해당 숫자가 상태 리스트 값 안에 존재하지 않을 경우
      if(0>number ||curStateDatas.length<number)
      {
        message.channel.send('리스트에서 벗어난 값입니다.');
        return;
      }

      var tempStateName=new String();
      //해당 문자열 삭제
      if(number>-1)
      {
        tempStateName = curStateDatas[number];
        curStateDatas.splice(number,1);
      }

      message.channel.send(tempStateName+'를 삭제했습니다.');

    }
    //상태값 전부 삭제 커맨드
    if(message.content.startsWith(config.prefix + 'alldelst'))
    {
      message.channel.send('상태값 전부 삭제 커맨드');
      curStateDatas=[];
      message.channel.send('모든 상태값을 삭제하였습니다.');
    }
    //상태값 출력 커맨드
    if(message.content.startsWith(config.prefix + 'stlist'))
    {
      var printOutText=new String();
      printOutText = '현재 선택 가능한 상태 값';
     
      curStateDatas.forEach(function (item, index, Array){
        printOutText= printOutText+'\n'+String(index)+" : "+item;
      });

      message.channel.send(printOutText);
    }
    //현재 상태값을 출력하는 커맨드
    if(message.content.startsWith(config.prefix + 'curst'))
    {
      message.channel.send("현재 상태 값은 "+ curStateDatas[curStateDataIndex] + ' 입니다.');
    }

    //전송한 메세지 콘솔에 띄우는 법
    if(message.content.startsWith(config.prefix + 'tm1'))
    {
      message.channel.send("#test")
      .then(message=>console.log(`sent message : ${message.content}`))
      .catch(console.error);
    }
    //url 링크 파일 전송하는 법
    if(message.content.startsWith(config.prefix + 'tm2'))
    {
      message.channel.send({
        files: ['http://blogattach.naver.net/d045cc7f6d3734e8c72a437b48a8d7a8025aa2427e/20200203_137_blogfile/harne__1580667756631_QYEa3d_smi/%5BOhys-Raws%5D+ID+Invaded+-+06+%28BS11+1280x720+x264+AAC%29.smi?type=attachment']})
        .then(console.log)
        .catch(console.error);
    }
    //로컬 파일 전송하는 방법
    if(message.content.startsWith(config.prefix + 'tm3'))
    {
      message.channel.send({
        files: [{
          attachment: './ReadMe.txt',
          name: 'ReadMe.txt'
        }]})
        .then(console.log)
        .catch(console.error);
    }
    //로컬 이미지를 임베디드해서 넣는 방법
    if(message.content.startsWith(config.prefix + 'tm4'))
    {
      message.channel.send('This is an embed', {
        embed: {
          thumbnail: {
               url: 'attachment://thumb-1920-775419.png' //이 부분은 해당 보내지는 임베드의 안에 있는 경로를 말한다. 
                                                        // 모든 부분에서 이름이 알맞게 들어가야 임베드 안에 출력이 된다.
            }
         },
         files: [{
            attachment: './ResourceFiles/thumb-1920-775419.png',
            name: 'thumb-1920-775419.png'
         }]
      })
        .then(console.log)
        .catch(console.error);
    }

    //채널의 이름 변경 방법 (관리자 권한을 요구함)
    if(message.content.startsWith(config.prefix + 'tm5'))
    {
      message.channel.setName('not_general')
      .then(newChannel => console.log(`Channel's new name is ${newChannel.name}`))
      .catch(console.error);
    }
    //후방 금지 채널로 지정하는 방법
    if(message.content.startsWith(config.prefix + 'tm6'))
    {
      message.channel.setNSFW(true,'there is no reason');
    }
    //카테고리 변경 방법
    if(message.content.startsWith(config.prefix + 'tm7'))
    {
      //첫번째 매개변수에 카테고리의 id 값을 입력해야 합니다.
      message.channel.setParent('674872026997063680', { lockPermissions: false })
      .then(channel => console.log(`New parent of ${message.channel.name}: ${channel.name}`))
      .catch(console.error);
    }
  } 
  else
  {
    //특정 유저를 멘션으로 요청할때 반응하기
    if(message.content.includes('<@!343732615074807809'))
    {
      message.channel.send('TwoBbearX_X님은 현재 '+curStateDatas[curStateDataIndex]+' 입니다');
    }

    //아바타 예제
    if(message.content === 'what is my avatar')
    {
      message.channel.send(message.author.displayAvatarURL);
    }
    //부착물 예제 1
    // if (message.content === '!rip') 
    // {
    //   const attachment = new MessageAttachment('https://i.imgur.com/w3duR07.png');
    //   // Send the attachment in the message channel
    //   message.channel.send(attachment);
    // }
    
    

    return
  }
});
//새로운 멤버가 들어왔을때
client.on('guildMemberAdd',member=>{

  const channel = member.guild.channels.find(ch => ch.name === 'member-log');
  if(!channel) return;
  
  channel.send(`이 서버에 오신걸 환영합니다., ${member}`);
});
client.login(config.token);

/*
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
*/