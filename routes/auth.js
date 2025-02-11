const express = require("express");
const userModel = require("../models/user");
const authUtils = require("../utils/authUtils");
const passport = require("../config/passport");
const tokenModel = require("../models/token");

const router = express.Router();

router.post("/register", async (req, res) => {
    const foundUser = await userModel.getUserByEmailOrUsername(req.body.email, req.body.username);
    console.log(foundUser);

    if (foundUser) {
        if (foundUser.email === req.body.email) {
            res.status(400).json({
                success: false,
                message: "Email or username already taken."
            });

        } else {
            res.status(400).json({
                success: false,
                message: "Email or username already taken."
            });

        }
    } else {
        const saltHash = authUtils.generatePassword(req.body.password);
        const createdUser = await userModel.createUser(req.body.email, req.body.username, saltHash.salt, saltHash.hash);
        if (createdUser) {
            res.json(createdUser);
        } else {
            res.status(500).json({
                success: false,
                message: "An unexpected error occurred. Please try again later."
            });

        };
    }
});

router.post("/login", async (req, res) => {
    const foundUser = await userModel.getUserByEmail(req.body.email);

    if (!foundUser) {
        res.status(400).json({
            success: false,
            message: "Invalid username or password."
        });
    } else {
        const passwordIsValid = authUtils.validatePassword(foundUser.hash, foundUser.salt, req.body.password);

        if (passwordIsValid) {
            try {
                const user = await userModel.getUserByEmailOrUsername(req.body.email);
                
                const signedToken = authUtils.issueJWT(user);
                res.json({
                    success: true,
                    message: "Succesful login.",
                    access_token: signedToken
                });
            } catch (err) {
                res.status(500).json({
                    success: false,
                    message: "Internal server error. Please try again later."
                });
            }            

        } else {
            res.status(400).json({
                success: false,
                message: "Invalid username or password."
            });
        }
    }
});

router.post("/logout", (req, res) => {
    passport.authenticate("jwt", { session: false }, async (err, user, info) => {
        if (err || !user) {
            // Unauthenticated
            return res.status(400).json({
                success: false,
                message: "No valid token provided."
            });
            
        } else {
            // Authenticated
            const token = req.headers.authorization.split(" ")[1];
            
            try {
                const data = await tokenModel.blacklistToken(token);
                res.json({
                    success: true,
                    message: "User logout successfully registered."
                })
                
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    success: false,
                    message: "User logout could not be registered."
                });
            }    
        }
    })(req, res);
});

module.exports = router;