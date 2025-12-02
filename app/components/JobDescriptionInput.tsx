'use client';

import { useState } from 'react';

interface JobDescriptionInputProps {
  onSubmitComplete: (jobId: number) => void;
}

export default function JobDescriptionInput({ onSubmitComplete }: JobDescriptionInputProps) {
  const [inputType, setInputType] = useState<'text' | 'url'>('text');
  const [jobText, setJobText] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      let endpoint = '';
      let body = {};

      if (inputType === 'text') {
        if (jobText.trim().length < 50) {
          throw new Error('Job description must be at least 50 characters');
        }
        endpoint = 'http://localhost:8000/api/job/description/manual';
        body = { jd_text: jobText };
      } else {
        if (!jobUrl.trim()) {
          throw new Error('Please enter a job URL');
        }
        endpoint = 'http://localhost:8000/api/job/url';
        body = { url: jobUrl };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Submission failed');
      }

      const data = await response.json();
      onSubmitComplete(data.job_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">💼 Job Description</h3>

      {/* Toggle between URL and Text */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setInputType('text')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            inputType === 'text'
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Paste Text
        </button>
        <button
          onClick={() => setInputType('url')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            inputType === 'url'
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          From URL
        </button>
      </div>

      {/* Input Area */}
      {inputType === 'text' ? (
        <textarea
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          placeholder="Paste the job description here...&#10;&#10;Example:&#10;Backend Software Engineer&#10;&#10;We're seeking a talented backend engineer...&#10;&#10;Required Skills:&#10;- Python&#10;- FastAPI&#10;- PostgreSQL"
          className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      ) : (
        <input
          type="url"
          value={jobUrl}
          onChange={(e) => setJobUrl(e.target.value)}
          placeholder="https://careers.company.com/jobs/12345"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting || (inputType === 'text' ? !jobText.trim() : !jobUrl.trim())}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit Job Description'}
      </button>
    </div>
  );
}