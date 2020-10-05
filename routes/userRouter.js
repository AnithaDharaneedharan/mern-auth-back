const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
require('dotenv').config()

router.get("/test", (req, res) => {
  res.send("hello it works");
});

router.post("/register", async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName } = req.body;
    //validate
    if (!email || !password || !passwordCheck) {
      return res.status(400).json({ msg: "Not all fields have been entered" });
    }
    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: "password needs to be atleast 5 characters long" });
    }
    if (password !== passwordCheck) {
      return res
        .status(400)
        .json({ msg: "enter the same password twice for verification" });
    }
    const existingUser = await User.findOne({ email: email });
    console.log("user", existingUser);
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "An account with this email already exists" });
    }
    if (!displayName) {
      displayName = email;
    }
    // password hashing
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});


router.post("/login", async (req, res) => {
   try {
     const { email, password } = req.body;
     //validate
     if (!email || !password) {
       return res
         .status(400)
         .json({ msg: "Not all fields have been entered" });
     }
     const user = await User.findOne({ email: email });
     if (!user) {
       return res
         .status(400)
         .json({ msg: "No account with this email has been registered" });
     }
     const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { algorithm: 'RS256' });
     res.json({
       token,
       user: {
         id: user._id,
         displayName: user.displayName,
         email: user.email,
       },
     });
   } catch (error) {
     console.log(error);
     res.status(500).json({ error: error.message });
   }
 });

 router.delete('/delete', auth, async (req, res) => {
   console.log("ene")
 })

module.exports = router;
