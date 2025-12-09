import { NextResponse } from "next/server";
import QuizzesDao from "@/server/dao/quizzesDao";

const dao = QuizzesDao();

export async function GET(req, { params }) {
  const { quizId } = params;
  const quiz = await dao.findQuizById(quizId);
  if (!quiz) return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
  return NextResponse.json(quiz);
}

export async function PUT(req, { params }) {
  const { quizId } = params;
  const body = await req.json();
  const updatedQuiz = await dao.updateQuiz(quizId, body);
  if (!updatedQuiz) return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
  return NextResponse.json(updatedQuiz); // <-- return updated quiz
}

export async function DELETE(req, { params }) {
  const { quizId } = params;
  await dao.deleteQuiz(quizId);
  return NextResponse.json({ message: "Quiz deleted" });
}
