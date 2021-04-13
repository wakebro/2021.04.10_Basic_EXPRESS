const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const compression = require("compression");
const indexRouter = require("./routes/index");
const topicRouter = require("./routes/topic");
const port = 3000;

// 미들웨어 추가
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
// 미들웨어 생성
// app.get("*",()=>{})_get방식으로 들어오는 요청에 대해서만 처리
app.get("*", (request, response, next) => {
  fs.readdir("./data", function (error, filelist) {
    request.list = filelist;
    next();
  });
});
// Static files service
app.use(express.static("public"));
// 라우터 불러오기
app.use("/", indexRouter);
app.use("/topic", topicRouter);

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
