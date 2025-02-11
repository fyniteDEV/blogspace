const express = require("express");
const router = express.Router();
const postModel = require("../models/post");

// Middleware
const authenticateJWT = require("../utils/middlewares/authenticateJWT");

router.get("/", (req, res) => {
    res.redirect("archive");
});

router.get("/archive", 
    async (req, res, next) => {
        try {
            req.posts = await postModel.getLatestPosts();
            next();
        } catch (error) {
            return res.status(500).send("<p>Internal server error. Please try again later");
        }
    },
    (req, res) => authenticateJWT(
        { unauthenticated: "archive" }, 
        { blogs: req. posts }
    )(req, res)
);

router.get("/:slug", async (req, res, next) => {
    const foundPost = await postModel.getPostBySlug(req.params.slug);

    res.locals.title = foundPost.title;
    res.locals.body = foundPost.body;
    res.locals.author = foundPost.author;
    res.locals.slug = foundPost.slug;

    const createdAt = new Date(foundPost.created_at);
    const createdAtString = `${String(createdAt.getDate()).padStart(2, '0')}-${String(createdAt.getMonth() + 1).padStart(2, '0')}-${createdAt.getFullYear()}`
    res.locals.createdAt = createdAtString;
    
    const updatedAt = new Date(foundPost.updated_at);
    const updatedAtString = `${String(updatedAt.getDate()).padStart(2, '0')}-${String(updatedAt.getMonth() + 1).padStart(2, '0')}-${updatedAt.getFullYear()}`
    res.locals.updatedAt = updatedAtString
    
    next();
}, authenticateJWT({ unauthenticated: "blog" }));


module.exports = router;