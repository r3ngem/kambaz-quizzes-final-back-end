import mongoose from "mongoose";

// Question sub-schema to support multiple question types
const questionSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, default: "New Question" },
  type: { 
    type: String, 
    enum: ["multiple-choice", "true-false", "fill-blank"], 
    default: "multiple-choice" 
  },
  question: { type: String, default: "" },
  points: { type: Number, default: 1 },
  // For multiple-choice questions
  choices: [{
    text: { type: String },
    isCorrect: { type: Boolean, default: false }
  }],
  // For true-false questions
  correctAnswer: { type: Boolean },
  // For fill-in-the-blank questions
  possibleAnswers: [{ type: String }]
}, { _id: false });

const quizSchema = new mongoose.Schema({
  _id: { type: String, required: true }, 
  title: { type: String, required: true, default: "New Quiz" },
  description: { type: String, default: "" },
  courseId: { type: String, required: true }, 
  creatorId: { type: String, required: true }, 
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
  showCorrectAnswers: { type: String, default: "" },
  accessCode: { type: String, default: "" },
  oneQuestionAtATime: { type: Boolean, default: true },
  webcamRequired: { type: Boolean, default: false },
  lockQuestionsAfterAnswering: { type: Boolean, default: false },
  dueDate: { type: String },
  availableDate: { type: String },
  untilDate: { type: String },
  published: { type: Boolean, default: false },
  questions: [questionSchema]
}, {
  collection: "quizzes"
});

export default quizSchema;
