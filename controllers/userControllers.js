const asyncHalder = require("express-async-handler");
const User = require("../models/userModel");
const bcypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const registerUser = asyncHalder( async (req, res) => {
    const {username, email, password} = req.body;
    if(!username || !email || !password) {
        res.status(400);
        throw new Error("all fields are mandatory");
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable) {
        res.status(400)
        throw new Error("User already exist");
    }
    
    const hashedPassword = await bcypt.hash(password, 10);
    const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword
    })

    const result = await newUser.save();
    if(result) {
        res.status(200).json({_id: newUser.id, email: newUser.email, message: "Registered"});
    } else {
        res.status(400);
        throw new Error("User data not saved")
    }
})

const loginUser = asyncHalder(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const user = await User.findOne({ email });

    if (user && (await bcypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    id: user.id,
                },
            },
            process.env.JWT_SECRET, // secret phrase anything
            { expiresIn: "30m" } // JWT token expires in 30 Minutes 
        );
        res.status(200).json({ access: accessToken, message: "Success" });
    } else {
        res.status(404);
        throw new Error("Invalid credentials");
    }
});

module.exports = {registerUser, loginUser};