import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <h1 className="text-5xl font-bold text-gray-900">
          Land Your First Tech Job
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          AI-powered resume analysis, skill gap identification, and personalized project ideas
          to help early-career CS students break into tech.
        </p>
        <Link
          href="/analyze"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Get Started →
        </Link>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 py-8">
        <FeatureCard
          icon="📄"
          title="Upload Resume"
          description="Upload your resume PDF and we'll extract and analyze your experience, skills, and projects."
        />
        <FeatureCard
          icon="🎯"
          title="Analyze Gaps"
          description="Compare your skills against job requirements to identify what you're missing."
        />
        <FeatureCard
          icon="💡"
          title="Get Projects"
          description="Receive personalized project ideas designed to fill your skill gaps and strengthen your resume."
        />
        <FeatureCard
          icon="✨"
          title="Improve Resume"
          description="Get your resume rewritten using Jake's Resume Template with action verbs and metrics."
        />
        <FeatureCard
          icon="🚀"
          title="Land Interviews"
          description="Build portfolio projects and submit tailored resumes to increase your interview chances."
        />
        <FeatureCard
          icon="🎓"
          title="Learn & Grow"
          description="Gain practical skills through hands-on projects that employers actually want to see."
        />
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          How It Works
        </h2>
        <div className="space-y-4">
          <Step number={1} title="Upload Your Resume" description="Start by uploading your current resume in PDF format." />
          <Step number={2} title="Submit a Job Description" description="Paste a job posting you're interested in or provide a URL." />
          <Step number={3} title="Get Your Analysis" description="Our AI analyzes your resume against the job requirements." />
          <Step number={4} title="Receive Project Ideas" description="Get 3-5 tailored project ideas to build missing skills." />
          <Step number={5} title="Download Improved Resume" description="Get your resume rewritten in Jake's format with metrics." />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}