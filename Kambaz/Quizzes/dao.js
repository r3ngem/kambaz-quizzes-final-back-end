import model from "./model.js";

export default function QuizzesDao() {
  // Find all quizzes for a specific course
  const findQuizzesByCourse = (courseId) =>
    model.find({ courseId });

  // Create a new quiz
  const createQuiz = (quiz) =>
    model.create({ ...quiz, published: false });

  // FIXED: Allow partial updates without triggering required-field errors
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
    createQuiz,
    updateQuiz,
    deleteQuiz,
  };
}
