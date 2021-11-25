const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")

getLoggedIn = async (req, res) => {
    if(req.userId || req.cookies.token){
        auth.verify(req, res, async function () {
            let verified = null;
            let loggedInUser = null;
            if(req.cookies.token) {
                verified = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
                loggedInUser = await User.findOne({ _id: verified.userId });
                if(!loggedInUser){
                    loggedInUser = await User.findOne({ _id: req.userId });
                }
            }
            else{
                loggedInUser = await User.findOne({ _id: req.userId });
            }
            if(loggedInUser){
                return res.status(200).json({
                    loggedIn: true,
                    user: {
                        firstName: loggedInUser.firstName,
                        lastName: loggedInUser.lastName,
                        email: loggedInUser.email,
                        loginName: savedUser.loginName
                    }
                });
            }
        })
    }
    else{
        return res.status(400).json({
            errorMessage: "Not Logged In"
        }).send();
    }
    }

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, passwordVerify, loginName} = req.body;
        if (!firstName || !lastName || !email || !password || !passwordVerify || !loginName) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        let existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }
        existingUser = await User.findOne({ loginName: loginName });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this login name already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName, lastName, email, passwordHash, loginName
        });
        const savedUser = await newUser.save();

        // LOGIN THE USER
        const token = auth.signToken(savedUser);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                loginName: savedUser.loginName
            }
        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

loginUser = async (req, res) => {
    try{
        const { user, password } = req.body;
        if(!user || !password) {
            return res
                .status(400)
                .json({errorMessage: "Please enter all required fields."});
        }

        let existingUser = await User.findOne({email: user});
        if(!existingUser)
            existingUser = await User.findOne({loginName: user})
        if(!existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "Incorrect Username or Password"
                })
        }
        bcrypt.compare(password, existingUser.passwordHash, function(err, result) {
            if(!result){
                // WRONG PASSWORD
                return res
                    .status(400)
                    .json({errorMessage: "Incorrect Username or Password"});
            }
            else{
                const token = auth.signToken(existingUser);
        
                return res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none"
                }).status(200).json({
                    success: true,
                    user: {
                        firstName: existingUser.firstName,
                        lastName: existingUser.lastName,
                        email: existingUser.email,
                        loginName: existingUser.loginName
                    }
                }).send();
            }
        });
    }catch(err){
        console.error(err);
        res.status(500).send();
    }
}

logoutUser = async(req, res) => {
    try{
        return res.clearCookie('token').status(200).json({success: true});
    }catch(err){
        console.error(err);
        res.status(500).send();
    }
}

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser
}