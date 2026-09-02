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
  /** Skills the resume demonstrates in prose but never claims in a list. */
  weak_skills: string[];
  /** JD entries that are requirements, not technologies: degrees, durations. */
  non_skill_requirements?: string[];
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

/** How far a pipeline run got. `partial` and `complete` both arrive as 200. */
export type PipelineStatus = 'complete' | 'partial' | 'failed';

export interface PipelineFailure {
  node: string;
  error_type: string;
  message: string;
}

/**
 * A pipeline run's result.
 *
 * Every field after a failed step is null: the run halts at the node that
 * failed and returns what it produced rather than discarding it. These were
 * previously typed non-nullable, so a partial run type-checked and then threw
 * at runtime on `improved_resume.projects`.
 */
export interface PipelineResult {
  status: PipelineStatus;
  resume_id: number;
  job_id: number;
  /** Nodes that succeeded, in order. */
  completed_steps: string[];
  failures: PipelineFailure[];
  analysis_id: number | null;
  project_plan_id: number | null;
  improved_resume_id: number | null;
  gap_analysis: GapAnalysis | null;
  projects: ProjectIdea[];
  improved_resume: ImprovedResume | null;
}