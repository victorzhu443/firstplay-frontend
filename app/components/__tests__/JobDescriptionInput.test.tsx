import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JobDescriptionInput from '../JobDescriptionInput';
import { mockFetchResponse } from '@/test/fixtures';

const longDescription = 'Backend engineer. Required: Python, FastAPI, PostgreSQL, Docker, and AWS.';

describe('JobDescriptionInput', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('disables submit until there is input', async () => {
    const user = userEvent.setup();
    render(<JobDescriptionInput onSubmitComplete={vi.fn()} />);

    const submit = screen.getByRole('button', { name: 'Submit Job Description' });
    expect(submit).toBeDisabled();

    await user.type(screen.getByRole('textbox'), 'anything');
    expect(submit).toBeEnabled();
  });

  it('rejects descriptions shorter than 50 characters without calling the API', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const onSubmitComplete = vi.fn();
    render(<JobDescriptionInput onSubmitComplete={onSubmitComplete} />);

    await user.type(screen.getByRole('textbox'), 'too short');
    await user.click(screen.getByRole('button', { name: 'Submit Job Description' }));

    expect(await screen.findByText('Job description must be at least 50 characters')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(onSubmitComplete).not.toHaveBeenCalled();
  });

  it('posts pasted text to the manual endpoint and reports the job id', async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetchResponse({ job_id: 42 });
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com');
    const onSubmitComplete = vi.fn();
    render(<JobDescriptionInput onSubmitComplete={onSubmitComplete} />);

    await user.type(screen.getByRole('textbox'), longDescription);
    await user.click(screen.getByRole('button', { name: 'Submit Job Description' }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.example.com/api/job/description/manual');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({ jd_text: longDescription });
    expect(onSubmitComplete).toHaveBeenCalledWith(42);
  });

  it('posts a URL to the url endpoint when the URL tab is selected', async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetchResponse({ job_id: 7 });
    vi.stubGlobal('fetch', fetchMock);
    const onSubmitComplete = vi.fn();
    render(<JobDescriptionInput onSubmitComplete={onSubmitComplete} />);

    await user.click(screen.getByRole('button', { name: 'From URL' }));
    await user.type(screen.getByRole('textbox'), 'https://careers.example.com/jobs/1');
    await user.click(screen.getByRole('button', { name: 'Submit Job Description' }));

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/api\/job\/url$/);
    expect(JSON.parse(init.body)).toEqual({ url: 'https://careers.example.com/jobs/1' });
    expect(onSubmitComplete).toHaveBeenCalledWith(7);
  });

  it('shows the server error detail when submission fails', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', mockFetchResponse({ detail: 'Could not fetch that URL' }, false, 400));
    const onSubmitComplete = vi.fn();
    render(<JobDescriptionInput onSubmitComplete={onSubmitComplete} />);

    await user.type(screen.getByRole('textbox'), longDescription);
    await user.click(screen.getByRole('button', { name: 'Submit Job Description' }));

    expect(await screen.findByText('Could not fetch that URL')).toBeInTheDocument();
    expect(onSubmitComplete).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Submit Job Description' })).toBeEnabled();
  });
});
