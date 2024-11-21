const ObjId = require('mongodb').ObjectId;

//express 모듈
const express = require('express');

//라우터 객체
const router = express.Router();

// ‘/’ 경로에 대한 get 요청 핸들러 정의
//비동기
router.get('/:author', async (req, res) =>{
    console.log(req.params.author);
    let user;
    
    //로그인X
    if(!(req.session.user)){
        user = null;
      }
      else{
        //현재 user객체
        user = req.session.user;  
    }
    
    //내 친구 저장 변수
    let myfriends = [];

    //해당 유저(글쓴) 아이디
    const author = req.params.author;
    //글쓴이의 친구 저장 변수
    let friends = [];

    const mydb = req.app.locals.mydb;
    let userResult = "";

    try {
        
        if(user != null){
            //내 아이디로 찾기
            userResult = await mydb.collection('account').findOne({ userid: user.userid});
            //내 친구 데이터 저장
            myfriends = userResult.friends || [];
        }

        //글쓴이 아이디로 찾기
        const accountResult = await mydb.collection('account').findOne({ userid: author});
        //글쓴이의 친구 데이터 저장
        friends = accountResult.friends || [];
        
        const posts = await mydb.collection('post').find().toArray();
        console.log(posts);

        //'blog' 템플릿을 렌더링
        res.render('myblog', { myfriends, user, userResult, friends, author, data: posts });
    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        res.status(500).send('서버 오류');
    }
});

//모듈로 내보내기
module.exports = router;