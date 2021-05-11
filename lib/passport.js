module.exports = function (app) {
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
  return passport;
};
