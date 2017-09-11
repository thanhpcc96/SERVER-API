import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';

import User from '../models/user.model';
import constants from '../config/constants';

/*
*Xac thuc local
*/
const localOpt = { usernameField: 'email' };
const localLogin = new LocalStrategy(
    localOpt,
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false);
            } else if (!user.authenticateUser(password)) {
                return done(null, false);
            }
            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    }
);
/*
* JWT Strategy Auth
*/
const jwtOpt = {
    // lay token tu auth tu header for JWT
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: constants.JWT_SECRET,
};

const jwtLogin = new JWTStrategy(jwtOpt, async (payload, done) => {
    try {
        const user = await User.findById(payload._id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        return done(error, false);

    }
});

passport.use(localLogin);
passport.use(jwtLogin);

export const authLocal = passport.authenticate('local', { session: false });
export const authJwt = passport.authenticate('jwt', { session: false });
