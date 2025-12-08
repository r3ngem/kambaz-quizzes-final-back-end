import model from "./model.js";

export default function QuizzesDao() {
  const findQuizzesByCourse = (courseId) =>
    model.find({ courseId });

  const createQuiz = (quiz) =>
    model.create({ ...quiz, published: false });

  const updateQuiz = (quizId, quiz) =>
    model.updateOne({ _id: quizId }, { $set: quiz });

  const deleteQuiz = (quizId) =>
    model.findByIdAndDelete(quizId);

  return {
    findQuizzesByCourse,
    createQuiz,
    updateQuiz,
    deleteQuiz,
  };
}