import { render, screen } from '@testing-library/react';
import GapAnalysisDisplay from '../GapAnalysisDisplay';
import { gapAnalysis } from '@/test/fixtures';

describe('GapAnalysisDisplay', () => {
  it('lists overlapping skills with a count in the heading', () => {
    render(<GapAnalysisDisplay gapAnalysis={gapAnalysis} />);

    expect(screen.getByText(/Skills You Have \(3\)/)).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('FastAPI')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
  });

  it('shows required and preferred gaps when present', () => {
    render(<GapAnalysisDisplay gapAnalysis={gapAnalysis} />);

    expect(screen.getByText(/Required Skills You're Missing \(1\)/)).toBeInTheDocument();
    expect(screen.getByText('Kubernetes')).toBeInTheDocument();
    expect(screen.getByText(/Preferred Skills You're Missing \(2\)/)).toBeInTheDocument();
    expect(screen.getByText('Terraform')).toBeInTheDocument();
    expect(screen.getByText('Go')).toBeInTheDocument();
  });

  it('hides the gap sections when there is nothing missing', () => {
    render(
      <GapAnalysisDisplay
        gapAnalysis={{ ...gapAnalysis, missing_required_skills: [], missing_preferred_skills: [] }}
      />
    );

    expect(screen.queryByText(/Required Skills You're Missing/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Preferred Skills You're Missing/)).not.toBeInTheDocument();
  });
});
