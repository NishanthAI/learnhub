import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { CourseCard } from "@/components/course-card";
import { Button } from "@/components/ui/button";
import { Course } from "@shared/schema";
import { 
  Play, 
  IdCard, 
  Users, 
  TrendingUp, 
  Video, 
  ChartLine, 
  Award, 
  Smartphone, 
  UserCheck, 
  Infinity 
} from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    select: (data) => data.slice(0, 3), // Show only first 3 courses
  });

  const features = [
    {
      icon: Video,
      title: "HD Video Lessons",
      description: "High-quality video content with seamless streaming and offline access.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: ChartLine,
      title: "Progress Tracking",
      description: "Monitor your learning progress with detailed analytics and insights.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Award,
      title: "Certificates",
      description: "Earn certificates upon course completion to showcase your skills.",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Smartphone,
      title: "Mobile Learning",
      description: "Learn on the go with our fully responsive mobile platform.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: UserCheck,
      title: "Expert Instructors",
      description: "Learn from industry experts and experienced professionals.",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      icon: Infinity,
      title: "Lifetime Access",
      description: "Access your courses forever with free updates and new content.",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg hero-pattern text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Learn New Skills
                <br />
                <span className="text-yellow-300">Anytime, Anywhere</span>
              </h1>
              <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
                Join thousands of learners who are advancing their careers with our comprehensive online courses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/courses">
                    Browse Courses
                  </Link>
                </Button>
                {!isAuthenticated && (
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                    Get Started Free
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-12 lg:mt-0">
              <div className="bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 flex items-center justify-center">
                    <Play className="h-12 w-12 text-yellow-300" />
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 flex items-center justify-center">
                    <IdCard className="h-12 w-12 text-green-300" />
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-blue-300" />
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 flex items-center justify-center">
                    <TrendingUp className="h-12 w-12 text-pink-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose LearnHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform offers everything you need to succeed in your learning journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Popular Courses
            </h2>
            <p className="text-xl text-gray-600">
              Discover our most popular courses loved by thousands of students.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div key={course.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/courses">
                View All Courses
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
