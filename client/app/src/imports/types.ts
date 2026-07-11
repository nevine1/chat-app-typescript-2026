export interface UserData {
    name: string;
    email: string;
    bio: string;
    password: string;
    profilePic: File | string | null; // Can be a File object, a URL string, or null
}