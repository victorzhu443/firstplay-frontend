import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResumeUpload from '../ResumeUpload';
import { mockFetchResponse } from '@/test/fixtures';

function pdfFile(name = 'resume.pdf', sizeBytes = 1024) {
  const file = new File(['%PDF-1.4'], name, { type: 'application/pdf' });
  Object.defineProperty(file, 'size', { value: sizeBytes });
  return file;
}

function fileInput() {
  return document.getElementById('resume-upload') as HTMLInputElement;
}

describe('ResumeUpload', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('disables upload until a file is chosen', async () => {
    const user = userEvent.setup();
    render(<ResumeUpload onUploadComplete={vi.fn()} />);

    const upload = screen.getByRole('button', { name: 'Upload Resume' });
    expect(upload).toBeDisabled();

    await user.upload(fileInput(), pdfFile());

    expect(screen.getByText('resume.pdf')).toBeInTheDocument();
    expect(upload).toBeEnabled();
  });

  it('rejects files that are not PDFs', async () => {
    const user = userEvent.setup({ applyAccept: false });
    render(<ResumeUpload onUploadComplete={vi.fn()} />);

    const docx = new File(['x'], 'resume.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    await user.upload(fileInput(), docx);

    expect(await screen.findByText('Please upload a PDF file')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload Resume' })).toBeDisabled();
  });

  it('rejects PDFs over 5 MB before uploading', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(<ResumeUpload onUploadComplete={vi.fn()} />);

    await user.upload(fileInput(), pdfFile('big.pdf', 6 * 1024 * 1024));

    expect(await screen.findByText('That file is 6.0 MB. The maximum is 5 MB.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload Resume' })).toBeDisabled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('uploads the file as multipart form data and reports the resume id', async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetchResponse({ resume_id: 11 });
    vi.stubGlobal('fetch', fetchMock);
    const onUploadComplete = vi.fn();
    render(<ResumeUpload onUploadComplete={onUploadComplete} />);

    await user.upload(fileInput(), pdfFile());
    await user.click(screen.getByRole('button', { name: 'Upload Resume' }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/api\/resume\/upload$/);
    expect(init.method).toBe('POST');
    expect(init.body).toBeInstanceOf(FormData);
    expect((init.body as FormData).get('file')).toBeInstanceOf(File);
    expect(onUploadComplete).toHaveBeenCalledWith(11);
  });

  it('shows the server error detail when the upload fails', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', mockFetchResponse({ detail: 'Could not extract text' }, false, 422));
    const onUploadComplete = vi.fn();
    render(<ResumeUpload onUploadComplete={onUploadComplete} />);

    await user.upload(fileInput(), pdfFile());
    await user.click(screen.getByRole('button', { name: 'Upload Resume' }));

    expect(await screen.findByText('Could not extract text')).toBeInTheDocument();
    expect(onUploadComplete).not.toHaveBeenCalled();
  });
});
