const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res
        .status(401)
        .json({ msg: "No authentication token , authorization denied" });
    }
    try {
        console.log("secret -----", process.env.JWT_SECRET)
        console.log("token -----", token)
        const verified =  jwt.verify(token, process.env.JWT_SECRET);
        console.log("verified", verified);
    } catch (error) {
        console.log(error)
    }

    if (!verified) {
      return res
        .status(401)
        .json({ msg: "Token verification failed , authorization denied" });
    }
    res.user = verified.id;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = auth;