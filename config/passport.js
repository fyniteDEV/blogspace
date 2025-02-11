const passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require("fs");
const userModel = require("../models/user");

const publicKey = fs.readFileSync(__dirname + "/public.pem", "utf8");

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: publicKey,
    algorithms: ["RS256"]
};

const strategy = new JwtStrategy(options, async (jwt_payload, done) => {
    try {
        const user = await userModel.getUserByUUID(jwt_payload.sub);

        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
});

passport.use(strategy);

module.exports = passport;