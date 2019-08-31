//const request = require('request');
var express = require('express');
var app = express();
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const config = require('../../TargetConfig');

//kakao API code===================================================================
passport.use('login-kakao', new KakaoStrategy({
  clientID : config.kakao.client_id,
  callbackURL : config.kakao.callback_url_redirect // 카카오 개발자 사이트에서 지정한 리다이렉트 URL 
},
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    return done(null, profile);
  }
));

let template_objectObj = {
  object_type: 'text',
  text: ' Hello Kakao!(텍스트 영역입니다. 최대 200자 표시 가능합니다.)',
  'link': {
    web_url: 'https://developers.kakao.com',
    mobile_web_url: 'https://developers.kakao.com'
  }
};
// Javascript -> JSON 타입으로 변경
let template_objectStr = JSON.stringify(template_objectObj);
let options = {
    url: 'https://kapi.kakao.com/v2/api/talk/memo/default/send',
    method: 'POST',
    headers: {
    'Authorization': 'Bearer xxxxxxxxxxxxxxxxxxxxxx',
        'Content-Type': 'application/x-www-form-urlencoded',
  },
  form: {
    template_object: template_objectStr,
  }
};

function callback(error, response, body) {
  console.log(response.statusCode);
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
}


//Dikao code========================================================================
function WebServerStart()
{
  var server = app.listen(8080, function(){
    console.log("Express server has started on port 8080")
  })

  app.get('/login-kakao', passport.authenticate("login-kakao",{
    successRedirect: '/start-dikao',
    failureRedirect: '/start-dikao'
  }));

  app.get('/start-dikao',function(req,res){
    console.log("Some One Call start-dikao function!")
    res.send('this is start-dikao function');
  })

  app.get('/sendMessageToMe',function(req,res){
    request(options, callback);
  })
}

module.exports.Start=WebServerStart;





