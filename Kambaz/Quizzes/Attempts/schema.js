import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: { type: String, ref: "QuizModel", required: true },
    user: { type: String, ref: "UserModel", required: true },
    attemptNumber: { type: Number, required: true },
    maxAttempts: { type: Number, default: 1 },
    answers: [
      {
        question: { type: String, required: true },
        answer: mongoose.Schema.Types.Mixed, // Can be string, boolean, or array
        isCorrect: { type: Boolean, required: true },
        pointsEarned: { type: Number, required: true },
      }
    ],
    score: { type: Number, required: true },
    totalPoints: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { collection: "quiz_attempts" }
);

export default quizAttemptSchema;