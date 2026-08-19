export interface UserData {
    name: string;
    email: string;
    bio: string;
    password: string;
    profilePic: File | string | null; // Can be a File object, a URL string, or null
}

export interface LoginInfo {
    email: string;
    password: string;
}

export interface UsersList {
    users: UserData[];
}

export interface Message {
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: Date;
}