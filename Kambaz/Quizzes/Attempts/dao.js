import QuizAttemptModel from "./model.js";

export function createQuizAttempt(attempt) {
  delete attempt._id;
  return QuizAttemptModel.create(attempt);
}

export function findQuizAttemptsByUser(userId, quizId) {
  return QuizAttemptModel.find({ user: userId, quiz: quizId }).sort({ attemptNumber: -1 });
}

export function findLatestAttempt(userId, quizId) {
  return QuizAttemptModel.findOne({ user: userId, quiz: quizId })
    .sort({ attemptNumber: -1 });
}

export function countUserAttempts(userId, quizId) {
  return QuizAttemptModel.countDocuments({ user: userId, quiz: quizId });
}

export function findAttemptById(attemptId) {
  return QuizAttemptModel.findById(attemptId);
}

export function findAllAttemptsForQuiz(quizId) {
  return QuizAttemptModel.find({ quiz: quizId })
    .populate("user", "username firstName lastName")
    .sort({ submittedAt: -1 });
}

export function deleteAttempt(attemptId) {
  return QuizAttemptModel.deleteOne({ _id: attemptId });
}