
// dotenv
import * as dotenv from "dotenv";
dotenv.config();

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

// MongoDB Client
import { mongoClient } from "./mongodb";

// Cors
import * as cors from "cors";
app.use(cors());

// Routers and Services
import UserService from "./services/UserService";
import UserRouter from "./routers/UserRouter";
export const userService = new UserService(knex);
const userRouter = new UserRouter(userService);
app.use("/user", userRouter.router());

import CategoryService from './services/CategoryService';
import CategoryRouter from './routers/CategoryRouter';
const categoryService = new CategoryService(knex);
const categoryRouter = new CategoryRouter(categoryService);
app.use("/category", categoryRouter.router());

import DifficultyService from './services/DifficultyService';
import DifficultyRouter from './routers/DifficultyRouter';
const difficultyService = new DifficultyService(knex);
const difficultyRouter = new DifficultyRouter(difficultyService);
app.use("/difficulty", difficultyRouter.router());


import ProblemService from "./services/ProblemService";
import ProblemRouter from "./routers/ProblemRouter";
export const problemService = new ProblemService(knex, mongoClient);
const problemRouter = new ProblemRouter(problemService);
app.use("/problem", problemRouter.router());

// run server
app.listen(PORT, () => {
    console.log("Running express server on port " + PORT);
});

