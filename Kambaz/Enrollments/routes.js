import EnrollmentsDao from "./dao.js";
import CoursesDao from "../Courses/dao.js";
import UsersDao from "../Users/dao.js";

export default function EnrollmentRoutes(app, db) {
  const enrollmentsDao = EnrollmentsDao(db);
  const coursesDao = CoursesDao(db);
  const usersDao = UsersDao();

  app.post("/api/enrollments/:courseId", async (req, res) => {
    try {
      const user = req.session.currentUser;
      if (!user) return res.status(401).json({ message: "Not logged in" });

      const courseId = req.params.courseId;

      if (user.enrolledCourses?.includes(courseId)) {
        return res.status(400).json({ message: "Already enrolled" });
      }

      await enrollmentsDao.enrollUserInCourse(user._id, courseId);

      user.enrolledCourses = [...(user.enrolledCourses || []), courseId];
      await usersDao.updateUser(user._id, { enrolledCourses: user.enrolledCourses });
      req.session.currentUser = user;

      res.json({ message: "Enrollment successful", enrolledCourses: user.enrolledCourses });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error during enrollment" });
    }
  });

  // Optional: fetch courses available for enrollment
  app.get("/api/enrollments/available", async (req, res) => {
    try {
      const allCourses = await coursesDao.findAllCourses();
      const user = req.session.currentUser;

      let availableCourses = allCourses;
      if (user?.enrolledCourses) {
        availableCourses = allCourses.filter(c => !user.enrolledCourses.includes(String(c._id)));
      }
      console.log("Session user:", user);
      console.log("All courses:", allCourses);
      console.log("Available courses:", availableCourses);
      res.json(availableCourses);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching available courses" });
    }
  });
}