
// Express
import * as express from "express";
const app = express();
const PORT = 8080;

// Body Parser
import * as bodyParser from "body-parser";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Knex
import * as Knex from "knex";
const knexConfig = require('./knexfile');
const knex = Knex(knexConfig[process.env.NODE_ENV || "development"]);

// Cors
import * as cors from "cors";
app.use(cors());

// catcher
export function catcher(routerFunction: (req: express.Request, res: express.Response) => Promise<void>) {
    return async (req: express.Request, res: express.Response) => {
        try {
            await routerFunction(req, res);
        } catch (err) {
            console.log(err.message);
            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: "No Response"
            });
        }
    };
}

// Routers and Services
import { isLoggedIn } from "./passport";
import UserService from "./services/UserService";
import UserRouter from "./routers/UserRouter";
export const userService = new UserService(knex);
const userRouter = new UserRouter(userService);
app.use("/user", userRouter.router());

import ProblemService from "./services/ProblemService";
import ProblemRouter from "./routers/ProblemRouter";
export const problemService = new ProblemService(knex);
const problemRouter = new ProblemRouter(problemService);
app.use("/problem", isLoggedIn, problemRouter.router());

// run server
app.listen(PORT, () => {
    console.log("Running express server on port " + PORT);
});

