import type { GapAnalysis, ImprovedResume, ProjectIdea } from '@/types';

export const gapAnalysis: GapAnalysis = {
  overlapping_skills: ['Python', 'FastAPI', 'PostgreSQL'],
  missing_required_skills: ['Kubernetes'],
  missing_preferred_skills: ['Terraform', 'Go'],
  weak_skills: [],
};

export const projectIdea: ProjectIdea = {
  title: 'Cluster Cost Dashboard',
  skill_targets: ['Kubernetes', 'Prometheus'],
  difficulty: 'Intermediate',
  description: 'Track per-namespace spend across a Kubernetes cluster.',
  estimated_duration: '2 weeks',
  key_features: ['Namespace cost breakdown', 'Alert on budget overrun'],
  technologies: ['Helm', 'Grafana'],
};

export const improvedResume: ImprovedResume = {
  name: 'Ada Lovelace',
  contact: 'ada@example.com | 555-0100',
  summary: 'Backend engineer who ships.',
  skills: ['Python', 'FastAPI'],
  experience: [
    {
      company: 'Analytical Engines',
      title: 'Software Engineer',
      duration: '2024 - 2025',
      bullets: ['Built a loom compiler in Python'],
    },
  ],
  projects: [
    {
      name: 'Difference Engine',
      technologies: ['Brass', 'Steam'],
      bullets: ['Computed polynomial tables'],
    },
  ],
  education: [
    'Self-taught, 1840',
    { institution: 'Cornell University', degree: 'B.S. Computer Science', graduation_date: 'May 2028' },
  ],
};

/** Build a fetch mock that resolves with the given status and JSON body. */
export function mockFetchResponse(body: unknown, ok = true, status = ok ? 200 : 400) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
  } as Response);
}
