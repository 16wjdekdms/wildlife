//express 모듈
const express = require('express');

//라우터 객체
const router = express.Router();

router.get('/', async (req, res) => {
    //로그인이 안되어 있는 경우
    if(!req.session.user || req.session.user === undefined){
        //로그인 페이지로 이동
        res.redirect('/login');
        return; // 함수 종료
    }

    const mydb = req.app.locals.mydb;
    let friends = [];

    //user객체
    const user = req.session.user;
    //해당 유저 아이디
    const userid = req.session.user.userid;
    
    try {
        //내 아이디로 찾기
        const userResult = await mydb.collection('account').findOne({ userid: user.userid});

        //해당 유저 아이디
        const account = await mydb.collection('account').findOne({ userid: req.session.user.userid });
        friends = account.friends || [];

        const accountResult = await mydb.collection('account').find().toArray();
        console.log(accountResult);

        //템플릿을 렌더링
        res.render('friends', { user, friends, userResult, userid, data: accountResult });
    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        res.status(500).send('서버 오류');
    }
});

//모듈로 내보내기
module.exports = router;