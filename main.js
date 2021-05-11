const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const port = 3000;
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("connect-flash");

// Static files service
app.use(express.static("public"));
// 미들웨어 추가
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);
app.use(flash());
app.get("/flash", function (req, res) {
  // Set a flash message by passing the key, followed by the value, to req.flash().
  req.flash("msg", "Flash is back!!");
  res.send("flash");
});

app.get("/flash-display", function (req, res) {
  // Get an array of flash messages by passing the key to req.flash()
  res.render("index", { messages: req.flash("info") });
});

// passport에 사용
const authData = {
  email: "test@test.com",
  password: "111111",
  nickname: "tester",
};

// session 이후에 동작하므로 session 다음에 선언
var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;

app.use(passport.initialize());
app.use(passport.session());

// 로그인 시 성공하여 한번 호출되어 사용자의 식별자를 로컬스토어에 저장
passport.serializeUser(function (user, done) {
  console.log("serializeUser", user);
  done(null, user.email);
});

// 위 serializeUser에 저장된 데이터를 기준으로 필요한 데이터를 조회
passport.deserializeUser(function (id, done) {
  console.log("deserializeUser", id);
  done(null, authData);
});

// 로그인 프로세스
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "pwd",
    },
    function (username, password, done) {
      console.log("LocalStrategy", username, password);
      if (username === authData.email) {
        console.log(1);
        if (password === authData.password) {
          console.log(2);
          return done(null, authData);
        } else {
          console.log(3);
          return done(null, false, { message: "Incorrect password." });
        }
      } else {
        console.log(4);
        return done(null, false, { message: "Incorrect username." });
      }
    }
  )
);

// 로그인 passport로 변경
// 로그인 성공 여부에 따라 이동
app.post(
  "/auth/login_process",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    successFlash: true,
  })
);

// app.get("*",()=>{})_get방식으로 들어오는 요청에 대해서만 처리
app.get("*", (request, response, next) => {
  fs.readdir("./data", function (error, filelist) {
    request.list = filelist;
    next();
  });
});

// Security helmet 사용
app.use(helmet());
// 라우터 모듈 불러오기
const indexRouter = require("./routes/index");
const topicRouter = require("./routes/topic");
const authRouter = require("./routes/auth");

app.use("/", indexRouter);
app.use("/topic", topicRouter);
app.use("/auth", authRouter);

// 없는 페이지 오류 처리
app.use((request, response, next) => {
  response.status(404).send(`Sorry, I can't find it!`);
});

// next(err)
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
