import { apiErrorMessage, humanizeStep } from '../apiError';

describe('apiErrorMessage', () => {
  it('returns a string detail as is', () => {
    expect(apiErrorMessage({ detail: 'Resume not found' }, 'fallback')).toBe('Resume not found');
  });

  it('falls back when detail is missing or blank', () => {
    expect(apiErrorMessage({}, 'fallback')).toBe('fallback');
    expect(apiErrorMessage({ detail: '   ' }, 'fallback')).toBe('fallback');
    expect(apiErrorMessage(null, 'fallback')).toBe('fallback');
    expect(apiErrorMessage(undefined, 'fallback')).toBe('fallback');
  });

  it('flattens FastAPI validation errors into field: message pairs', () => {
    const body = {
      detail: [
        { loc: ['body', 'jd_text'], msg: 'field required', type: 'missing' },
        { loc: ['query', 'limit'], msg: 'must be positive', type: 'value_error' },
      ],
    };
    expect(apiErrorMessage(body, 'fallback')).toBe(
      'jd_text: field required; query.limit: must be positive'
    );
  });

  it('uses the message alone when a validation item has no location', () => {
    expect(apiErrorMessage({ detail: [{ msg: 'bad input' }] }, 'fallback')).toBe('bad input');
  });

  it('falls back when the validation array carries no messages', () => {
    expect(apiErrorMessage({ detail: [{ loc: ['body'] }] }, 'fallback')).toBe('fallback');
  });

  it('names the failed pipeline step for a pipeline failure body', () => {
    const body = {
      detail: {
        status: 'failed',
        failures: [{ node: 'parse_resume', error_type: 'LLMError', message: 'Model timed out' }],
      },
    };
    expect(apiErrorMessage(body, 'fallback')).toBe(
      'Model timed out (failed during: reading your resume)'
    );
  });

  it('falls back for an object detail with no failures', () => {
    expect(apiErrorMessage({ detail: { status: 'failed', failures: [] } }, 'fallback')).toBe('fallback');
  });
});

describe('humanizeStep', () => {
  it('maps known pipeline nodes to plain phrases', () => {
    expect(humanizeStep('parse_resume')).toBe('reading your resume');
    expect(humanizeStep('parse_job')).toBe('reading the job description');
    expect(humanizeStep('analyze_gap')).toBe('comparing your skills');
    expect(humanizeStep('generate_projects')).toBe('generating project ideas');
    expect(humanizeStep('improve_resume')).toBe('rewriting your resume');
  });

  it('replaces underscores for unknown nodes', () => {
    expect(humanizeStep('some_new_step')).toBe('some new step');
  });
});
