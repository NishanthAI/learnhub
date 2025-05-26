import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { CourseCard } from "@/components/course-card";
import { ProgressBar } from "@/components/progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  CheckCircle, 
  Award, 
  Play, 
  Trophy,
  Calendar 
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: enrollments = [] } = useQuery({
    queryKey: ["/api/users", user?.id, "enrollments"],
    enabled: !!user?.id,
  });

  const { data: certificates = [] } = useQuery({
    queryKey: ["/api/users", user?.id, "certificates"],
    enabled: !!user?.id,
  });

  const activeEnrollments = enrollments.filter((e: any) => !e.completedAt);
  const completedEnrollments = enrollments.filter((e: any) => e.completedAt);

  const stats = [
    {
      title: "Enrolled Courses",
      value: enrollments.length,
      icon: BookOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Completed Courses",
      value: completedEnrollments.length,
      icon: CheckCircle,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Certificates Earned",
      value: certificates.length,
      icon: Award,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "lesson",
      title: 'Completed lesson "React Hooks" in Web Development',
      time: "2 days ago",
      icon: Play,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      id: 2,
      type: "quiz",
      title: 'Passed quiz "Python Basics" with 95% score',
      time: "1 week ago",
      icon: Trophy,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      id: 3,
      type: "certificate",
      title: "Earned certificate for UI/UX Design Fundamentals",
      time: "2 weeks ago",
      icon: Award,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your dashboard</h1>
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.firstName}!
        </h1>
        <p className="text-gray-600">Track your progress and continue your learning journey.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Learning */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Continue Learning</CardTitle>
        </CardHeader>
        <CardContent>
          {activeEnrollments.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No active courses</h3>
              <p className="text-gray-600 mb-4">Start learning by enrolling in a course.</p>
              <Button asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {activeEnrollments.map((enrollment: any) => (
                <div
                  key={enrollment.id}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={enrollment.course.imageUrl}
                    alt={enrollment.course.title}
                    className="w-16 h-10 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{enrollment.course.title}</h3>
                    <p className="text-sm text-gray-600">
                      Last accessed {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </p>
                    <ProgressBar
                      value={Math.floor(Math.random() * 70) + 10} // Mock progress
                      className="mt-2"
                    />
                  </div>
                  <Button asChild>
                    <Link href={`/course/${enrollment.courseId}/content`}>
                      Continue
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Completed Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Completed Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {completedEnrollments.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No completed courses yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedEnrollments.map((enrollment: any) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <img
                      src={enrollment.course.imageUrl}
                      alt={enrollment.course.title}
                      className="w-16 h-10 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{enrollment.course.title}</h3>
                      <p className="text-sm text-gray-600">
                        Completed on {new Date(enrollment.completedAt).toLocaleDateString()}
                      </p>
                      <div className="flex items-center mt-2">
                        <Badge variant="secondary">Completed</Badge>
                        <Award className="h-4 w-4 text-accent ml-2" />
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Certificate
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 ${activity.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
