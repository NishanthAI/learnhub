import { 
  users, courses, lessons, quizzes, enrollments, lessonProgress, quizResults, certificates,
  type User, type InsertUser, type Course, type InsertCourse, 
  type Lesson, type InsertLesson, type Quiz, type InsertQuiz,
  type Enrollment, type InsertEnrollment, type LessonProgress, type InsertLessonProgress,
  type QuizResult, type InsertQuizResult, type Certificate
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Course methods
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;

  // Lesson methods
  getLessonsByCourse(courseId: number): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  // Quiz methods
  getQuizByLesson(lessonId: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;

  // Enrollment methods
  getUserEnrollments(userId: number): Promise<(Enrollment & { course: Course })[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  isUserEnrolled(userId: number, courseId: number): Promise<boolean>;
  completeEnrollment(userId: number, courseId: number): Promise<void>;

  // Progress methods
  getUserLessonProgress(userId: number, lessonId: number): Promise<LessonProgress | undefined>;
  updateLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress>;
  getCourseProgress(userId: number, courseId: number): Promise<{ completed: number; total: number }>;

  // Quiz results
  saveQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  getQuizResult(userId: number, quizId: number): Promise<QuizResult | undefined>;

  // Certificates
  getUserCertificates(userId: number): Promise<(Certificate & { course: Course })[]>;
  createCertificate(userId: number, courseId: number): Promise<Certificate>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private courses: Map<number, Course> = new Map();
  private lessons: Map<number, Lesson> = new Map();
  private quizzes: Map<number, Quiz> = new Map();
  private enrollments: Map<number, Enrollment> = new Map();
  private lessonProgress: Map<number, LessonProgress> = new Map();
  private quizResults: Map<number, QuizResult> = new Map();
  private certificates: Map<number, Certificate> = new Map();
  
  private currentUserId = 1;
  private currentCourseId = 1;
  private currentLessonId = 1;
  private currentQuizId = 1;
  private currentEnrollmentId = 1;
  private currentProgressId = 1;
  private currentQuizResultId = 1;
  private currentCertificateId = 1;

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create sample courses
    const course1: Course = {
      id: this.currentCourseId++,
      title: "Complete Web Development Bootcamp",
      description: "Learn HTML, CSS, JavaScript, React, and Node.js from scratch to build modern web applications.",
      instructor: "John Smith",
      price: 99,
      rating: 48, // 4.8 * 10
      studentCount: 1234,
      category: "Web Development",
      level: "Beginner",
      duration: "12 hours",
      lessonCount: 48,
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      createdAt: new Date(),
    };

    const course2: Course = {
      id: this.currentCourseId++,
      title: "Python for Data Science",
      description: "Master Python programming for data analysis, visualization, and machine learning applications.",
      instructor: "Sarah Johnson",
      price: 79,
      rating: 49, // 4.9 * 10
      studentCount: 856,
      category: "Data Science",
      level: "Intermediate",
      duration: "16 hours",
      lessonCount: 62,
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      createdAt: new Date(),
    };

    const course3: Course = {
      id: this.currentCourseId++,
      title: "UI/UX Design Fundamentals",
      description: "Learn user interface and user experience design principles to create beautiful, functional designs.",
      instructor: "Mike Chen",
      price: 69,
      rating: 47, // 4.7 * 10
      studentCount: 189,
      category: "Design",
      level: "Beginner",
      duration: "14 hours",
      lessonCount: 36,
      imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      createdAt: new Date(),
    };

    this.courses.set(course1.id, course1);
    this.courses.set(course2.id, course2);
    this.courses.set(course3.id, course3);

    // Create sample lessons for course 1
    const lessons = [
      {
        id: this.currentLessonId++,
        courseId: course1.id,
        title: "Introduction to HTML",
        description: "Learn the basics of HTML structure and elements",
        videoUrl: "dQw4w9WgXcQ", // Sample YouTube video ID
        duration: "12:34",
        orderIndex: 1,
        moduleTitle: "Module 1: HTML Basics",
        createdAt: new Date(),
      },
      {
        id: this.currentLessonId++,
        courseId: course1.id,
        title: "HTML Structure & Tags",
        description: "Understanding HTML document structure",
        videoUrl: "dQw4w9WgXcQ",
        duration: "15:22",
        orderIndex: 2,
        moduleTitle: "Module 1: HTML Basics",
        createdAt: new Date(),
      },
      {
        id: this.currentLessonId++,
        courseId: course1.id,
        title: "CSS Fundamentals",
        description: "Introduction to CSS styling",
        videoUrl: "dQw4w9WgXcQ",
        duration: "18:45",
        orderIndex: 3,
        moduleTitle: "Module 2: CSS Styling",
        createdAt: new Date(),
      },
    ];

    lessons.forEach(lesson => this.lessons.set(lesson.id, lesson));

    // Create sample quiz
    const quiz: Quiz = {
      id: this.currentQuizId++,
      lessonId: lessons[0].id,
      title: "HTML Basics Quiz",
      questions: [
        {
          question: "What does HTML stand for?",
          options: [
            "Home Tool Markup Language",
            "HyperText Markup Language",
            "Hyperlinks and Text Markup Language",
            "None of the above"
          ],
          correctAnswer: 1
        },
        {
          question: "Which HTML element is used for the largest heading?",
          options: ["<h6>", "<h1>", "<header>", "<heading>"],
          correctAnswer: 1
        }
      ],
      createdAt: new Date(),
    };

    this.quizzes.set(quiz.id, quiz);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Course methods
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const course: Course = {
      ...insertCourse,
      id: this.currentCourseId++,
      createdAt: new Date(),
    };
    this.courses.set(course.id, course);
    return course;
  }

  // Lesson methods
  async getLessonsByCourse(courseId: number): Promise<Lesson[]> {
    return Array.from(this.lessons.values())
      .filter(lesson => lesson.courseId === courseId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async getLesson(id: number): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const lesson: Lesson = {
      ...insertLesson,
      id: this.currentLessonId++,
      createdAt: new Date(),
    };
    this.lessons.set(lesson.id, lesson);
    return lesson;
  }

  // Quiz methods
  async getQuizByLesson(lessonId: number): Promise<Quiz | undefined> {
    return Array.from(this.quizzes.values()).find(quiz => quiz.lessonId === lessonId);
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const quiz: Quiz = {
      ...insertQuiz,
      id: this.currentQuizId++,
      createdAt: new Date(),
    };
    this.quizzes.set(quiz.id, quiz);
    return quiz;
  }

  // Enrollment methods
  async getUserEnrollments(userId: number): Promise<(Enrollment & { course: Course })[]> {
    const userEnrollments = Array.from(this.enrollments.values())
      .filter(enrollment => enrollment.userId === userId);
    
    return userEnrollments.map(enrollment => {
      const course = this.courses.get(enrollment.courseId);
      return { ...enrollment, course: course! };
    });
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const enrollment: Enrollment = {
      ...insertEnrollment,
      id: this.currentEnrollmentId++,
      enrolledAt: new Date(),
      completedAt: null,
    };
    this.enrollments.set(enrollment.id, enrollment);
    return enrollment;
  }

  async isUserEnrolled(userId: number, courseId: number): Promise<boolean> {
    return Array.from(this.enrollments.values())
      .some(enrollment => enrollment.userId === userId && enrollment.courseId === courseId);
  }

  async completeEnrollment(userId: number, courseId: number): Promise<void> {
    const enrollment = Array.from(this.enrollments.values())
      .find(e => e.userId === userId && e.courseId === courseId);
    
    if (enrollment) {
      enrollment.completedAt = new Date();
      this.enrollments.set(enrollment.id, enrollment);
    }
  }

  // Progress methods
  async getUserLessonProgress(userId: number, lessonId: number): Promise<LessonProgress | undefined> {
    return Array.from(this.lessonProgress.values())
      .find(progress => progress.userId === userId && progress.lessonId === lessonId);
  }

  async updateLessonProgress(insertProgress: InsertLessonProgress): Promise<LessonProgress> {
    const existing = await this.getUserLessonProgress(insertProgress.userId, insertProgress.lessonId);
    
    if (existing) {
      const updated = { ...existing, ...insertProgress, completedAt: insertProgress.completed ? new Date() : null };
      this.lessonProgress.set(existing.id, updated);
      return updated;
    } else {
      const progress: LessonProgress = {
        ...insertProgress,
        id: this.currentProgressId++,
        completedAt: insertProgress.completed ? new Date() : null,
      };
      this.lessonProgress.set(progress.id, progress);
      return progress;
    }
  }

  async getCourseProgress(userId: number, courseId: number): Promise<{ completed: number; total: number }> {
    const lessons = await this.getLessonsByCourse(courseId);
    const completed = lessons.filter(async lesson => {
      const progress = await this.getUserLessonProgress(userId, lesson.id);
      return progress?.completed;
    }).length;
    
    return { completed, total: lessons.length };
  }

  // Quiz results
  async saveQuizResult(insertResult: InsertQuizResult): Promise<QuizResult> {
    const result: QuizResult = {
      ...insertResult,
      id: this.currentQuizResultId++,
      completedAt: new Date(),
    };
    this.quizResults.set(result.id, result);
    return result;
  }

  async getQuizResult(userId: number, quizId: number): Promise<QuizResult | undefined> {
    return Array.from(this.quizResults.values())
      .find(result => result.userId === userId && result.quizId === quizId);
  }

  // Certificates
  async getUserCertificates(userId: number): Promise<(Certificate & { course: Course })[]> {
    const userCertificates = Array.from(this.certificates.values())
      .filter(cert => cert.userId === userId);
    
    return userCertificates.map(cert => {
      const course = this.courses.get(cert.courseId);
      return { ...cert, course: course! };
    });
  }

  async createCertificate(userId: number, courseId: number): Promise<Certificate> {
    const certificate: Certificate = {
      id: this.currentCertificateId++,
      userId,
      courseId,
      issuedAt: new Date(),
    };
    this.certificates.set(certificate.id, certificate);
    return certificate;
  }
}

export const storage = new MemStorage();
