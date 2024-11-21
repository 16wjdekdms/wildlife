//express 모듈
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

//저장될 경로 설정
const storage = multer.diskStorage({
    //destination 함수: 파일이 저장될 디렉토리 설정
    destination(req, file, done) {
        done(null, './public/uploads/'); 
    },
    //파일 이름 설정
    filename(req, file, done) {
        //파일 확장자 추출
        const ext = path.extname(file.originalname);
        // 파일 이름 설정 (원래 파일이름 + 현재 시간 + 확장자)
        done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
});

const upload = multer({ storage: storage });

//라우터 객체
const router = express.Router();

//첨부된 문서의 내용 저장
let documentContent = '';

router.get('/', (req, res) => {
    res.render('enter');
});

router.post('/save', function(req, res){
    const mydb = req.app.locals.mydb;
    let text_content; //첨부 문서 내용 저장
    // 호출되는 시간 기록
    let now = new Date();
    userid = req.session.user.userid;
    if(documentContent){
        text_content = documentContent;
    }

    text_content = text_content+ "\n" + req.body.content;
    console.log(req.body.title);
    console.log(req.body.content);
  
    mydb.collection('post').insertOne( 
      {title : req.body.title, content : text_content, author : userid, date : now.toLocaleDateString('KR')})
      .then(result => {
          console.log(result);
          res.redirect('/blog');
      });
});

router.post('/text', upload.single('document'), function(req, res){
    console.log(req.file);
    // 업로드된 파일이 있는지 확인
    if (req.file) {
        //이미지 경로
        const filePath = req.file ? 'public/uploads/' + req.file.filename : null;
        console.log(filePath);

        documentContent = fs.readFileSync(filePath, 'utf-8');
        console.log('File content:', documentContent);
    } else {
        // 파일이 제대로 업로드되지 않은 경우
        console.log('Error: No file uploaded or file content is undefined.');
        res.status(400).send('Error: No file uploaded or file content is undefined.');
    }
});

//모듈로 내보내기
module.exports = router;