import model from "./model.js";

export default function QuizzesDao() {
  // Find all quizzes in a course
  const findQuizzesByCourse = async (courseId) => {
    return await model.find({ courseId });
  };

  // Find a quiz by ID
  const findQuizById = async (quizId) => {
    return await model.findById(quizId);
  };

  // Create a quiz
  const createQuiz = async (quiz) => {
    // Use the provided _id or let MongoDB generate one
    const newQuiz = new model(quiz);
    return await newQuiz.save();
  };

  // Update quiz
  const updateQuiz = async (quizId, quizUpdates) => {
    return await model.findByIdAndUpdate(
      quizId,
      { $set: quizUpdates },
      { new: true, runValidators: false }
    );
  };

  // Delete a quiz
  const deleteQuiz = async (quizId) => {
    return await model.findByIdAndDelete(quizId);
  };

  return {
    findQuizzesByCourse,
    findQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
  };
}
