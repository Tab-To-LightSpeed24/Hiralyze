export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  projects?: ProjectEntry[];
  matchScore: number;
  justification: string;
  resumeFileName: string;
  suggestedRole?: string;
  ugCgpa?: number;
  // New fields for scoring transparency
  matchedKeywords?: string[];
  totalKeywords?: number;
  matchPercentage?: number;
}

export interface ExperienceEntry {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  gpa?: number;
  description?: string[]; // Added to hold raw text for analysis
}

export interface ProjectEntry {
  title: string;
  description: string;
  technologies?: string[];
}

export interface JobDescription {
  text: string;
}