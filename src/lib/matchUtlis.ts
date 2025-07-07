export function calculateMatchScore(freelancer: any, job: any): number {
  let score = 0;

  // Skills match (50%)
  const skillMatchCount = Array.isArray(job.skills)
    ? freelancer.skills.filter((skill: string) => job.skills.includes(skill)).length
    : 0;

  score += (skillMatchCount / (job.skills?.length || 1)) * 50;

  // Hourly rate match (30%)
  const rateDifference = Math.abs(freelancer.hourlyRate - (job.budget || 0));
  score += Math.max(0, 30 - rateDifference * 0.3);

  // Random boost for diversity
  score += Math.random() * 20;

  return Math.min(score, 100); // Ensure max is 100
}
