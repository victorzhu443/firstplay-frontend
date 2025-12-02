// API Response Types
export interface Resume {
  resume_id: number;
  original_filename: string;
  raw_text_preview: string;
}

export interface ParsedResume {
  name: string;
  email?: string;
  phone?: string;
  skills: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
}

export interface ExperienceItem {
  company: string;
  title: string;
  duration: string;
  bullets: string[];
}

export interface ProjectItem {
  name: string;
  description: string;
  technologies: string[];
  highlights: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  graduation_date: string;
  gpa?: string;
}

export interface JobDescription {
  job_id: number;
  text_preview: string;
}

export interface ParsedJob {
  job_title: string;
  company?: string;
  required_skills: string[];
  preferred_skills: string[];
  keywords: string[];
  responsibilities: string[];
  qualifications: string[];
}

export interface GapAnalysis {
  overlapping_skills: string[];
  missing_required_skills: string[];
  missing_preferred_skills: string[];
  weak_skills: string[];
}

export interface ProjectIdea {
  title: string;
  skill_targets: string[];
  difficulty: string;
  description: string;
  estimated_duration: string;
  key_features: string[];
  technologies: string[];
}

export interface ImprovedResume {
  name: string;
  contact: string;
  summary?: string;
  skills: string[];
  experience: ImprovedExperienceItem[];
  projects: ImprovedProjectItem[];
  education: (string | {
    institution: string;
    degree: string;
    graduation_date: string;
  })[];
}

export interface ImprovedExperienceItem {
  company: string;
  title: string;
  duration: string;
  bullets: string[];
}

export interface ImprovedProjectItem {
  name: string;
  technologies: string[];
  bullets: string[];
}

export interface PipelineResult {
  resume_id: number;
  job_id: number;
  analysis_id: number;
  project_plan_id: number;
  improved_resume_id: number;
  gap_analysis: GapAnalysis;
  projects: ProjectIdea[];
  improved_resume: ImprovedResume;
}