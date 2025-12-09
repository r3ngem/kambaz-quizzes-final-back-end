import model from "./model.js";

export default function QuizzesDao() {
  const findQuizzesByCourse = (quizId, quiz) =>
    model.findByIdAndUpdate(
      quizId,
      { $set: quiz },
      { new: true, runValidators: false }
    );

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