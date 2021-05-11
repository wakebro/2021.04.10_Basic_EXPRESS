const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const sanitizeHtml = require("sanitize-html");
const template = require("../lib/template.js");
const session = require("express-session");

module.exports = function (passport) {
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

  // 로그인 성공 여부에 따라 이동
  router.post(
    "/login_process",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/auth/login",
      failureFlash: true,
      successFlash: true,
    })
  );

  router.get("/logout", (request, response) => {
    request.logOut();
    // request.session.destroy((err) => {
    //   response.redirect("/");
    // });
    request.session.save(() => {
      response.redirect("/");
    });
  });
  return router;
};
