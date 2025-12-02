'use client';

import { useState } from 'react';
import ResumeUpload from '../components/ResumeUpload';
import JobDescriptionInput from '../components/JobDescriptionInput';
import GapAnalysisDisplay from '../components/GapAnalysisDisplay';
import ProjectIdeasDisplay from '../components/ProjectIdeasDisplay';
import ImprovedResumeDisplay from '../components/ImprovedResumeDisplay';
import { PipelineResult } from '@/types';

export default function AnalyzePage() {
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [jobId, setJobId] = useState<number | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<PipelineResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    if (!resumeId || !jobId) return;

    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/pipeline/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_id: resumeId, job_id: jobId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Analysis failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  // If we have results, show them
  if (results) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">📊 Analysis Results</h1>
          <p className="text-lg text-gray-600">
            Here's your personalized career development plan
          </p>
        </div>

        {/* Gap Analysis */}
        <GapAnalysisDisplay gapAnalysis={results.gap_analysis} />

        {/* Project Ideas */}
        <ProjectIdeasDisplay projects={results.projects} />

        {/* Improved Resume */}
        <ImprovedResumeDisplay improvedResume={results.improved_resume} />

        {/* Start Over Button */}
        <div className="text-center">
          <button
            onClick={() => {
              setResults(null);
              setResumeId(null);
              setJobId(null);
            }}
            className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Start New Analysis
          </button>
        </div>
      </div>
    );
  }

  // Otherwise, show the upload form
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Analyze Your Resume</h1>
        <p className="text-lg text-gray-600">
          Upload your resume and job description to get personalized insights
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4">
        <Step number={1} label="Upload Resume" completed={resumeId !== null} />
        <div className="w-12 h-0.5 bg-gray-300" />
        <Step number={2} label="Job Description" completed={jobId !== null} />
        <div className="w-12 h-0.5 bg-gray-300" />
        <Step number={3} label="Analyze" completed={false} />
      </div>

      {/* Upload Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        <ResumeUpload onUploadComplete={(id) => setResumeId(id)} />
        <JobDescriptionInput onSubmitComplete={(id) => setJobId(id)} />
      </div>

      {/* Success Messages */}
      {resumeId && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          ✅ Resume uploaded successfully (ID: {resumeId})
        </div>
      )}
      {jobId && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          ✅ Job description submitted successfully (ID: {jobId})
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          ❌ {error}
        </div>
      )}

      {/* Run Analysis Button */}
      {resumeId && jobId && (
        <div className="text-center">
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="bg-green-600 text-white px-12 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            {analyzing ? '🔄 Analyzing... (This may take 20-30 seconds)' : '🚀 Run Analysis'}
          </button>
        </div>
      )}
    </div>
  );
}

function Step({ number, label, completed }: { number: number; label: string; completed: boolean }) {
  return (
    <div className="flex flex-col items-center space-y-1">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
          completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
        }`}
      >
        {completed ? '✓' : number}
      </div>
      <span className="text-xs font-medium text-gray-600">{label}</span>
    </div>
  );
}