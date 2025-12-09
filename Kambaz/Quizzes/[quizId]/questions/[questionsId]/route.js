import { NextResponse } from "next/server";
import QuizzesDao from "@/Kambaz/Quizzes/dao.js";

const dao = QuizzesDao();

// PUT /api/quizzes/[quizId]/questions/[questionId] - Update a question
export async function PUT(req, { params }) {
  const { quizId, questionId } = params;
  const updatedQuestion = await req.json();
  
  try {
    const quiz = await dao.findQuizById(quizId);
    
    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }
    
    // Find and update the question
    const questionIndex = quiz.questions?.findIndex(q => q._id === questionId);
    
    if (questionIndex === -1 || questionIndex === undefined) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 });
    }
    
    // Update the question
    quiz.questions[questionIndex] = { ...quiz.questions[questionIndex], ...updatedQuestion };
    
    // Save the updated quiz
    await dao.updateQuiz(quizId, { questions: quiz.questions });
    
    return NextResponse.json(quiz.questions[questionIndex]);
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE /api/quizzes/[quizId]/questions/[questionId] - Delete a question
export async function DELETE(req, { params }) {
  const { quizId, questionId } = params;
  
  try {
    const quiz = await dao.findQuizById(quizId);
    
    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }
    
    // Filter out the question to delete
    const updatedQuestions = quiz.questions?.filter(q => q._id !== questionId) || [];
    
    // Save the updated quiz
    await dao.updateQuiz(quizId, { questions: updatedQuestions });
    
    return NextResponse.json({ message: "Question deleted" });
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
