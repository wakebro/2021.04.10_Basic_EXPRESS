const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const sanitizeHtml = require("sanitize-html");
const template = require("../lib/template.js");
const session = require("express-session");

const authData = {
  email: "test@test.com",
  password: "111111",
  nickname: "tester",
};

router.get("/login", (request, response) => {
  var title = "WEB - login";
  var list = template.list(request.list);
  var html = template.HTML(
    title,
    list,
    `
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

router.get("/logout", (request, response) => {
  request.session.destroy((err) => {
    response.redirect("/");
  });
});
module.exports = router;
