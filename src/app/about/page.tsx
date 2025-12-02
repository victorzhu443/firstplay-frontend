export default function About() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">About FirstPlay Coach</h1>
      
      <div className="bg-white rounded-lg shadow-md p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed">
          FirstPlay Coach helps early-career computer science students land their first tech job
          by providing AI-powered resume analysis, skill gap identification, and personalized
          project recommendations.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">What We Do</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Analyze your resume against job descriptions</li>
          <li>Identify skill gaps and missing qualifications</li>
          <li>Generate tailored project ideas to build portfolio</li>
          <li>Rewrite resumes using Jake's Resume Template format</li>
          <li>Provide actionable advice for career development</li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Technology Stack</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Backend</h3>
            <ul className="text-gray-700 space-y-1">
              <li>• FastAPI (Python)</li>
              <li>• LangChain & LangGraph</li>
              <li>• OpenAI GPT-4</li>
              <li>• SQLite Database</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Frontend</h3>
            <ul className="text-gray-700 space-y-1">
              <li>• Next.js 14</li>
              <li>• TypeScript</li>
              <li>• Tailwind CSS</li>
              <li>• React</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}