const ObjId = require('mongodb').ObjectId;

//express 모듈
const express = require('express');

//라우터 객체
const router = express.Router();

router.get("/:id", function (req, res) {    
    const mydb = req.app.locals.mydb;
    console.log(req.params.id);
    let new_id = new ObjId(req.params.id);

    //user객체
    const user = req.session.user;
  
    mydb.collection('post').findOne({ _id: new_id }) //몽고db에서 해당 id 객체 찾기
    .then(result => { 
      console.log(result); 
      res.render('edit.pug', { user, data : result }); // 넘겨주기
    }).catch(err =>{
      console.log(err)
      res.status(500).send();
    });
});

router.post('/', function(req, res){
    const mydb = req.app.locals.mydb;
    console.log(req.body.title);
    console.log(req.body.content);
    let userid = req.session.user.userid;
    let new_id = new ObjId(req.body.id); //edit.ejs의 43번쨰 줄에서 id로 넘겨받음
  
    mydb.collection('post').updateOne({_id: new_id},
      {$set: {title : req.body.title, content : req.body.content, author : userid, date : req.body.someDate}})
      .then(result => {
        console.log('데이터 수정 성공');
        res.redirect('/blog');
      });
});

//모듈로 내보내기
module.exports = router;