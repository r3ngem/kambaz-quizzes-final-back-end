import * as attemptsDao from "./dao.js";

export default function QuizAttemptRoutes(app) {
  
  // Submit a quiz attempt
  app.post("/api/quizzes/:quizId/attempts", async (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.status(401).json({ message: "Must be logged in to submit quiz" });
      return;
    }

    try {
      // Get current attempt count
      const attemptCount = await attemptsDao.countUserAttempts(currentUser._id, quizId);
      
      const attempt = {
        ...req.body,
        quiz: quizId,
        user: currentUser._id,
        attemptNumber: attemptCount + 1,
      };
      
      const newAttempt = await attemptsDao.createQuizAttempt(attempt);
      res.json(newAttempt);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get all attempts for a quiz by current user
  app.get("/api/quizzes/:quizId/attempts", async (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.status(401).json({ message: "Must be logged in" });
      return;
    }

    try {
      const attempts = await attemptsDao.findQuizAttemptsByUser(currentUser._id, quizId);
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get latest attempt for a quiz by current user
  app.get("/api/quizzes/:quizId/attempts/latest", async (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.status(401).json({ message: "Must be logged in" });
      return;
    }

    try {
      const attempt = await attemptsDao.findLatestAttempt(currentUser._id, quizId);
      res.json(attempt);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get attempt count for current user
  app.get("/api/quizzes/:quizId/attempts/count", async (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.status(401).json({ message: "Must be logged in" });
      return;
    }

    try {
      const count = await attemptsDao.countUserAttempts(currentUser._id, quizId);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get all attempts for a quiz (faculty only)
  app.get("/api/quizzes/:quizId/attempts/all", async (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser || currentUser.role !== "FACULTY") {
      res.status(403).json({ message: "Only faculty can view all attempts" });
      return;
    }

    try {
      const attempts = await attemptsDao.findAllAttemptsForQuiz(quizId);
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get specific attempt by ID
  app.get("/api/attempts/:attemptId", async (req, res) => {
    const { attemptId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.status(401).json({ message: "Must be logged in" });
      return;
    }

    try {
      const attempt = await attemptsDao.findAttemptById(attemptId);
      
      // Only allow user to see their own attempt, or faculty to see any attempt
      if (attempt.user !== currentUser._id && currentUser.role !== "FACULTY") {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }
      
      res.json(attempt);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Delete attempt (faculty only)
  app.delete("/api/attempts/:attemptId", async (req, res) => {
    const { attemptId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser || currentUser.role !== "FACULTY") {
      res.status(403).json({ message: "Only faculty can delete attempts" });
      return;
    }

    try {
      await attemptsDao.deleteAttempt(attemptId);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
}