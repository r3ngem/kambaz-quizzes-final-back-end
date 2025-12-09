import express from "express";
import QuizzesDao from "./dao.js";
import { v4 as uuidv4 } from 'uuid';

const dao = QuizzesDao();

export default function QuizRoutes(app) {
  app.get("/api/courses/:courseId/quizzes", async (req, res) => {
    const quizzes = await dao.findQuizzesByCourse(req.params.courseId);
    res.json(quizzes);
  });

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

  // Create a quiz - FIXED VERSION
  app.post("/api/courses/:courseId/quizzes", async (req, res) => {
    try {
      const quiz = await dao.createQuiz({ 
        _id: uuidv4(), // Generate unique ID
        ...req.body, 
        courseId: req.params.courseId,
        creatorId: req.session?.currentUser?._id || "default-creator" // Add creator
      });
      res.status(201).json(quiz);
    } catch (error) {
      console.error("Error creating quiz:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Update a quiz
  app.put("/api/quizzes/:quizId", async (req, res) => {
    try {
      await dao.updateQuiz(req.params.quizId, req.body);
      res.json({ message: "Quiz updated" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Delete a quiz
  app.delete("/api/quizzes/:quizId", async (req, res) => {
    try {
      await dao.deleteQuiz(req.params.quizId);
      res.json({ message: "Quiz deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
}