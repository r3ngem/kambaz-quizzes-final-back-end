import QuizzesDao from "./dao.js";

export default function QuizRoutes(app) {
  const dao = QuizzesDao();

  // ========================
  // Quiz Routes
  // ========================

  // GET /api/quizzes/:quizId - Get a specific quiz
  const findQuizById = async (req, res) => {
    const { quizId } = req.params;
    try {
      const quiz = await dao.findQuizById(quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  // PUT /api/quizzes/:quizId - Update a quiz
  const updateQuiz = async (req, res) => {
    const { quizId } = req.params;
    const quizUpdates = req.body;
    try {
      const updatedQuiz = await dao.updateQuiz(quizId, quizUpdates);
      if (!updatedQuiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(updatedQuiz);
    } catch (error) {
      console.error("Error updating quiz:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  // DELETE /api/quizzes/:quizId - Delete a quiz
  const deleteQuiz = async (req, res) => {
    const { quizId } = req.params;
    try {
      await dao.deleteQuiz(quizId);
      res.json({ message: "Quiz deleted" });
    } catch (error) {
      console.error("Error deleting quiz:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  // ========================
  // Question Routes
  // ========================

  // GET /api/quizzes/:quizId/questions - Get all questions for a quiz
  const findQuestionsForQuiz = async (req, res) => {
    const { quizId } = req.params;
    try {
      const quiz = await dao.findQuizById(quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(quiz.questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  // POST /api/quizzes/:quizId/questions - Add a question to a quiz
  const createQuestion = async (req, res) => {
    const { quizId } = req.params;
    const question = req.body;
    try {
      const quiz = await dao.findQuizById(quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      // Generate ID if not provided
      if (!question._id) {
        question._id = `q-${Date.now()}`;
      }

      // Add question to quiz
      const questions = quiz.questions || [];
      questions.push(question);

      // Update quiz with new questions
      const updatedQuiz = await dao.updateQuiz(quizId, { questions });
      res.status(201).json(question);
    } catch (error) {
      console.error("Error creating question:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  // PUT /api/quizzes/:quizId/questions/:questionId - Update a question
  const updateQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    const questionUpdates = req.body;
    try {
      const quiz = await dao.findQuizById(quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      const questionIndex = quiz.questions?.findIndex(q => q._id === questionId);
      if (questionIndex === -1 || questionIndex === undefined) {
        return res.status(404).json({ message: "Question not found" });
      }

      // Update the question
      quiz.questions[questionIndex] = { ...quiz.questions[questionIndex], ...questionUpdates };

      // Save updated quiz
      await dao.updateQuiz(quizId, { questions: quiz.questions });
      res.json(quiz.questions[questionIndex]);
    } catch (error) {
      console.error("Error updating question:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  // DELETE /api/quizzes/:quizId/questions/:questionId - Delete a question
  const deleteQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    try {
      const quiz = await dao.findQuizById(quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      // Filter out the question
      const updatedQuestions = quiz.questions?.filter(q => q._id !== questionId) || [];

      // Save updated quiz
      await dao.updateQuiz(quizId, { questions: updatedQuestions });
      res.json({ message: "Question deleted" });
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  // ========================
  // Register Routes
  // ========================

  // Quiz routes
  app.get("/api/quizzes/:quizId", findQuizById);
  app.put("/api/quizzes/:quizId", updateQuiz);
  app.delete("/api/quizzes/:quizId", deleteQuiz);

  // Question routes
  app.get("/api/quizzes/:quizId/questions", findQuestionsForQuiz);
  app.post("/api/quizzes/:quizId/questions", createQuestion);
  app.put("/api/quizzes/:quizId/questions/:questionId", updateQuestion);
  app.delete("/api/quizzes/:quizId/questions/:questionId", deleteQuestion);
}
