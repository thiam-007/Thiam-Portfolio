// Profile Types
export interface Profile {
    _id: string;
    name: string;
    title: string;
    bio: string;
    email: string;
    phone: string;
    location: string;
    profileImageUrl: string;
    typingTexts: string[];
    socialLinks: {
        linkedin?: string;
        github?: string;
        twitter?: string;
    };
    updatedAt: string;
}

// Experience Types
export interface Experience {
    _id: string;
    title: string;
    company: string;
    year: string;
    description: string;
    responsibilities: string[];
    tags: string[];
    order: number;
    isVisible: boolean;
    createdAt: string;
    updatedAt: string;
}

// Project Types
export interface Project {
    _id: string;
    title: string;
    description?: string;
    fullDescription?: string;
    tech?: string[];
    tags?: string[];
    cover_url?: string;
    imageUrl?: string;
    project_url?: string;
    link?: string;
    githubLink?: string;
    order?: number;
    isVisible?: boolean;
    createdAt: string;
    updatedAt?: string;
}

// Certification Types
export interface Certification {
    _id: string;
    title: string;
    issuer?: string;
    date?: string;
    description?: string;
    file_path: string;
    tags?: string[];
    createdAt: string;
}

// Contact Types
export interface Contact {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

// Admin Types
export interface Admin {
    id: string;
    email: string;
    name: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    admin: Admin;
}
