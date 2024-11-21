//express 모듈
const express = require('express');

//라우터 객체
const router = express.Router();

// ‘/’ 경로에 대한 get 요청 핸들러 정의
//비동기
router.get('/', async (req, res) =>{
    //로그인을 안했으면
    if(!req.session.user || req.session.user === undefined){
        //로그인 페이지로 이동
        res.redirect('/login');
        return; // 함수 종료
    }

    //user객체
    const user = req.session.user;
    console.log(user.userid)
    //해당 유저 아이디
    const author = req.session.user.userid;

    const mydb = req.app.locals.mydb;
    let friends = [];

    try {
        const accountResult = await mydb.collection('account').findOne({ userid: req.session.user.userid });
        friends = accountResult.friends || [];

        const posts = await mydb.collection('post').find().toArray();
        console.log(posts);

        //'myblog' 템플릿을 렌더링
        res.render('myblog', { user, friends, author, data: posts });
    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        res.status(500).send('서버 오류');
    }
});

//모듈로 내보내기
module.exports = router;