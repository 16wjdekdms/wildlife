const mongoclient = require("mongodb").MongoClient;
const ObjId = require('mongodb').ObjectId;
const url ='mongodb+srv://udmin:1213@cluster0.kdtozsc.mongodb.net/?retryWrites=true&w=majority' ;
let mydb;
mongoclient
  .connect(url)
  .then((client) => {

    mydb = client.db('myblog');
    app.locals.mydb = mydb; // app.locals에 저장

    app.listen(3000, function () {
      console.log("포트 3000으로 서버 대기중 ... ");
    });
  })
  .catch((err) => {
    console.log(err);
  });

//express, 파일 처리를 위한 미들웨어..
const express = require('express');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');

//secretKey 생성
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');

//라우터 모듈 import
const homeRouter = require('./routes/home');
const signupRouter = require('./routes/signup');
const blogRouter = require('./routes/blog');
const loginRouter = require('./routes/login');
const enterRouter = require('./routes/enter');
const editRouter = require('./routes/edit');
const conRouter = require('./routes/content');
const f_blogRouter = require('./routes/f_blog');
const friendRouter = require('./routes/friends_list');
const logoutRouter = require('./routes/logout');
const addRouter = require('./routes/add');
const f_dRouter = require('./routes/f_delete');
const d_Router = require('./routes/delete');

const subRouter = require('./routes/submit');
const mypetRouter = require('./routes/mypet');


//express 애플리케이션 생성
const app = express();

//pug 템플릿 엔진 설정
app.set('view engine', 'pug'); 

// 정적 파일 제공
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
  }));

//각 라우터 등록
app.use('/', homeRouter);
app.use('/signup', signupRouter);
app.use('/blog', blogRouter)
app.use('/login', loginRouter)
app.use('/enter', enterRouter);
app.use("/edit", editRouter);
app.use("/content", conRouter);
app.use("/f_blog", f_blogRouter);
app.use("/friends_list", friendRouter);
app.use("/logout", logoutRouter);
app.use("/add_friend", addRouter);
app.use("/delete_friend", f_dRouter);
app.use("/delete", d_Router);

app.use('/submit', subRouter)
app.use('/mypet', mypetRouter);

