import model from "./model.js";

export default function QuizzesDao() {
  // Find all quizzes in a course
  const findQuizzesByCourse = (courseId) =>
    model.find({ courseId });

  // Find a quiz by ID
  const findQuizById = (quizId) =>
    model.findById(quizId);

  // Create a quiz
  const createQuiz = (quiz) =>
    model.create({ ...quiz, published: false });

  // Update quiz (partial update allowed)
  const updateQuiz = (quizId, quiz) =>
    model.findByIdAndUpdate(
      quizId,
      { $set: quiz },
      { new: true, runValidators: false }
    );

  // Delete a quiz
  const deleteQuiz = (quizId) =>
    model.findByIdAndDelete(quizId);

  return {
    findQuizzesByCourse,
    findQuizById,   
    createQuiz,
    updateQuiz,
    deleteQuiz,
  };
}
