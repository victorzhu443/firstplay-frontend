import { ProjectIdea } from '@/types';

interface ProjectIdeasDisplayProps {
  projects: ProjectIdea[];
}

export default function ProjectIdeasDisplay({ projects }: ProjectIdeasDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">💡 Personalized Project Ideas</h2>
      <p className="text-gray-600">
        Build these projects to fill your skill gaps and strengthen your resume:
      </p>

      <div className="space-y-6">
        {projects.map((project, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    project.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    project.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {project.difficulty}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    ⏱️ {project.estimated_duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-4">{project.description}</p>

            {/* Target Skills */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">🎯 Skills You'll Learn:</h4>
              <div className="flex flex-wrap gap-2">
                {project.skill_targets.map((skill, skillIdx) => (
                  <span
                    key={skillIdx}
                    className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">🛠️ Technologies:</h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, techIdx) => (
                  <span
                    key={techIdx}
                    className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">✨ Key Features to Build:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {project.key_features.map((feature, featureIdx) => (
                  <li key={featureIdx}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}