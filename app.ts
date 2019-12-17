import * as express from "express";
import * as bodyParser from "body-parser";
import * as expressSession from 'express-session';

import * as passport from "passport";
import * as passportLocal from "passport-local";
import { checkPassword } from "./hash";

import * as Knex from 'knex';


const knexConfig = require('./knexfile');
const knex = Knex(knexConfig[process.env.NODE_ENV || "development"]);


const app = express();
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));


const sessionMiddleware = expressSession({
    secret: 'Tecky Academy teaches typescript',
    resave: true,
    saveUninitialized: true
});

//http server and socketIO
// const server = new http.Server(app);
// const io = socketIO(server);

app.use(sessionMiddleware);

//socketIO session
// io.use((socket, next) => {
//     sessionMiddleware(socket.request, socket.request.res, next);
// });

// io.on('connection', function (socket) {
//     socket.request.session.socketId = socket.id;
//     socket.request.session.save();

//     socket.on("disconnect", () => {
//         socket.request.session.socketId = null;
//         socket.request.session.save();
//     });
// });


// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user: { id: number }, done) {
    done(null, user);
});

passport.deserializeUser(function (user: { id: number }, done) {
    done(null, user);
});

const LocalStrategy = passportLocal.Strategy;
passport.use(
    new LocalStrategy(async function (username: string, password: string, done) {
        try {
            const user = await userService.getUserWithUsername(username);
            if (!user) {
                return done(null, false, { message: "Incorrect username!" });
            }
            const match = await checkPassword(password, user.password);
            if (match) {
                return done(null, { id: user.id });
            } else {
                return done(null, false, { message: "Incorrect password!" });
            }
        } catch (err) {
            return done(null, false, { message: err.message });
        }
    })
);


// Routers And Services
import { UserService } from "./services/UserService";
import { UserRouter } from "./routers/UserRouter";
const userService = new UserService(knex);
const userRouter = new UserRouter(userService);
app.use("/users", userRouter.router());


// Start the server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Running express server on port ${PORT}`);
});

