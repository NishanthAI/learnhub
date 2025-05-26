import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Award, 
  Trophy, 
  Plus, 
  X, 
  Camera 
} from "lucide-react";

export default function Profile() {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    bio: user?.bio || "",
    learningGoals: user?.learningGoals || [],
  });
  const [newGoal, setNewGoal] = useState("");

  const { data: certificates = [] } = useQuery({
    queryKey: ["/api/users", user?.id, "certificates"],
    enabled: !!user?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/users/${user!.id}`, data);
      return response.json();
    },
    onSuccess: (updatedUser) => {
      login(updatedUser);
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id] });
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      bio: user?.bio || "",
      learningGoals: user?.learningGoals || [],
    });
    setIsEditing(false);
  };

  const addGoal = () => {
    if (newGoal.trim() && !formData.learningGoals.includes(newGoal.trim())) {
      setFormData({
        ...formData,
        learningGoals: [...formData.learningGoals, newGoal.trim()],
      });
      setNewGoal("");
    }
  };

  const removeGoal = (goalToRemove: string) => {
    setFormData({
      ...formData,
      learningGoals: formData.learningGoals.filter(goal => goal !== goalToRemove),
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to view your profile
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </CardHeader>
        
        <CardContent>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Profile Picture Section */}
            <div className="text-center">
              <div className="relative inline-block">
                <Avatar className="w-32 h-32">
                  <AvatarFallback className="bg-primary text-white text-4xl">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="link" className="mt-2">
                Change Photo
              </Button>
            </div>

            {/* Profile Form */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label>Learning Goals</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.learningGoals.map((goal, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {goal}
                        {isEditing && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeGoal(goal)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="Add a learning goal..."
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addGoal())}
                      />
                      <Button type="button" onClick={addGoal} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  {isEditing ? (
                    <>
                      <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={updateProfileMutation.isPending}>
                        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </>
                  ) : (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Achievements & Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
              <p className="text-gray-600">Complete a course to earn your first certificate!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {certificates.map((cert: any) => (
                <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Award className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{cert.course.title}</h3>
                      <p className="text-sm text-gray-600">
                        Completed {new Date(cert.issuedAt).toLocaleDateString()}
                      </p>
                      <Button variant="link" className="text-primary hover:text-indigo-700 text-sm font-medium mt-1 p-0">
                        View Certificate
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Achievement Badge */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Trophy className="h-8 w-8 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">First Course Completed</h3>
                    <p className="text-sm text-gray-600">Achievement unlocked!</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
