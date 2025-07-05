"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Clock,
  DollarSign,
  Star,
  MessageCircle,
  ExternalLink,
  Briefcase,
  Award,
  Calendar,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FreelancerProfile {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
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
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function FreelancerProfilePage() {
  const params = useParams();
  const freelancerId = params?.freelancerId as string;
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/freelancer/profile/${freelancerId}`);
        if (response.ok) {
          const data = await response.json();
          setProfile(data.profile);
        } else {
          setError("Profile not found");
        }
      } catch (error) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (freelancerId) {
      fetchProfile();
    }
  }, [freelancerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Profile Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            {error || "This freelancer profile could not be found."}
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const initials = `${profile.firstName?.[0] || ""}${
    profile.lastName?.[0] || ""
  }`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.profilePicture} alt={fullName} />
                <AvatarFallback className="text-2xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {fullName}
                </h1>
                <p className="text-gray-600 mb-3">{profile.bio}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  {profile.availability.timezone && (
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{profile.availability.timezone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>
                      {profile.availability.workingHours.start &&
                      profile.availability.workingHours.end
                        ? `${profile.availability.workingHours.start} - ${profile.availability.workingHours.end}`
                        : "Available"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={16} />
                    <span>₹{profile.hourlyRate}/hour</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button className="flex items-center gap-2">
                  <MessageCircle size={16} />
                  Contact
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Star size={16} />
                  Hire
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase size={20} />
                  Skills & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {profile.expertise && profile.expertise.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Areas of Expertise
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.expertise.map((exp, index) => (
                          <Badge key={index} variant="outline">
                            {exp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Section */}
            {profile.portfolio && profile.portfolio.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award size={20} />
                    Portfolio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.portfolio.map((item, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        {item.image && (
                          <div className="mb-3">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-32 object-cover rounded-md"
                            />
                          </div>
                        )}
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <ExternalLink size={14} />
                            View Project
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Availability Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={20} />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge
                      variant={
                        profile.availability.isAvailable
                          ? "default"
                          : "secondary"
                      }
                    >
                      {profile.availability.isAvailable
                        ? "Available"
                        : "Unavailable"}
                    </Badge>
                  </div>

                  {profile.availability.workingHours.start &&
                    profile.availability.workingHours.end && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Working Hours</span>
                        <span className="text-sm">
                          {profile.availability.workingHours.start} -{" "}
                          {profile.availability.workingHours.end}
                        </span>
                      </div>
                    )}

                  {profile.availability.timezone && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Timezone</span>
                      <span className="text-sm">
                        {profile.availability.timezone}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pricing Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign size={20} />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    ₹{profile.hourlyRate}
                  </div>
                  <div className="text-gray-600">per hour</div>
                </div>
              </CardContent>
            </Card>

            {/* Member Since */}
            <Card>
              <CardHeader>
                <CardTitle>Member Since</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {new Date(profile.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
