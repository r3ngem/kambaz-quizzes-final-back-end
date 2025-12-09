import { NextResponse } from "next/server";
import QuizzesDao from "@/Kambaz/Quizzes/dao.js";

const dao = QuizzesDao();

// GET /api/quizzes/[quizId]/questions - Get all questions for a quiz
export async function GET(req, { params }) {
  const { quizId } = params;
  
  try {
    const quiz = await dao.findQuizById(quizId);
    
    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }
    
    // Return the questions array from the quiz
    return NextResponse.json(quiz.questions || []);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST /api/quizzes/[quizId]/questions - Add a new question to a quiz
export async function POST(req, { params }) {
  const { quizId } = params;
  const question = await req.json();
  
  try {
    const quiz = await dao.findQuizById(quizId);
    
    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }
    
    // Generate an ID for the new question if not provided
    if (!question._id) {
      question._id = `q-${Date.now()}`;
    }
    
    // Add question to quiz
    quiz.questions = quiz.questions || [];
    quiz.questions.push(question);
    
    // Update the quiz
    const updatedQuiz = await dao.updateQuiz(quizId, { questions: quiz.questions });
    
    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
