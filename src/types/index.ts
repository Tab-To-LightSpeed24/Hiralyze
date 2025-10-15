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
  projects?: ProjectEntry[]; // Optional, as not all resumes have a dedicated project section
  matchScore: number;
  justification: string;
  resumeFileName: string;
  suggestedRole?: string;
  ugCgpa?: number; // Added for academic criteria
}

export interface ExperienceEntry {
  title: string;
  company: string;
  startDate: string;
  endDate: string; // Can be "Present"
  description: string[]; // Bullet points or summary
}

export interface EducationEntry {
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  gpa?: number; // CGPA/Percentage
}

export interface ProjectEntry {
  title: string;
  description: string;
  technologies?: string[];
}

export interface JobDescription {
  text: string;
}