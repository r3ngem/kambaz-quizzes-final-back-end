import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";
import QuizzesDao from "../Quizzes/dao.js";

export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);
  const quizzesDao = QuizzesDao();


  const createCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    const newCourse = await dao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.send(courses);
  };

  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const enrollments = await enrollmentsDao.findCoursesForUser(userId);
    res.json(enrollments);
  };

  const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
    const status = await dao.deleteCourse(courseId);
    res.send(status);
  };

  const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  };


  // GET /api/courses/:courseId/quizzes - Get all quizzes for a course
  const findQuizzesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const currentUser = req.session["currentUser"];
    
    try {
      let quizzes = await quizzesDao.findQuizzesByCourse(courseId);
      
      // If student, only show published quizzes
      if (currentUser?.role === "STUDENT") {
        quizzes = quizzes.filter(q => q.published);
      }
      
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  // POST /api/courses/:courseId/quizzes - Create a new quiz
  const createQuizForCourse = async (req, res) => {
    const { courseId } = req.params;
    const currentUser = req.session["currentUser"];
    const quiz = req.body;

    try {
      const quizToCreate = {
        ...quiz,
        courseId: courseId,
        creatorId: currentUser?._id || "unknown",
        published: false,
        questions: quiz.questions || [],
      };

      const newQuiz = await quizzesDao.createQuiz(quizToCreate);
      res.status(201).json(newQuiz);
    } catch (error) {
      console.error("Error creating quiz:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };


  // Course routes
  app.get("/api/courses", findAllCourses);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.post("/api/users/current/courses", createCourse);
  app.put("/api/courses/:courseId", updateCourse);
  app.delete("/api/courses/:courseId", deleteCourse);

  // Quiz routes under courses
  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
  app.post("/api/courses/:courseId/quizzes", createQuizForCourse);
}
