import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImprovedResumeDisplay from '../ImprovedResumeDisplay';
import { improvedResume } from '@/test/fixtures';

const jsPDFInstance = {
  internal: { pageSize: { getWidth: () => 210 } },
  setFontSize: vi.fn(),
  setFont: vi.fn(),
  splitTextToSize: vi.fn((text: string) => [text]),
  text: vi.fn(),
  addPage: vi.fn(),
  save: vi.fn(),
};

vi.mock('jspdf', () => ({
  default: class MockJsPDF {
    constructor() {
      return jsPDFInstance;
    }
  },
}));

describe('ImprovedResumeDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders every section of the resume', () => {
    render(<ImprovedResumeDisplay improvedResume={improvedResume} />);

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('ada@example.com | 555-0100')).toBeInTheDocument();
    expect(screen.getByText('Backend engineer who ships.')).toBeInTheDocument();
    expect(screen.getByText('Python • FastAPI')).toBeInTheDocument();
    expect(screen.getByText('Analytical Engines')).toBeInTheDocument();
    expect(screen.getByText('Built a loom compiler in Python')).toBeInTheDocument();
    expect(screen.getByText('Difference Engine')).toBeInTheDocument();
    expect(screen.getByText('Computed polynomial tables')).toBeInTheDocument();
  });

  it('renders education entries whether they are strings or objects', () => {
    render(<ImprovedResumeDisplay improvedResume={improvedResume} />);

    expect(screen.getByText('Self-taught, 1840')).toBeInTheDocument();
    expect(screen.getByText(/Cornell University – B\.S\. Computer Science, May 2028/)).toBeInTheDocument();
  });

  it('omits the summary section when there is no summary', () => {
    render(<ImprovedResumeDisplay improvedResume={{ ...improvedResume, summary: undefined }} />);
    expect(screen.queryByText('SUMMARY')).not.toBeInTheDocument();
  });

  it('downloads a PDF by default', async () => {
    const user = userEvent.setup();
    render(<ImprovedResumeDisplay improvedResume={improvedResume} />);

    await user.click(screen.getByRole('button', { name: /Download PDF/ }));

    expect(jsPDFInstance.save).toHaveBeenCalledWith('Ada_Lovelace_Resume.pdf');
  });

  it('switches to LaTeX and downloads a .tex file with the resume content', async () => {
    const user = userEvent.setup();
    const createObjectURL = vi.fn((_blob: Blob) => 'blob:resume');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL });
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<ImprovedResumeDisplay improvedResume={improvedResume} />);

    await user.selectOptions(screen.getByRole('combobox'), 'latex');
    await user.click(screen.getByRole('button', { name: /Download LATEX/ }));

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    const blob = createObjectURL.mock.calls[0][0];
    const latex = await blob.text();
    expect(latex).toContain('\\documentclass[11pt,letterpaper]{article}');
    expect(latex).toContain('\\textbf{Ada Lovelace}');
    expect(latex).toContain('\\textbf{Analytical Engines} -- Software Engineer');
    expect(latex).toContain('\\item Computed polynomial tables');
    expect(latex).toContain('Cornell University -- B.S. Computer Science, May 2028');
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:resume');
    expect(jsPDFInstance.save).not.toHaveBeenCalled();

    clickSpy.mockRestore();
    vi.unstubAllGlobals();
  });
});
