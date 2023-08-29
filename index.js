const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const { setToken } = require("./services/auth");
const User = require("./models/User");
const Records = require("./models/Reords");
const {
  restrictToLoggedInUserOnly,
} = require("./middlewares/restrictToLoggedInUserOnly");

const handlebars = require("express-handlebars").create({
  defaultLayout: "main",
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("home");
});

(async () => {
  await User.sync({ force: true });
  await Records.sync({});
  //creating default teacher user
  await User.create({
    name: "user",
    email: "aa@bb.cc",
    password: "123456",
    isTeacher: true,
  });
})();

// routes

app.get("/loginCheck", (req, res) => {
  if (!req.cookies.token) res.redirect("login");
  res.redirect("record");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/record", restrictToLoggedInUserOnly, async (req, res) => {
  const records = await Records.findAll();
  res.render("record", { records: records });
});

app.get("/addpage", (req, res) => {
  res.render("addpage");
});

app.get("/editpage/:id", async (req, res) => {
  const result = await Records.findOne({
    where: {
      id: req.params.id,
    },
  });
  // console.log(req.body.rollnumber, JSON.stringify(result, null, 2));
  const newResult = {};
  newResult.rollnumber = result.rollnumber;
  newResult.dob = result.dob;
  newResult.name = result.name;
  newResult.score = result.score;
  res.render("editpage", { id: req.params.id, result: newResult });
});

app.post("/add", async (req, res) => {
  // console.log("asdasd", req.body);
  await Records.create(req.body).then(() => {
    res.render("home");
  });
});

app.get("/delete/:id", async (req, res) => {
  const count = await Records.destroy({ where: { id: req.params.id } });
  res.redirect("../record");
  // console.log("deleted row(s):", count);
});

app.post("/edit/:id", async (req, res) => {
  // console.log(req.body);
  await Records.update(req.body, { where: { id: req.params.id } });
  // console.log("working updated");
  res.redirect("../record");
});

app.get("/searchPage", (req, res) => {
  res.render("searchPage");
});
app.post("/search", async (req, res) => {
  const result = await Records.findOne({
    where: {
      rollnumber: req.body.rollnumber,
      dob: req.body.dob,
    },
  });
  // console.log(req.body.rollnumber, JSON.stringify(result, null, 2));
  const newResult = {};
  newResult.rollnumber = result.rollnumber;
  newResult.dob = result.dob;
  newResult.name = result.name;
  newResult.score = result.score;
  res.render("matchingResult", { result: newResult });
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (user.auth(req.body.password)) {
    const token = setToken(user);
    res.cookie("token", token);
    res.redirect("record");
    // console.log("user log,", user);
  } else {
    res.redirect("login");
  }
});

app.listen(3000);
