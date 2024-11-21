//express 모듈
const express = require('express');

//라우터 객체
const router = express.Router();

// ‘/’ 경로에 대한 get 요청 핸들러 정의
router.get('/', (req, res) =>{
    console.log('로그아웃');
    req.session.destroy();
    res.redirect('/');
});

//모듈로 내보내기
module.exports = router;