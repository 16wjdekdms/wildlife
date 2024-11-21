//express 모듈
const express = require('express');

//라우터 객체
const router = express.Router();

//비동기
router.get('/', async (req, res) => {
    const mydb = req.app.locals.mydb;
    //메시지가 있으면 저장
    const infomessage = req.flash('info');
    let msg;
    let friends = [];
    let count = 0;
    const user = req.session.user;

    try {
        // 로그아웃 상태
        if (!user) {
            msg = "로그아웃 상태입니다. \n로그인 하여 친구의 post를 확인하세요!";
        } else {
            // 몽고DB에서 userid 찾기
            const result = await mydb.collection('account').findOne({ userid: req.session.user.userid });

            //찾은 경우
            if (result) {
                friends = result.friends || []; // friends가 null이면 빈 배열로 초기화
            } else {
                friends = [];
            }
        }

        // 'post' 컬렉션에서 데이터 가져오기
        const posts = await mydb.collection('post').find().toArray();

        // 렌더링 시 데이터 전달
        res.render('home', { infomessage, user, msg, friends, data: posts, count });
    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        res.status(500).send('서버 오류');
    }
});

//모듈로 내보내기
module.exports = router;