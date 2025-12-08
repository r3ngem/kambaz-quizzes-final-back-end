import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // you can generate with uuid
  title: { type: String, required: true, default: "New Quiz" },
  courseId: { type: String, required: true }, // which course this quiz belongs to
  creatorId: { type: String, required: true }, // faculty who created it
  type: { 
    type: String, 
    enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"], 
    default: "Graded Quiz" 
  },
  points: { type: Number, default: 0 },
  assignmentGroup: { type: String, default: "Quizzes" },
  shuffleAnswers: { type: Boolean, default: true },
  timeLimitMinutes: { type: Number, default: 20 },
  multipleAttempts: { type: Boolean, default: false },
  howManyAttempts: { type: Number, default: 1 },
  showCorrectAnswers: { type: Boolean, default: false },
  accessCode: { type: String, default: "" },
  oneQuestionAtATime: { type: Boolean, default: true },
  webcamRequired: { type: Boolean, default: false },
  lockQuestionsAfterAnswering: { type: Boolean, default: false },
  dueDate: Date,
  availableDate: Date,
  untilDate: Date,
  published: { type: Boolean, default: false },
  questions: [{ 
    questionText: String,
    options: [String],
    correctAnswer: String,
    points: Number
  }]
}, {
  collection: "quizzes"
});

export default quizSchema;