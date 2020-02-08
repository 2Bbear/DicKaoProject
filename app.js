const Discord = require('discord.js');
const config = require('./TargetConfig');
const client = new Discord.Client();

const ytdl = require('ytdl-core');
const queue = new Map();

//파일 시스템 모듈 사용
var curStateDatas= new Array();
var curStateDataIndex;


//함수들==============================================================================================
var Initializing = function()
{
  curStateDatas.push("공부중","작업중","수면중","게임중");
  curStateDataIndex=2;
}

//이게 숫자인지 아닌지 판단하는 메소드
function is_number(v) {
  var reg = /^(\s|\d)+$/;
  return reg.test(v);
}

async function execute(message, serverQueue) {
	const args = message.content.split(' ');

	const voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send('I need the permissions to join and speak in your voice channel!');
	}

	const songInfo = await ytdl.getInfo(args[1]);
	const song = {
		title: songInfo.title,
		url: songInfo.video_url,
	};

	if (!serverQueue) {
		const queueContruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true,
		};

		queue.set(message.guild.id, queueContruct);

		queueContruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueContruct.connection = connection;
			play(message.guild, queueContruct.songs[0]);
		} catch (err) {
			console.log(err);
			queue.delete(message.guild.id);
			return message.channel.send(err);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		return message.channel.send(`${song.title} has been added to the queue!`);
	}

}

function skip(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	if (!serverQueue) return message.channel.send('There is no song that I could skip!');
	serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	serverQueue.songs = [];
	serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', () => {
			console.log('Music ended!');
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}
//기본 reply메세지==================================================================================
client.on('ready', () => {
  console.log('서비스 시작!');
  //초기화
  Initializing();
  
});
client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});




