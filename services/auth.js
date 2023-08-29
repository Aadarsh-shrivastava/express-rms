const jwt = require("jsonwebtoken");
const secret = "Aadarsh&22$";

function setToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    secret
  );
}

function getToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

module.exports = {
  setToken,
  getToken,
};
