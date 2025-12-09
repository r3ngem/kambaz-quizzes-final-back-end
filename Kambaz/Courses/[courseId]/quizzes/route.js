import { NextResponse } from "next/server";
import QuizzesDao from "@/server/dao/quizzesDao";

const dao = QuizzesDao();

export async function GET(req, { params }) {
  const { courseId } = params;
  const quizzes = await dao.findQuizzesByCourse(courseId);
  return NextResponse.json(quizzes);
}

export async function POST(req, { params }) {
  const { courseId } = params;
  const body = await req.json();
  const quiz = await dao.createQuiz({ ...body, courseId });
  return NextResponse.json(quiz, { status: 201 });
}