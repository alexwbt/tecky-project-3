import * as passport from 'passport';
import * as passportJWT from 'passport-jwt';
import * as jwtSimple from "jwt-simple";
import { userService } from './main';

const JWTStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;

const jwt = {
    jwtSecret: "Iamasecretthatyoushouldneverrevealtoanyone",
    jwtSession: { session: false }
};

passport.use(new JWTStrategy({
    secretOrKey: jwt.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, async (payload, done) => {
    try {
        const user = await userService.getUserWithUsername(payload.username);
        if (user) {
            return done(null, user);
        }
        return done(new Error("User Not Found"), null);
    } catch (err) {
        return done(err, null);
    }
}));

export const getToken = (userId: number, username: string) =>
    jwtSimple.encode({ id: userId, username }, jwt.jwtSecret);

export const isLoggedIn = passport.authenticate('jwt', { session: false });
