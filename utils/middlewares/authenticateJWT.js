const passport = require("../../config/passport");

const authenticateJWT = ((pages, locals) => (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        // Unauthenticated
        if (err || !user) {
            return res.render(pages.unauthenticated, { ...locals, user: null });
        // Authenticated
        } else {
            // If there is no authenticated page provided, default to the
            // unauthenticated page
            return res.render(pages.authenticated ?? pages.unauthenticated, { ...locals, user: user });
        }
    })(req, res, next);
});

module.exports = authenticateJWT;