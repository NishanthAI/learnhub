import { useState } from "react";
import { Quiz as QuizType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface QuizProps {
  quiz: QuizType;
  onSubmit: (answers: number[], score: number) => void;
}

export function Quiz({ quiz, onSubmit }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = parseInt(value);
    setAnswers(newAnswers);
  };

  const goToNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResults(true);
    
    // Calculate score
    const correctAnswers = answers.filter((answer, index) => 
      answer === quiz.questions[index].correctAnswer
    ).length;
    
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    onSubmit(answers, score);
  };

  const question = quiz.questions[currentQuestion];
  const isAnswered = answers[currentQuestion] !== -1;
  const allAnswered = answers.every(answer => answer !== -1);

  if (showResults) {
    const correctAnswers = answers.filter((answer, index) => 
      answer === quiz.questions[index].correctAnswer
    ).length;
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold text-primary">
              {score}%
            </div>
            <p className="text-gray-600">
              You got {correctAnswers} out of {quiz.questions.length} questions correct.
            </p>
            <Badge variant={score >= 70 ? "default" : "destructive"} className="text-lg px-4 py-2">
              {score >= 70 ? "Passed!" : "Try Again"}
            </Badge>
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="font-semibold">Review:</h3>
            {quiz.questions.map((q, index) => (
              <div key={index} className="border rounded-lg p-4">
                <p className="font-medium mb-2">{q.question}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-600">
                    Your answer: {q.options[answers[index]] || "Not answered"}
                  </span>
                  {answers[index] === q.correctAnswer ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                {answers[index] !== q.correctAnswer && (
                  <p className="text-green-600 text-sm mt-1">
                    Correct answer: {q.options[q.correctAnswer]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{quiz.title}</CardTitle>
          <Badge variant="outline">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{question.question}</h3>
          
          <RadioGroup
            value={answers[currentQuestion] !== -1 ? answers[currentQuestion].toString() : ""}
            onValueChange={handleAnswerChange}
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={goToPrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={goToNext}
              disabled={currentQuestion === quiz.questions.length - 1 || !isAnswered}
            >
              Next
            </Button>
          </div>
          
          {currentQuestion === quiz.questions.length - 1 && (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || submitted}
            >
              {submitted ? "Submitted" : "Submit Quiz"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
