//express 모듈
const express = require('express');
//라우터 객체
const router = express.Router();

// ‘/’ 경로에 대한 get 요청 핸들러 정의
router.get('/', (req, res) =>{

    //user객체
    const user = req.session.user;
    
    //get 요청시 ‘pet’ 템플릿을 렌더링
    res.render('pet', {user});
});

//라우터 객체를 모듈로 내보내기
module.exports = router;

