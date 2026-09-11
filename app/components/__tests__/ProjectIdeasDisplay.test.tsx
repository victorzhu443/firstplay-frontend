import { render, screen } from '@testing-library/react';
import ProjectIdeasDisplay from '../ProjectIdeasDisplay';
import { projectIdea } from '@/test/fixtures';

describe('ProjectIdeasDisplay', () => {
  it('renders each project with its title, description, skills, tech, and features', () => {
    render(<ProjectIdeasDisplay projects={[projectIdea]} />);

    expect(screen.getByText('Cluster Cost Dashboard')).toBeInTheDocument();
    expect(screen.getByText(projectIdea.description)).toBeInTheDocument();
    expect(screen.getByText('2 weeks', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Prometheus')).toBeInTheDocument();
    expect(screen.getByText('Helm')).toBeInTheDocument();
    expect(screen.getByText('Grafana')).toBeInTheDocument();
    expect(screen.getByText('Namespace cost breakdown')).toBeInTheDocument();
    expect(screen.getByText('Alert on budget overrun')).toBeInTheDocument();
  });

  it('colors the difficulty badge by level', () => {
    const { rerender } = render(<ProjectIdeasDisplay projects={[{ ...projectIdea, difficulty: 'Beginner' }]} />);
    expect(screen.getByText('Beginner')).toHaveClass('bg-green-100');

    rerender(<ProjectIdeasDisplay projects={[{ ...projectIdea, difficulty: 'Intermediate' }]} />);
    expect(screen.getByText('Intermediate')).toHaveClass('bg-yellow-100');

    rerender(<ProjectIdeasDisplay projects={[{ ...projectIdea, difficulty: 'Advanced' }]} />);
    expect(screen.getByText('Advanced')).toHaveClass('bg-red-100');
  });

  it('renders the heading even with no projects', () => {
    render(<ProjectIdeasDisplay projects={[]} />);
    expect(screen.getByText(/Personalized Project Ideas/)).toBeInTheDocument();
  });
});
