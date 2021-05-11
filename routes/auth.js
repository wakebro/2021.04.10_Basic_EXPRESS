const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const sanitizeHtml = require("sanitize-html");
const template = require("../lib/template.js");
const session = require("express-session");

// passpoart로 변경
/*
const authData = {
  email: "test@test.com",
  password: "111111",
  nickname: "tester",
};
*/

router.get("/login", (request, response) => {
  var fmsg = request.flash();
  var feedbak = "";
  if (fmsg.error) {
    feedbak = fmsg.error[0];
  }
  var title = "WEB - login";
  var list = template.list(request.list);
  var html = template.HTML(
    title,
    list,
    `
      <div style="color:blue;">${feedbak}</div>
      <form action="/auth/login_process" method="post">
        <p><input type="email" name="email" placeholder="email"></p>
        <p><input type="password" name="pwd" placeholder="password"></p>
        <p><input type="submit" value='login'></p>
      </form>
    `,
    ""
  );
  response.send(html);
});

// login_process를 passport로 변경
/*
router.post("/login_process", (request, response) => {
  var post = request.body;
  var email = post.email;
  var password = post.pwd;
  if (email === authData.email && password === authData.password) {
    request.session.is_logined = true;
    request.session.nickname = authData.nickname;
    // 세션이 저장된 후 리다이렉션 실행
    request.session.save(() => {
      response.redirect("/");
    });
  } else {
    response.end("Who?");
  }
  //response.end();
});
*/

router.get("/logout", (request, response) => {
  request.logOut();
  // request.session.destroy((err) => {
  //   response.redirect("/");
  // });
  request.session.save(() => {
    response.redirect("/");
  });
});
module.exports = router;
