const express = require("express");
const router = express.Router();
const postModel = require("../models/post");

const authRouter = require("./auth");
const blogRouter = require("./blog");
const apiRouter = require("./api");


// Middleware
const authenticateJWT = require("../utils/middlewares/authenticateJWT");


// Routes
// Authenticator route
router.get("*", (req, res, next) => {
    // If the request has an Authorization header or it is trying to
    // access the api, load the requested page
    if (req.headers.authorization || req.params[0].startsWith("/api/")) {
        return next();
    }
    // If not, then a loader page will send the JWT and send it along the
    // GET request
    res.sendFile("views/loader.html", { root: __dirname + "/../" });
});

router.use("/blog", blogRouter);
router.use("/api/auth", authRouter);
router.use("/api", apiRouter);

router.get("/", 
    async (req, res, next) => {
        try {
            req.latestPosts = await postModel.getLatestPosts(5);
            next();
        } catch (error) {
            return res.status(500).send("<p>Internal server error. Please try again later");
        }
    },
    (req, res) => authenticateJWT(
        { unauthenticated: "landing" }, 
        { blogs: req. latestPosts }
    )(req, res)
);

router.get("/login", authenticateJWT({ unauthenticated: "login" }));

router.get("/register", authenticateJWT({ unauthenticated: "register" }));

router.get("*", authenticateJWT({ unauthenticated: "404" }));


module.exports = router;