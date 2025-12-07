import express from "express";
import QuizzesDao from "./dao.js";
const dao = QuizzesDao();

export default function QuizRoutes(app) {
  app.get("/api/courses/:courseId/quizzes", async (req, res) => {
    const quizzes = await dao.findQuizzesByCourse(req.params.courseId);
    res.json(quizzes);
  });

  app.post("/api/courses/:courseId/quizzes", async (req, res) => {
    const quiz = await dao.createQuiz({ ...req.body, courseId: req.params.courseId });
    res.status(201).json(quiz);
  });

  app.put("/api/quizzes/:quizId", async (req, res) => {
    await dao.updateQuiz(req.params.quizId, req.body);
    res.json({ message: "Quiz updated" });
  });

  app.delete("/api/quizzes/:quizId", async (req, res) => {
    await dao.deleteQuiz(req.params.quizId);
    res.json({ message: "Quiz deleted" });
  });
}
