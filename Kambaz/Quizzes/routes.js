import express from "express";
import QuizzesDao from "./dao.js";
const dao = QuizzesDao();

export default function QuizRoutes(app) {
  // Get all quizzes for a course
  app.get("/api/courses/:courseId/quizzes", async (req, res) => {
    const quizzes = await dao.findQuizzesByCourse(req.params.courseId);
    res.json(quizzes);
  });

  // Get a single quiz by ID - ADD THIS
  app.get("/api/quizzes/:quizId", async (req, res) => {
    try {
      const quiz = await dao.findQuizById(req.params.quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create a quiz
  app.post("/api/courses/:courseId/quizzes", async (req, res) => {
    const quiz = await dao.createQuiz({ ...req.body, courseId: req.params.courseId });
    res.status(201).json(quiz);
  });

  // Update a quiz
  app.put("/api/quizzes/:quizId", async (req, res) => {
    await dao.updateQuiz(req.params.quizId, req.body);
    res.json({ message: "Quiz updated" });
  });

  // Delete a quiz
  app.delete("/api/quizzes/:quizId", async (req, res) => {
    await dao.deleteQuiz(req.params.quizId);
    res.json({ message: "Quiz deleted" });
  });
}