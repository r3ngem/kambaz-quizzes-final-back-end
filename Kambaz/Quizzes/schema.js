import mongoose from "mongoose";

// Question schema supporting multiple question types
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
  // For multiple-choice
  choices: [{
    text: { type: String },
    isCorrect: { type: Boolean, default: false }
  }],
  // For true-false
  correctAnswer: { type: mongoose.Schema.Types.Mixed },
  // For fill-in-blank
  possibleAnswers: [{ type: String }]
}, { _id: false });

const quizSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true, default: "Unnamed Quiz" },
  description: { type: String, default: "" },
  courseId: { type: String, required: true },
  creatorId: { type: String, required: true },
  
  // Quiz settings
  type: { 
    type: String, 
    enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"], 
    default: "Graded Quiz" 
  },
  points: { type: Number, default: 0 },
  assignmentGroup: { 
    type: String,
    enum: ["Quizzes", "Exams", "Assignments", "Project"],
    default: "Quizzes" 
  },
  
  // Options
  shuffleAnswers: { type: Boolean, default: true },
  timeLimitMinutes: { type: Number, default: 20 },
  multipleAttempts: { type: Boolean, default: false },
  howManyAttempts: { type: Number, default: 1 },
  showCorrectAnswers: { type: String, default: "" },
  accessCode: { type: String, default: "" },
  oneQuestionAtATime: { type: Boolean, default: true },
  webcamRequired: { type: Boolean, default: false },
  lockQuestionsAfterAnswering: { type: Boolean, default: false },
  
  // Dates
  dueDate: { type: String, default: "" },
  availableDate: { type: String, default: "" },
  untilDate: { type: String, default: "" },
  
  // Status
  published: { type: Boolean, default: false },
  
  // Questions embedded in quiz
  questions: [questionSchema]
}, {
  collection: "quizzes"
});

export default quizSchema;
