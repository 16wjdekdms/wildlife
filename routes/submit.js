const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');

//이미지 저장될 경로 설정
const storage = multer.diskStorage({
    //destination 함수: 이미지가 저장될 디렉토리 설정
    destination(req, file, done) {
        done(null, './public/uploads/'); // routes 폴더에서 올라가서 public/uploads/로 이동
    },
    //파일 이름 설정
    filename(req, file, done) {
        //파일 확장자 추출
        const ext = path.extname(file.originalname);
        // 파일 이름 설정 (원래 파일이름 + 현재 시간 + 확장자)
        done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
});

//multer 미들웨어 설정, 생성
const upload = multer({
    storage: storage,
});

//사진과 캡션 제목을 넣을 배열
let data = [];

// '/'경로에 대한 get 요청 핸들러
router.get('/', (req, res) =>{
    //user객체
    const user = req.session.user;

    //get 요청시 submit 템플릿 랜더링
    res.render('submit', { user, data });
});

// '/’ 경로에 대한 post 요청 핸들러 정의.
router.post('/', upload.single('image'), (req, res) => {

    console.log(req.file, req.body.title);

    //이미지 캡션
    const title = req.body.title;

    //이미지 경로
    const imagePath = req.file ? '/uploads/' + req.file.filename : null;

    //data 배열에 추가
    if(title && imagePath) {
        data.push({title, image: imagePath})
    }

    //submit 페이지 리다이렉트
    res.redirect('/submit')
});

//라우터 객체를 모듈로 내보내기
module.exports = router;
