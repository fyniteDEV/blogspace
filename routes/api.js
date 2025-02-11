const express = require("express");
const router = express.Router();
const commentModel = require("../models/comment");
const passport = require("../config/passport");
const postModel = require("../models/post");


router.get("/latest", async (req, res) => {
    const offset = req.query.offset;
    const limit = req.query.limit;

    const latestPosts = await postModel.getLatestPosts(limit, offset);
    console.log(latestPosts[0].title);
    res.json(latestPosts);
})

router.post("/new-comment", (req, res) => {
    passport.authenticate("jwt", { session: false }, async (err, user, info) => {
        // Unauthenticated
        if (err || !user) {
            return res.status(400).json({
                success: false,
                message: "No valid token provided."
            });
        // Authenticated
        } else {
            const post = await postModel.getPostBySlug(req.body.slug);

            const newComment = await commentModel.postNewComment(req.body.content, user.id, post.id);
            if (!newComment) {
                res.status(500).json({
                    success: false,
                    message: "An unexpected error occurred. Please try again later."
                });
            } else {
                res.json({
                    success: true,
                    message: "New comment registered."
                })
            }
        }
    })(req, res);
});

router.get("/blog/:slug/comments", async (req, res) => {
    try {
        const post = await postModel.getPostBySlug(req.params.slug);
        
        if (!post) {
            res.status(400).json({
                success: false,
                message: "Invalid post slug."
            });
        } else {
            const comments = await commentModel.getComments(post.id);
            res.json(comments);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred. Please try again later."
        });
    }
});

module.exports = router;