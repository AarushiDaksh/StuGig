export interface UserType {
  _id?: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  portfolio?: {
    title: string;
    description: string;
    link?: string;
    image?: string;
  }[];
  occupation?: string;
  location?: string;
  isProfileComplete?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
