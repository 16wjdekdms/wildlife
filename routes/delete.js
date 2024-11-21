const ObjId = require('mongodb').ObjectId;

//express 모듈
const express = require('express');

//라우터 객체
const router = express.Router();

router.post("/", function (req, res) {
    console.log(req.body); 
    req.body._id = new ObjId(req.body._id); 

    const mydb = req.app.locals.mydb;
    //$pull 연산자: friends 배열에 req.body.new_friend 값을 추가
    mydb.collection('post').deleteOne(req.body)
        .then((result) => {
            console.log('친구 삭제');
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
    })
          
});

//모듈로 내보내기
module.exports = router;