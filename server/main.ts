
// dotenv
import * as dotenv from "dotenv";
dotenv.config();

// Express
import * as express from "express";
const app = express();
const PORT = 8080;

// Multer
import * as multer from 'multer';

// AWS
import * as aws from "aws-sdk";
import * as multerS3 from "multer-s3";

// middleware
import { isLoggedIn } from "./passport";
// Body Parser
import * as bodyParser from "body-parser";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Knex
import * as Knex from "knex";
const knexConfig = require('./knexfile');
const knex = Knex(knexConfig[process.env.NODE_ENV || "development"]);

// MongoDB
import { MongoClient } from "mongodb";
const mongoClient = new MongoClient(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const mongodb = (async () => {
    await mongoClient.connect();
    return mongoClient.db(process.env.MONGO_DB_NAME);
})();

// Cors
import * as cors from "cors";
app.use(cors());

// image file
import * as path from 'path'
app.use('/uploads/images/challenge', express.static(path.join(__dirname, 'uploads/', 'image/', 'challenge/')));

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


let uploadChallengeImage;
const problemImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/uploads/image/challenge/`);
    },
    filename: function (req, file, cb) {
        const problem = JSON.parse(req["body"].problem)
        cb(null, `${problem.pid}.${file.mimetype.split('/')[1]}`);
    }
})

if (process.env.NODE_ENV === "production") {
    const s3 = new aws.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });
    uploadChallengeImage = multer({
        storage: multerS3({
            s3: s3,
            bucket: 'cdn.blockdojo.xyz',
            metadata: (req, file, cb) => {
                cb(null, { fieldName: file.fieldname });
            },
            key: (req, file, cb) => {
                const problem = JSON.parse(req["body"].problem)
                cb(null, `${problem.pid}.${file.mimetype.split('/')[1]}`);
            }
        })
    })
} else {
    const problemImageStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `${__dirname}/uploads/image/challenge/`);
        },
        filename: function (req, file, cb) {
            const problem = JSON.parse(req["body"].problem)
            cb(null, `${problem.pid}.${file.mimetype.split('/')[1]}`);
        }
    })
    uploadChallengeImage = multer({ storage: problemImageStorage })
}

import ProblemService from "./services/ProblemService";
import ProblemRouter from "./routers/ProblemRouter";

export const problemService = new ProblemService(knex, mongodb, userService);
const problemRouter = new ProblemRouter(problemService, userService, uploadChallengeImage);
app.use("/problem", problemRouter.router());

import ProgressService from "./services/ProgressService";
import ProgressRouter from "./routers/ProgressRouter";

export const progressService = new ProgressService(knex);
const progressRouter = new ProgressRouter(progressService);
app.use("/progress", progressRouter.router());

import AuditService from "./services/AuditService";
import AuditRouter from "./routers/AuditRouter";

export const auditService = new AuditService(knex, mongodb);
const auditRouter = new AuditRouter(auditService, problemService, uploadChallengeImage);
app.use("/audit", isLoggedIn, auditRouter.router());

// run server
app.listen(PORT, () => {
    console.log("Running express server on port " + PORT);
});

