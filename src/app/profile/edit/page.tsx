"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import FreelancerProfileForm from "@/components/FreelancerProfileForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login/freelancer");
      return;
    }

    if (session.user.role !== "freelancer") {
      router.push("/dashboard/client");
      return;
    }

    // Check if profile exists
    const checkProfileStatus = async () => {
      try {
        const response = await fetch("/api/freelancer/profile/status");
        if (response.ok) {
          const data = await response.json();
          if (!data.isProfileComplete) {
            router.push("/profile/create");
            return;
          }
        }
      } catch (error) {
        console.error("Error checking profile status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkProfileStatus();
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-4xl w-full p-6">
          <Skeleton className="h-8 w-64 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Your Profile
          </h1>
          <p className="text-gray-600">
            Update your freelancer profile information
          </p>
        </div>
        <FreelancerProfileForm isEditing={true} />
      </div>
    </div>
  );
}

