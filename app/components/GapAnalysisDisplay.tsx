import { GapAnalysis } from '@/types';

interface GapAnalysisDisplayProps {
  gapAnalysis: GapAnalysis;
}

export default function GapAnalysisDisplay({ gapAnalysis }: GapAnalysisDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">📊 Skill Gap Analysis</h2>

      {/* Overlapping Skills */}
      <div>
        <h3 className="text-lg font-semibold text-green-700 mb-3">
          ✅ Skills You Have ({gapAnalysis.overlapping_skills.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {gapAnalysis.overlapping_skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Missing Required Skills */}
      {gapAnalysis.missing_required_skills.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-red-700 mb-3">
            ❌ Required Skills You're Missing ({gapAnalysis.missing_required_skills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {gapAnalysis.missing_required_skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Preferred Skills */}
      {gapAnalysis.missing_preferred_skills.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-yellow-700 mb-3">
            ⚠️ Preferred Skills You're Missing ({gapAnalysis.missing_preferred_skills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {gapAnalysis.missing_preferred_skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}