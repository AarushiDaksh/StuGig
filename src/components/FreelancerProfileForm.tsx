"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Briefcase,
  Image,
  DollarSign,
} from "lucide-react";

interface ProfileData {
  firstName: string;
  lastName: string;
  profilePicture: string;
  bio: string;
  skills: string[];
  expertise: string[];
  portfolio: Array<{
    title: string;
    description: string;
    link: string;
    image: string;
  }>;
  hourlyRate: number;
  availability: {
    isAvailable: boolean;
    workingHours: {
      start: string;
      end: string;
    };
    timezone: string;
  };
}

const steps = [
  { id: 1, title: "Basic Info", icon: User },
  { id: 2, title: "Skills & Bio", icon: Briefcase },
  { id: 3, title: "Portfolio", icon: Image },
  { id: 4, title: "Rates & Availability", icon: DollarSign },
];

interface FreelancerProfileFormProps {
  isEditing?: boolean;
}

export default function FreelancerProfileForm({
  isEditing = false,
}: FreelancerProfileFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    profilePicture: "",
    bio: "",
    skills: [],
    expertise: [],
    portfolio: [{ title: "", description: "", link: "", image: "" }],
    hourlyRate: 0,
    availability: {
      isAvailable: true,
      workingHours: { start: "", end: "" },
      timezone: "",
    },
  });

  const [skillInput, setSkillInput] = useState("");
  const [expertiseInput, setExpertiseInput] = useState("");

  // Load existing profile data when editing
  useEffect(() => {
    if (isEditing) {
      const loadProfileData = async () => {
        try {
          const response = await fetch("/api/freelancer/profile");
          if (response.ok) {
            const data = await response.json();
            const profile = data.profile;

            setProfileData({
              firstName: profile.firstName || "",
              lastName: profile.lastName || "",
              profilePicture: profile.profilePicture || "",
              bio: profile.bio || "",
              skills: profile.skills || [],
              expertise: profile.expertise || [],
              portfolio:
                profile.portfolio && profile.portfolio.length > 0
                  ? profile.portfolio
                  : [{ title: "", description: "", link: "", image: "" }],
              hourlyRate: profile.hourlyRate || 0,
              availability: {
                isAvailable: profile.availability?.isAvailable ?? true,
                workingHours: {
                  start: profile.availability?.workingHours?.start || "",
                  end: profile.availability?.workingHours?.end || "",
                },
                timezone: profile.availability?.timezone || "",
              },
            });
          }
        } catch (error) {
          console.error("Error loading profile data:", error);
        } finally {
          setInitialLoading(false);
        }
      };

      loadProfileData();
    }
  }, [isEditing]);

  // Add skill
  const addSkill = () => {
    if (skillInput.trim() && !profileData.skills.includes(skillInput.trim())) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  // Remove skill
  const removeSkill = (skillToRemove: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // Add expertise
  const addExpertise = () => {
    if (
      expertiseInput.trim() &&
      !profileData.expertise.includes(expertiseInput.trim())
    ) {
      setProfileData((prev) => ({
        ...prev,
        expertise: [...prev.expertise, expertiseInput.trim()],
      }));
      setExpertiseInput("");
    }
  };

  // Remove expertise
  const removeExpertise = (expertiseToRemove: string) => {
    setProfileData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((exp) => exp !== expertiseToRemove),
    }));
  };

  // Add portfolio item
  const addPortfolioItem = () => {
    setProfileData((prev) => ({
      ...prev,
      portfolio: [
        ...prev.portfolio,
        { title: "", description: "", link: "", image: "" },
      ],
    }));
  };

  // Remove portfolio item
  const removePortfolioItem = (index: number) => {
    setProfileData((prev) => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index),
    }));
  };

  // Update portfolio item
  const updatePortfolioItem = (index: number, field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      portfolio: prev.portfolio.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!profileData.firstName.trim())
          newErrors.firstName = "First name is required";
        if (!profileData.lastName.trim())
          newErrors.lastName = "Last name is required";
        break;
      case 2:
        if (!profileData.bio.trim()) newErrors.bio = "Bio is required";
        if (profileData.skills.length === 0)
          newErrors.skills = "At least one skill is required";
        break;
      case 3:
        // Portfolio is optional, no validation needed
        break;
      case 4:
        if (profileData.hourlyRate <= 0)
          newErrors.hourlyRate = "Hourly rate must be greater than 0";
        if (!profileData.availability.timezone)
          newErrors.timezone = "Timezone is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Next step
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  // Previous step
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit profile
  const submitProfile = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      const response = await fetch("/api/freelancer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        router.push("/dashboard/freelancer");
      } else {
        const error = await response.json();
        setErrors({ submit: error.error || "Failed to save profile" });
      }
    } catch (error) {
      setErrors({ submit: "Failed to save profile" });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while loading existing data
  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Profile...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-500"
                }`}
              >
                {currentStep > step.id ? (
                  <Check size={20} />
                ) : (
                  <step.icon size={20} />
                )}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="m-2">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    placeholder="Enter your first name"
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName" className="m-2">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    placeholder="Enter your last name"
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="profilePicture" className="m-2">
                  Profile Picture URL
                </Label>
                <Input
                  id="profilePicture"
                  value={profileData.profilePicture}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      profilePicture: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/your-photo.jpg"
                />
              </div>
            </div>
          )}

          {/* Step 2: Skills & Bio */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="bio" className="m-2">
                  Bio *
                </Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Tell clients about yourself, your experience, and what you can offer..."
                  rows={4}
                  className={errors.bio ? "border-red-500" : ""}
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                )}
              </div>

              <div>
                <Label htmlFor="skills" className="m-2">
                  Skills *
                </Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill (e.g., React, Design, Writing)"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSkill())
                    }
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    Add
                  </Button>
                </div>
                {errors.skills && (
                  <p className="text-red-500 text-sm mb-2">{errors.skills}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="expertise" className="m-2">
                  Areas of Expertise
                </Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    placeholder="Add expertise area (e.g., Web Development, UI/UX)"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addExpertise())
                    }
                  />
                  <Button
                    type="button"
                    onClick={addExpertise}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileData.expertise.map((exp, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {exp}
                      <button
                        onClick={() => removeExpertise(exp)}
                        className="text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Portfolio */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="portfolio" className="m-2">
                  Portfolio Items
                </Label>
                <Button
                  type="button"
                  onClick={addPortfolioItem}
                  variant="outline"
                >
                  Add Portfolio Item
                </Button>
              </div>

              {profileData.portfolio.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Portfolio Item {index + 1}</h4>
                    {profileData.portfolio.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removePortfolioItem(index)}
                        variant="outline"
                        size="sm"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="title" className="m-2">
                        Title
                      </Label>
                      <Input
                        value={item.title}
                        onChange={(e) =>
                          updatePortfolioItem(index, "title", e.target.value)
                        }
                        placeholder="Project title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="link" className="m-2">
                        Link
                      </Label>
                      <Input
                        value={item.link}
                        onChange={(e) =>
                          updatePortfolioItem(index, "link", e.target.value)
                        }
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description" className="m-2">
                      Description
                    </Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) =>
                        updatePortfolioItem(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Brief description of the project"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image" className="m-2">
                      Image URL
                    </Label>
                    <Input
                      value={item.image}
                      onChange={(e) =>
                        updatePortfolioItem(index, "image", e.target.value)
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 4: Rates & Availability */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="hourlyRate" className="m-2">
                  Hourly Rate (₹) *
                </Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={profileData.hourlyRate}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      hourlyRate: Number(e.target.value),
                    }))
                  }
                  placeholder="500"
                  className={errors.hourlyRate ? "border-red-500" : ""}
                />
                {errors.hourlyRate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.hourlyRate}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="timezone" className="m-2">
                  Timezone *
                </Label>
                <Input
                  id="timezone"
                  value={profileData.availability.timezone}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      availability: {
                        ...prev.availability,
                        timezone: e.target.value,
                      },
                    }))
                  }
                  placeholder="Asia/Kolkata"
                  className={errors.timezone ? "border-red-500" : ""}
                />
                {errors.timezone && (
                  <p className="text-red-500 text-sm mt-1">{errors.timezone}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime" className="m-2">
                    Working Hours Start
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={profileData.availability.workingHours.start}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        availability: {
                          ...prev.availability,
                          workingHours: {
                            ...prev.availability.workingHours,
                            start: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="endTime" className="m-2">
                    Working Hours End
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={profileData.availability.workingHours.end}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        availability: {
                          ...prev.availability,
                          workingHours: {
                            ...prev.availability.workingHours,
                            end: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              variant="outline"
            >
              <ChevronLeft size={16} className="mr-2" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button type="button" onClick={nextStep}>
                Next
                <ChevronRight size={16} className="ml-2" />
              </Button>
            ) : (
              <Button type="button" onClick={submitProfile} disabled={loading}>
                {loading
                  ? "Saving..."
                  : isEditing
                  ? "Update Profile"
                  : "Complete Profile"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
