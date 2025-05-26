import { Course } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Play, Users } from "lucide-react";

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: number) => void;
  enrolled?: boolean;
  showProgress?: boolean;
  progress?: number;
}

export function CourseCard({ 
  course, 
  onEnroll, 
  enrolled = false, 
  showProgress = false, 
  progress = 0 
}: CourseCardProps) {
  const rating = course.rating / 10; // Convert back from stored integer

  return (
    <Card className="card-hover overflow-hidden">
      <div className="relative">
        <img
          src={course.imageUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        {showProgress && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-white/90 text-gray-900">
              {progress}% Complete
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">{course.category}</Badge>
          <div className="flex items-center text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {rating.toFixed(1)} ({course.studentCount})
            </span>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 leading-tight">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600">By {course.instructor}</p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <Play className="h-4 w-4 mr-1" />
            <span>{course.lessonCount} lessons</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{course.level}</span>
          </div>
        </div>

        {showProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex items-center justify-between pt-0">
        <span className="text-2xl font-bold text-primary">
          ${course.price}
        </span>
        {onEnroll && (
          <Button
            onClick={() => onEnroll(course.id)}
            disabled={enrolled}
            variant={enrolled ? "secondary" : "default"}
          >
            {enrolled ? "Enrolled" : "Enroll Now"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
