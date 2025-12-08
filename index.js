import express from 'express';
import mongoose from "mongoose";
import Hello from "./Hello.js"
import cors from "cors";
import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModulesRoutes from './Kambaz/Modules/routes.js';
import AssignmentsRoutes from './Kambaz/Assignments/routes.js';
import QuizRoutes from './Kambaz/Quizzes/routes.js';
import QuizAttemptRoutes from './Kambaz/Quizzes/Attempts/routes.js';
import "dotenv/config";
import session from "express-session";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb+srv://mehgp:Va05Beach@kambazfinalproject.hjyx6gm.mongodb.net/?appName=KambazFinalProject"
mongoose.connect(CONNECTION_STRING);

const app = express();

// CORS - configure ONCE before routes
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

// Session - configure ONCE
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.SERVER_ENV !== "development", // false for localhost, true for production
    httpOnly: true,
    sameSite: process.env.SERVER_ENV !== "development" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
};

if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie.domain = process.env.SERVER_URL;
}

app.use(session(sessionOptions));
app.use(express.json());  
UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
QuizRoutes(app);
QuizAttemptRoutes(app);
Hello(app);

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});