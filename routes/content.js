const ObjId = require('mongodb').ObjectId;

//express 모듈
const express = require('express');

//라우터 객체
const router = express.Router();

router.get("/:id", function (req, res) {
    const mydb = req.app.locals.mydb;
    console.log(req.params.id);
    let new_id = new ObjId(req.params.id);
    let userid;
    //user객체
    const user = req.session.user;
    
    //로그인X
    if(!(req.session.user)){
      userid = "";
    }
    else{
      //사용자 아이디 저장 변수
      userid = req.session.user.userid;   
    }
     

    if(userid === undefined){
        userid = '';
    }
    
    mydb.collection('post').findOne({ _id: new_id }) //몽고db에서 id찾기
    .then(result => { 
      console.log(result); // 넘겨주기
      res.render('content', { user, userid, data : result });
    }).catch(err =>{
      console.log(err)
      res.status(500).send();
    });
});

//라우터 객체를 모듈로 내보내기
module.exports = router;