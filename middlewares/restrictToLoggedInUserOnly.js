const { getToken } = require("../services/auth");

async function restrictToLoggedInUserOnly(req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.redirect("/login");
  const verifiedToken = getToken(token);

  if (!verifiedToken) return res.redirect("/login");

  req.token = verifiedToken;
  next();
}

module.exports = { restrictToLoggedInUserOnly };