//주 컨텐츠 영역 ======================================================================================================
client.on('message', message => {
  if (message.channel.type == 'dm') return //direct message
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(config.prefix))
  {
    //=============================================================\
    if(message.content.startsWith(`${config.prefix}play`))
    {
      execute(message, serverQueue);
		  return;
    }
    else if(message.content.startsWith(`${config.prefix}skip`))
    {
      skip(message, serverQueue);
		  return;
    }
    else if(message.content.startsWith(`${config.prefix}stop`))
    {
      stop(message, serverQueue);
		  return;
    }
    
    //=============================================================
    //상태값 추가 커맨드
    if(message.content.startsWith(config.prefix + 'addst'))
    {
      message.channel.send('상태값 추가 커맨드');
      var strArr = messageText.split(config.prefix +'addst');
    
      var stateName =  strArr[1];
      curStateDatas.push(stateName);
      message.channel.send(stateName+'을 추가하였습니다');
      return;
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
      return;
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
      return;

    }
    //상태값 전부 삭제 커맨드
    if(message.content.startsWith(config.prefix + 'alldelst'))
    {
      message.channel.send('상태값 전부 삭제 커맨드');
      curStateDatas=[];
      message.channel.send('모든 상태값을 삭제하였습니다.');
      return;
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
      return;
    }
    //현재 상태값을 출력하는 커맨드
    if(message.content.startsWith(config.prefix + 'curst'))
    {
      message.channel.send("현재 상태 값은 "+ curStateDatas[curStateDataIndex] + ' 입니다.');
      return;
    }

    //===================================================================================================

    //전송한 메세지 콘솔에 띄우는 법
    if(message.content===(config.prefix + 'tm1'))
    {
      message.channel.send("#test")
      .then(message=>console.log(`sent message : ${message.content}`))
      .catch(console.error);
    }
    //url 링크 파일 전송하는 법
    else if(message.content===(config.prefix + 'tm2'))
    {
      message.channel.send({
        files: ['http://blogattach.naver.net/d045cc7f6d3734e8c72a437b48a8d7a8025aa2427e/20200203_137_blogfile/harne__1580667756631_QYEa3d_smi/%5BOhys-Raws%5D+ID+Invaded+-+06+%28BS11+1280x720+x264+AAC%29.smi?type=attachment']})
        .then(console.log)
        .catch(console.error);
    }
    //로컬 파일 전송하는 방법
    else if(message.content===(config.prefix + 'tm3'))
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
    else if(message.content===(config.prefix + 'tm4'))
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
    else if(message.content===(config.prefix + 'tm5'))
    {
      message.channel.setName('not_general')
      .then(newChannel => console.log(`Channel's new name is ${newChannel.name}`))
      .catch(console.error);
    }
    //후방 금지 채널로 지정하는 방법
    else if(message.content===(config.prefix + 'tm6'))
    {
      message.channel.setNSFW(true,'there is no reason');
    }
    //카테고리 변경 방법
    else if(message.content===(config.prefix + 'tm7'))
    {
      //첫번째 매개변수에 카테고리의 id 값을 입력해야 합니다.
      message.channel.setParent('674872026997063680', { lockPermissions: false })
      .then(channel => console.log(`New parent of ${message.channel.name}: ${channel.name}`))
      .catch(console.error);
    }
    //메세지를 삭제하는 방법 , 현재부터 2주 전까지의 메세지를 일괄 삭제하는 방법
    else if(message.content===(config.prefix + 'tm8'))
    {
      //첫번째 매개변수에 카테고리의 id 값을 입력해야 합니다.
      message.channel.bulkDelete(5) // 지우고 싶은 메세지 숫자를 입력해요
      .then(messages => console.log(`Bulk deleted ${messages.size} messages`)) // 지운 갯수를 바로 반환 받을 수 있음
      .catch(console.error);
    }
    //초대코드 만드는 방법
    else if(message.content===(config.prefix + 'tm9'))
    {
      message.channel.createInvite({
        temporary :true, // 24동안 역할을 받지 못하면 바로 나가게 하는 초대권을 만들 것인지
        maxAge : 50, // 몇 초 동안 초대 코드를 유지할 것인지. 0이면 무제한
        maxUses : 8,//최대 초대 가능 인원
      })
      .then(invite => console.log(`Created an invite with a code of ${invite.code}`))
      .catch(console.error);
    }
    //특정 단어를 감지하게 하는 방법
    else if(message.content===(config.prefix + 'tm10'))
    {
      //
      const filter = m => m.content.includes('discord');
      const collector = message.channel.createMessageCollector(filter, { time: 15000 });
      collector.on('collect', m => console.log(`Collected ${m.content}`));
      collector.on('end', collected => console.log(`Collected ${collected.size} items`));
    }
    //해당 채널에 있는 사람들에게 역할이나 권한을 덮어씌우는 방법
    else if(message.content===(config.prefix + 'tm11'))
    {
      message.channel.createOverwrite(message.author, {
        SEND_MESSAGES: false
      })
        .then(channel => console.log(channel.permissionOverwrites.get(message.author.id)))
        .catch(console.error);
    }
    //웹훅 만드는 방법
    else  if(message.content===(config.prefix + 'tm12'))
    {
      // Create a webhook for the current channel
      message.channel.createWebhook('Snek', 
        'https://i.imgur.com/mI8XcpG.jpg',
        'Needed a cool new Webhook'
      )
        .then(console.log)
        .catch(console.error)
    }
    //채널 삭제
    else if(message.content===(config.prefix + 'tm13'))
    {
      // Delete the channel
      message.channel.delete('making room for new channels')
      .then(console.log)
      .catch(console.error);
    }
    //채널 수정
    else if(message.content===(config.prefix + 'tm14'))
    {
      // Edit a channel
      message.channel.edit({
         name: 'new-channel',
        position:2,
        topic:'dd',
        nsfw:false,//후방 주의 설정
        bitrate:124,//음성 채널의 음성 헤르츠
        userLimit:4,//최대 인원
        parentID:null,//이 채널의 부모가 될 채널
        lockPermissions:true,//채널 권할을 부모꺼 받을껀지
        //permissionOverwrites //권한 덮어씌우는데 어떻게 씌울지
        //rateLimitPerUser // 

        })
      .then(console.log)
      .catch(console.error);  
    }
    //채널 주제 설정
    else if(message.content===(config.prefix + 'tm15'))
    {
      // Set a new channel topic
      message.channel.setTopic('needs more rate limiting')
      .then(newChannel => console.log(`Channel's new topic is ${newChannel.topic}`))
      .catch(console.error);
    }
    //~~님이 입력하고 있습니다..를 띄움..뭐하는 용도지 이거
    else if(message.content===(config.prefix + 'tm16'))
    {
      // Start typing in a channel with a typing count of five, or set it to five
      message.channel.startTyping(5);

      channel.stopTyping(true); //이거 해야 타이빙합니다~~ 하는게 끝남
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
    else if(message.content === 'what is my avatar')
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

    message.channel.send('You need to enter a valid command!');
    return;
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