import { NextResponse } from "next/server";
import QuizzesDao from "@/Kambaz/Quizzes/dao.js";

const dao = QuizzesDao();

// GET /api/courses/[courseId]/quizzes - Get all quizzes for a course
export async function GET(req, { params }) {
  const { courseId } = params;
  
  try {
    const quizzes = await dao.findQuizzesByCourse(courseId);
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST /api/courses/[courseId]/quizzes - Create a new quiz
export async function POST(req, { params }) {
  const { courseId } = params;
  const quiz = await req.json();
  
  try {
    // Make sure courseId is set
    const quizToCreate = {
      ...quiz,
      courseId: courseId,
    };
    
    const newQuiz = await dao.createQuiz(quizToCreate);
    return NextResponse.json(newQuiz, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
