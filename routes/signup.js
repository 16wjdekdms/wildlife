//express 모듈
const express = require('express');
//암호
const sha = require('sha256');

//라우터객체
const router = express.Router();

// - 기호를 전화번호 형식에 맞게 추가하는 함수
function formatPhone(num) {

    // 숫자를 제외한 모든 문자 제거
    num = num.replace(/[^0-9]/g, '');

    // - 추가
    num = num.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
    
    return num;
}

// ‘/’ 경로에 대한 get 요청 핸들러 정의
router.get('/', (req, res) =>{
    //로그인 상태
    if(req.session.user){
        console.log('세션유지');
        //flash 메시지 설정
        req.flash('info', '이미 로그인 되었습니다.');
        //메인페이지로 이동
        res.redirect('/');
    }
    //로그인X
    else{
        //get 요청시 ‘form’ 템플릿(회원가입)을 렌더링
        res.render('form');
    }
    
});

//‘/’ 경로에 대한 post 요청 핸들러 정의
router.post('/', (req, res) => {
    // app.locals에서 mydb 가져오기
    const mydb = req.app.locals.mydb;

    //요청으로부터 데이터 추출
    const name = req.body.name;
    const add = req.body.add;
    const phone = formatPhone(req.body.phone); //전화번호 가공
    const email = req.body.email;
    const userid = req.body.userid;
    const userpw = req.body.userpw;


    //account에 정보 추가
    mydb.collection("account").insertOne({
        userid : userid,
        userpw : sha(userpw), //비밀번호 암호화
        name : name,
        address : add,
        phone : phone,
        email : email,
        friends : [],
    })
    .then((result) => {
        console.log('회원가입 성공')
    })
    
    //table 템플릿 렌더링, 추출한 데이터를 전달
    res.render('table', {name, add, phone, email, userid, userpw}); //pug 템플릿 파일을 사용
});

//라우터 객체를 모듈로 내보내기
module.exports = router;

