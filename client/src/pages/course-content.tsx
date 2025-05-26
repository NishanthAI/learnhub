import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useParams } from "wouter";
import { YouTubePlayer } from "@/components/youtube-player";
import { Quiz } from "@/components/quiz";
import { ProgressBar } from "@/components/progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Course, Lesson, Quiz as QuizType } from "@shared/schema";
import { 
  Play, 
  CheckCircle, 
  FileText, 
  Download, 
  Code,
  BookOpen,
  Trophy
} from "lucide-react";

export default function CourseContent() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const { data: course } = useQuery<Course>({
    queryKey: ["/api/courses", courseId],
    enabled: !!courseId,
  });

  const { data: lessons = [] } = useQuery<Lesson[]>({
    queryKey: ["/api/courses", courseId, "lessons"],
    enabled: !!courseId,
  });

  const selectedLesson = lessons.find(lesson => lesson.id === selectedLessonId) || lessons[0];

  const { data: quiz } = useQuery<QuizType>({
    queryKey: ["/api/lessons", selectedLesson?.id, "quiz"],
    enabled: !!selectedLesson?.id,
  });

  const markLessonComplete = useMutation({
    mutationFn: async (lessonId: number) => {
      return apiRequest("POST", "/api/progress/lesson", {
        userId: user!.id,
        lessonId,
        completed: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      toast({
        title: "Progress Updated",
        description: "Lesson marked as complete!",
      });
    },
  });

  const submitQuizMutation = useMutation({
    mutationFn: async ({ answers, score }: { answers: number[]; score: number }) => {
      return apiRequest("POST", "/api/quiz/submit", {
        userId: user!.id,
        quizId: quiz!.id,
        score,
        totalQuestions: quiz!.questions.length,
        answers,
      });
    },
    onSuccess: (_, { score }) => {
      toast({
        title: "Quiz Submitted",
        description: `You scored ${score}%!`,
      });
      setShowQuiz(false);
    },
  });

  const handleVideoEnd = () => {
    if (selectedLesson && user) {
      markLessonComplete.mutate(selectedLesson.id);
    }
  };

  const handleQuizSubmit = (answers: number[], score: number) => {
    submitQuizMutation.mutate({ answers, score });
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLessonId(lesson.id);
    setShowQuiz(false);
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  // Group lessons by module
  const modules = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.moduleTitle]) {
      acc[lesson.moduleTitle] = [];
    }
    acc[lesson.moduleTitle].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  if (!course || !selectedLesson) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="bg-gray-200 rounded-lg h-96"></div>
            <div className="lg:col-span-3 bg-gray-200 rounded-lg h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Course Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <ProgressBar
                value={Math.floor(Math.random() * 70) + 10} // Mock progress
                label="Progress"
              />
            </CardHeader>
            
            <CardContent className="p-4">
              <nav className="space-y-2">
                {Object.entries(modules).map(([moduleTitle, moduleLessons]) => (
                  <div key={moduleTitle}>
                    <h4 className="font-medium text-gray-900 mb-2 text-sm">
                      {moduleTitle}
                    </h4>
                    <ul className="space-y-1 ml-4 mb-4">
                      {moduleLessons.map((lesson) => (
                        <li key={lesson.id}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLessonSelect(lesson)}
                            className={`w-full justify-start text-sm p-2 h-auto ${
                              selectedLesson.id === lesson.id 
                                ? "text-primary bg-primary/10" 
                                : "text-gray-700"
                            }`}
                          >
                            <Play className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{lesson.title}</span>
                            {Math.random() > 0.5 && (
                              <CheckCircle className="h-4 w-4 ml-auto text-secondary flex-shrink-0" />
                            )}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Video Player */}
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedLesson.title}
              </h1>
              
              <YouTubePlayer
                videoId={selectedLesson.videoUrl || ""}
                title={selectedLesson.title}
                onVideoEnd={handleVideoEnd}
              />
            </CardContent>
          </Card>

          {/* Lesson Content */}
          <Card>
            <CardHeader>
              <CardTitle>Lesson Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-4">
                  {selectedLesson.description || 
                    `In this lesson, you'll learn about ${selectedLesson.title.toLowerCase()}. 
                     We'll cover the fundamental concepts and provide practical examples to help you 
                     understand and apply what you've learned.`}
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What You'll Learn</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                  <li>Core concepts and principles</li>
                  <li>Practical implementation techniques</li>
                  <li>Best practices and common patterns</li>
                  <li>Real-world applications</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Resources</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="mr-2">
                    <FileText className="h-4 w-4 mr-2" />
                    Lesson Notes (PDF)
                  </Button>
                  <Button variant="outline" size="sm">
                    <Code className="h-4 w-4 mr-2" />
                    Practice Exercises
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Section */}
          {quiz && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Knowledge Check
                  </CardTitle>
                  {!showQuiz && (
                    <Button onClick={handleStartQuiz}>
                      Start Quiz
                    </Button>
                  )}
                </div>
              </CardHeader>
              {showQuiz ? (
                <CardContent>
                  <Quiz quiz={quiz} onSubmit={handleQuizSubmit} />
                </CardContent>
              ) : (
                <CardContent>
                  <p className="text-gray-600">
                    Test your understanding of {selectedLesson.title.toLowerCase()} with a quick quiz.
                  </p>
                  <div className="flex items-center mt-4 text-sm text-gray-500">
                    <span>{quiz.questions.length} questions</span>
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    <span>~5 minutes</span>
                  </div>
                </CardContent>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
