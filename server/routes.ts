import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertEnrollmentSchema, insertLessonProgressSchema, insertQuizResultSchema } from "@shared/schema";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Don't return password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Don't return password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updates = req.body;
      
      const user = await storage.updateUser(userId, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/courses/:id/lessons", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const lessons = await storage.getLessonsByCourse(courseId);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Enrollment routes
  app.get("/api/users/:userId/enrollments", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const enrollments = await storage.getUserEnrollments(userId);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/enrollments", async (req, res) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse(req.body);
      
      // Check if already enrolled
      const isEnrolled = await storage.isUserEnrolled(enrollmentData.userId, enrollmentData.courseId);
      if (isEnrolled) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }

      const enrollment = await storage.createEnrollment(enrollmentData);
      res.json(enrollment);
    } catch (error) {
      res.status(400).json({ message: "Invalid enrollment data" });
    }
  });

  app.get("/api/enrollments/check/:userId/:courseId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const courseId = parseInt(req.params.courseId);
      
      const isEnrolled = await storage.isUserEnrolled(userId, courseId);
      res.json({ isEnrolled });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Progress routes
  app.post("/api/progress/lesson", async (req, res) => {
    try {
      const progressData = insertLessonProgressSchema.parse(req.body);
      const progress = await storage.updateLessonProgress(progressData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress data" });
    }
  });

  app.get("/api/progress/course/:userId/:courseId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const courseId = parseInt(req.params.courseId);
      
      const progress = await storage.getCourseProgress(userId, courseId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Quiz routes
  app.get("/api/lessons/:lessonId/quiz", async (req, res) => {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const quiz = await storage.getQuizByLesson(lessonId);
      
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/quiz/submit", async (req, res) => {
    try {
      const resultData = insertQuizResultSchema.parse(req.body);
      const result = await storage.saveQuizResult(resultData);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid quiz result data" });
    }
  });

  // Certificate routes
  app.get("/api/users/:userId/certificates", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const certificates = await storage.getUserCertificates(userId);
      res.json(certificates);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/certificates", async (req, res) => {
    try {
      const { userId, courseId } = req.body;
      const certificate = await storage.createCertificate(userId, courseId);
      res.json(certificate);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
