const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
var jwt = require('jsonwebtoken');
const privateKey = process.env.PRIVATE_KEY;


router.post("/register", async (req, res) => {
    try {
        // generate hash password
        let salt = await bcrypt.genSalt(10);
        let hashpassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashpassword,
        });
        // save new user
        const user = await newUser.save();

        const token = jwt.sign({ user: newUser }, privateKey);
        res.cookie("jwtToken", token,{httpOnly:true})
        res.status(200).json(newUser);

    } catch (error) {
        return res.status(500).json(error);
    }

})


router.post("/login", async (req, res) => {
    try {
        const finduser = await User.findOne({ email: req.body.email });
        if (!finduser) {
            return res.status(404).json("user not found");
        }

        const pass = await bcrypt.compare(req.body.password, finduser.password);
        if (!pass) {
            return res.status(400).json("invalid password");
        }

        const token = jwt.sign({ user: finduser }, privateKey);
        res.cookie("jwtToken", token ,{httpOnly:true})
        res.status(200).json(finduser);

    } catch (error) {
        res.status(500).json("error");
    }
})

module.exports = router;