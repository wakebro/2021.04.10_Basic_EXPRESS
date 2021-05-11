let express = require("express");
let router = express.Router();
let template = require("../lib/template.js");
let auth = require("../lib/auth.js");

router.get("/", (request, response) => {
  console.log("/", request.user);
  var fmsg = request.flash();
  var feedbak = "";
  if (fmsg.success) {
    feedbak = fmsg.success[0];
  }
  var title = "Welcome";
  var description = "Hello, Node.js";
  var list = template.list(request.list);
  var html = template.HTML(
    title,
    list,
    `
      <h2>${title}</h2>${description}
      <img src="images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
      `,
    `<a href="/topic/create">create</a>`,
    auth.statusUI(request, response)
  );
  response.send(html);
});
module.exports = router;
