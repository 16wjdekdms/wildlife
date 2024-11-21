//express 모듈
const express = require('express');
//flash
const flash = require('express-flash');
//암호
const sha = require('sha256');

//라우터 객체
const router = express.Router();

// ‘/’ 경로에 대한 get 요청 핸들러 정의
router.get('/', (req, res) =>{
    console.log(req.session);
    //req.sesson.user 데이터가 존재한다면
    if(req.session.user){
        //로그인 상태로 간주
        console.log('세션유지');
        //flash 메시지 설정
        req.flash('info', '이미 로그인 되었습니다.');
        //메인페이지로 이동
        res.redirect('/');
    }
    else{
        //아니면 로그인 페이지 렌더링
        res.render('login');
    }
    
});

//‘/’ 경로에 대한 post 요청 핸들러 정의
router.post('/', (req, res) => {
    const mydb = req.app.locals.mydb; // app.locals에서 mydb 가져오기

    console.log("아이디 : " + req.body.userid);
    console.log("비밀번호 : " + req.body.userpw);

    mydb.collection('account').findOne({userid : req.body.userid}) //몽고db에서 userid찾기
    .then((result) => { //있으면
        //비밀번호 일치 확인(암호화 했기 때문에 고려해서 비교)
        if (result.userpw == sha(req.body.userpw)){
            //계정정보를 req.sesson.user라는 이름의 세션에 추가
            req.session.user = req.body;
            console.log("새로운 로그인");
            res.redirect('/');
        }
        else{
            res.send('비밀번호가 틀렸습니다.')
        }
    })
});

//모듈로 내보내기
module.exports = router;